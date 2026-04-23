import { Component, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PurchaseReturnService } from './purchase-return.service';
import { SupplierService } from '../../masters/supplier/supplier.service';
import { WarehouseService } from '../../masters/warehouse/warehouse.service';
import { CurrencyService } from '../../masters/currency/currency.service';
import { StockService } from '../../masters/stock/stock.service';
import { UnitService } from '../../masters/unit/unit.service';
import { StockOpeningBalanceService } from '../../masters/stock-opening-balance/stock-opening-balance.service';
import { SupplierResponseModel } from '../../core/models/supplier';
import { WarehouseResponseModel } from '../../core/models/warehouse/warehouse-response.model';
import { CurrencyResponseModel } from '../../core/models/currency/currency-response.model';
import { StockDetailLookupModel } from '../../core/models/stock/stock-detail-lookup.model';
import { UnitResponseModel } from '../../core/models/unit/unit-response.model';
import { EditablePurchasingLine } from '../../core/models/purchasing';
import {
  PurchaseReturnResponseModel,
  CreatePurchaseReturnRequest,
  OutstandingInvoiceModel,
} from '../../core/models/purchase-return';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-purchase-return',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    ToastModule,
    DialogModule,
    DatePickerModule,
    SelectModule,
    CheckboxModule,
    IconFieldModule,
    InputIconModule,
    ConfirmDialogModule,
    DividerModule,
    ToolbarModule,
  ],
  templateUrl: './purchase-return.component.html',
  providers: [MessageService, ConfirmationService],
})
export class PurchaseReturnComponent implements OnInit {
  // List
  purchaseReturnList = signal<PurchaseReturnResponseModel[]>([]);
  listSearch = '';

  // Dialog state
  dialogVisible = false;
  isNew = true;
  currentId: string | null = null;
  submitted = false;

  // Header fields
  invoiceNo = '';
  date: Date = new Date();
  dueDate: Date | null = null;
  supplierId: string | null = null;
  warehouseId: string | null = null;
  currencyId: string | null = null;
  returnMode: 'cash' | 'offset' = 'cash';
  discount1 = 0;
  discount2 = 0;
  discount3 = 0;
  discount = 0;
  freight = 0;
  freightPct = 0;
  tax = 0;
  po = '';
  taxInvoice = '';
  remark = '';
  sj = '';
  tglSj: Date | null = null;
  isPaid = false;
  scan1 = '';
  scan2 = '';
  scan3 = '';
  scan4 = '';
  returnTo = '';
  invoiceReturnTo: string | null = null;
  selectedOutstandingInvoice: OutstandingInvoiceModel | null = null;

  // Detail lines
  lines = signal<EditablePurchasingLine[]>([]);

  // Lookup data
  suppliers = signal<SupplierResponseModel[]>([]);
  warehouses = signal<WarehouseResponseModel[]>([]);
  currencies = signal<CurrencyResponseModel[]>([]);
  stockDetails = signal<StockDetailLookupModel[]>([]);
  units = signal<UnitResponseModel[]>([]);
  outstandingInvoices = signal<OutstandingInvoiceModel[]>([]);

  // Return mode options
  returnModeOptions = [
    { label: 'Cash', value: 'cash' },
    { label: 'Offset', value: 'offset' },
  ];

  // Stock lookup dialog
  stockLookupVisible = false;
  stockLookupSearch = '';
  stockLookupTargetRowIndex: number | null = null;

  // Outstanding invoice lookup dialog
  outstandingLookupVisible = false;
  outstandingLookupSearch = '';

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private purchaseReturnService: PurchaseReturnService,
    private supplierService: SupplierService,
    private warehouseService: WarehouseService,
    private currencyService: CurrencyService,
    private stockService: StockService,
    private unitService: UnitService,
    private stockOpeningBalanceService: StockOpeningBalanceService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadList();
    this.loadSuppliers();
    this.loadWarehouses();
    this.loadCurrencies();
    this.loadStockDetails();
    this.loadUnits();
  }

  loadList(): void {
    this.purchaseReturnService.getPurchaseReturnList().subscribe({
      next: (data) => this.purchaseReturnList.set(data),
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load purchase return list' }),
    });
  }

  loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe({
      next: (data) => this.suppliers.set(data),
      error: () => console.error('Failed to load suppliers'),
    });
  }

  loadWarehouses(): void {
    this.warehouseService.getWarehouses().subscribe({
      next: (data) => this.warehouses.set(data),
      error: () => console.error('Failed to load warehouses'),
    });
  }

  loadCurrencies(): void {
    this.currencyService.getCurrencies().subscribe({
      next: (data) => this.currencies.set(data),
      error: () => console.error('Failed to load currencies'),
    });
  }

  loadStockDetails(): void {
    this.stockService.getStockDetailsForLookup().subscribe({
      next: (data) => this.stockDetails.set(data),
      error: () => console.error('Failed to load stock details'),
    });
  }

  loadUnits(): void {
    this.unitService.getUnits().subscribe({
      next: (data) => this.units.set(data),
      error: () => console.error('Failed to load units'),
    });
  }

  loadOutstandingInvoices(): void {
    if (!this.supplierId || !this.currencyId) {
      this.outstandingInvoices.set([]);
      this.selectedOutstandingInvoice = null;
      this.invoiceReturnTo = null;
      return;
    }
    this.purchaseReturnService.getOutstandingInvoices(this.supplierId, this.currencyId).subscribe({
      next: (data) => this.outstandingInvoices.set(data),
      error: () => console.error('Failed to load outstanding invoices'),
    });
  }

  onReturnModeChange(): void {
    if (this.returnMode === 'cash') {
      this.invoiceReturnTo = null;
      this.returnTo = '';
      this.selectedOutstandingInvoice = null;
    } else {
      this.loadOutstandingInvoices();
    }
  }

  onSupplierChange(): void {
    if (this.returnMode === 'offset') {
      this.invoiceReturnTo = null;
      this.returnTo = '';
      this.selectedOutstandingInvoice = null;
      this.loadOutstandingInvoices();
    }
  }

  onCurrencyChange(): void {
    if (this.returnMode === 'offset') {
      this.invoiceReturnTo = null;
      this.returnTo = '';
      this.selectedOutstandingInvoice = null;
      this.loadOutstandingInvoices();
    }
  }

  // ── List actions ──────────────────────────────────────────────────────────

  openNew(): void {
    this.resetForm();
    this.isNew = true;
    this.currentId = null;
    this.dialogVisible = true;
  }

  editRecord(record: PurchaseReturnResponseModel): void {
    this.purchaseReturnService.getPurchaseReturn(record.id).subscribe({
      next: (data) => {
        this.isNew = false;
        this.currentId = data.id;
        this.invoiceNo = data.invoiceNo ?? '';
        this.date = data.date ? new Date(data.date) : new Date();
        this.dueDate = data.dueDate ? new Date(data.dueDate) : null;
        this.supplierId = data.supplierId;
        this.warehouseId = data.warehouseId;
        this.currencyId = data.currencyId;
        this.returnMode = data.isCash ? 'cash' : 'offset';
        this.discount1 = data.discount1;
        this.discount2 = data.discount2;
        this.discount3 = data.discount3;
        this.discount = data.discount;
        this.freight = data.freight;
        this.freightPct = data.freightPct;
        this.tax = data.tax;
        this.po = data.po ?? '';
        this.taxInvoice = data.taxInvoice ?? '';
        this.remark = data.remark ?? '';
        this.sj = data.sj ?? '';
        this.tglSj = data.tglSj ? new Date(data.tglSj) : null;
        this.isPaid = data.isPaid;
        this.scan1 = data.scan1 ?? '';
        this.scan2 = data.scan2 ?? '';
        this.scan3 = data.scan3 ?? '';
        this.scan4 = data.scan4 ?? '';
        this.returnTo = data.returnTo ?? '';
        this.invoiceReturnTo = data.invoiceReturnTo ?? null;

        if (this.returnMode === 'offset' && this.invoiceReturnTo) {
          this.loadOutstandingInvoices();
        }

        const editableLines: EditablePurchasingLine[] = (data.lines ?? []).map((l) => ({
          stockId: l.stockId ?? '',
          stockCode: l.stockCode ?? '',
          stockName: l.stockName ?? '',
          unit: (this.getUnitDescription(l.unit) || l.unit) ?? '',
          qty: l.qty,
          price: l.price,
          disc1: l.disc1,
          disc2: l.disc2,
          disc3: l.disc3,
          disc: l.disc,
          amount: l.amount ?? 0,
          onHand: l.onHand,
          taxable: l.taxable,
        }));
        this.lines.set(editableLines);
        this.submitted = false;
        this.dialogVisible = true;
        this.cdr.detectChanges();
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load record' }),
    });
  }

  deleteRecord(record: PurchaseReturnResponseModel): void {
    this.confirmationService.confirm({
      message: `Delete purchase return invoice "${record.invoiceNo}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.purchaseReturnService.deletePurchaseReturn(record.id).subscribe({
          next: () => {
            this.purchaseReturnList.update((list) => list.filter((r) => r.id !== record.id));
            this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Record deleted' });
          },
          error: (err) => this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err?.error?.message ?? 'Failed to delete',
          }),
        });
      },
    });
  }

  // ── Form ──────────────────────────────────────────────────────────────────

  resetForm(): void {
    this.invoiceNo = '';
    this.date = new Date();
    this.dueDate = null;
    this.supplierId = null;
    this.warehouseId = null;
    this.currencyId = null;
    this.returnMode = 'cash';
    this.discount1 = 0;
    this.discount2 = 0;
    this.discount3 = 0;
    this.discount = 0;
    this.freight = 0;
    this.freightPct = 0;
    this.tax = 0;
    this.po = '';
    this.taxInvoice = '';
    this.remark = '';
    this.sj = '';
    this.tglSj = null;
    this.isPaid = false;
    this.scan1 = '';
    this.scan2 = '';
    this.scan3 = '';
    this.scan4 = '';
    this.returnTo = '';
    this.invoiceReturnTo = null;
    this.selectedOutstandingInvoice = null;
    this.outstandingInvoices.set([]);
    this.lines.set([]);
    this.submitted = false;
  }

  hideDialog(): void {
    this.dialogVisible = false;
    this.resetForm();
  }

  saveRecord(): void {
    this.submitted = true;
    if (!this.invoiceNo?.trim() || !this.supplierId || !this.warehouseId || !this.date || !this.dueDate || !this.currencyId) return;
    if (this.isDuplicateInvoiceNo) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Duplicate Invoice No',
        detail: `Invoice No "${this.invoiceNo.trim().toUpperCase()}" already exists.`,
      });
      return;
    }

    const isCash = this.returnMode === 'cash';

    if (!isCash) {
      if (!this.invoiceReturnTo) {
        this.messageService.add({ severity: 'warn', summary: 'Required', detail: 'Please select an invoice to offset against.' });
        return;
      }
      if (this.selectedOutstandingInvoice && this.totalAmount > this.selectedOutstandingInvoice.balance) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Over Offset',
          detail: `Return total (${this.totalAmount.toFixed(2)}) exceeds the outstanding balance (${this.selectedOutstandingInvoice.balance.toFixed(2)}).`,
        });
        return;
      }
    }

    const payload: CreatePurchaseReturnRequest = {
      invoiceNo: this.invoiceNo.trim().toUpperCase(),
      date: this.date.toISOString().split('T')[0],
      supplierId: this.supplierId,
      warehouseId: this.warehouseId,
      currencyId: this.currencyId,
      dueDate: this.dueDate ? this.dueDate.toISOString().split('T')[0] : null,
      isCash,
      discount1: this.discount1,
      discount2: this.discount2,
      discount3: this.discount3,
      discount: this.discount,
      freight: this.freight,
      freightPct: this.freightPct,
      tax: this.tax,
      po: this.po || null,
      taxInvoice: this.taxInvoice || null,
      remark: this.remark || null,
      sj: this.sj || null,
      tglSj: this.tglSj ? this.tglSj.toISOString().split('T')[0] : null,
      isPaid: this.isPaid,
      scan1: this.scan1 || null,
      scan2: this.scan2 || null,
      scan3: this.scan3 || null,
      scan4: this.scan4 || null,
      returnTo: this.returnTo || null,
      invoiceReturnTo: isCash ? null : this.invoiceReturnTo,
      lines: this.lines().map((l) => ({
        stockId: l.stockId,
        stockCode: l.stockCode,
        unit: l.unit,
        qty: l.qty,
        price: l.price,
        disc1: l.disc1,
        disc2: l.disc2,
        disc3: l.disc3,
        disc: l.disc,
        amount: l.amount,
        onHand: l.onHand,
        taxable: l.taxable,
      })),
    };

    const request$ = this.isNew
      ? this.purchaseReturnService.createPurchaseReturn(payload)
      : this.purchaseReturnService.updatePurchaseReturn(this.currentId!, payload);

    request$.subscribe({
      next: () => {
        this.loadList();
        this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Record saved successfully' });
        this.hideDialog();
      },
      error: (err) => this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: err?.error?.message ?? 'Failed to save',
      }),
    });
  }

  // ── Line management ───────────────────────────────────────────────────────

  get headerLocked(): boolean {
    return this.lines().length > 0;
  }

  get isDuplicateInvoiceNo(): boolean {
    const no = this.invoiceNo.trim().toUpperCase();
    if (!no) return false;
    return this.purchaseReturnList().some(
      (r) => r.invoiceNo?.toUpperCase() === no && r.id !== this.currentId,
    );
  }

  private validateHeader(): boolean {
    if (!this.invoiceNo.trim() || !this.warehouseId || !this.date || !this.dueDate || !this.currencyId || !this.supplierId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Required Fields',
        detail: 'Please fill in Invoice No, Warehouse, Date, Due Date, Currency, and Supplier before adding lines.',
      });
      return false;
    }
    if (this.isDuplicateInvoiceNo) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Duplicate Invoice No',
        detail: `Invoice No "${this.invoiceNo.trim().toUpperCase()}" already exists.`,
      });
      return false;
    }
    return true;
  }

  addEmptyRow(): void {
    if (!this.headerLocked && !this.validateHeader()) return;
    this.lines.update((lines) => [
      ...lines,
      { stockId: '', stockCode: '', stockName: '', unit: '', qty: 0, price: 0, disc1: 0, disc2: 0, disc3: 0, disc: 0, amount: 0, onHand: 0, taxable: false },
    ]);
  }

  removeRow(index: number): void {
    this.lines.update((lines) => lines.filter((_, i) => i !== index));
    this.recomputeAllLineAmounts();
  }

  computeLineAmount(line: EditablePurchasingLine): void {
    line.amount =
      line.qty *
      line.price *
      (1 - line.disc1 / 100) *
      (1 - line.disc2 / 100) *
      (1 - line.disc3 / 100) -
      line.disc;
  }

  recomputeAllLineAmounts(): void {
    this.lines.update((lines) =>
      lines.map((l) => ({
        ...l,
        amount:
          l.qty *
          l.price *
          (1 - l.disc1 / 100) *
          (1 - l.disc2 / 100) *
          (1 - l.disc3 / 100) -
          l.disc,
      })),
    );
  }

  get totalAmount(): number {
    const lines = this.lines();
    const lineCount = lines.length || 1;
    const sum = lines.reduce((acc, line) => {
      const lineNet =
        (line.amount ?? 0) *
        (1 - this.discount1 / 100) *
        (1 - this.discount2 / 100) *
        (1 - this.discount3 / 100) -
        this.discount / lineCount;
      return acc + (line.taxable ? lineNet * (1 + this.tax / 100) : lineNet);
    }, 0);
    return sum + this.freight;
  }

  // ── Outstanding invoice lookup ────────────────────────────────────────────

  openOutstandingLookup(): void {
    this.outstandingLookupSearch = '';
    this.outstandingLookupVisible = true;
  }

  get filteredOutstandingInvoices(): OutstandingInvoiceModel[] {
    const q = this.outstandingLookupSearch.toLowerCase();
    if (!q) return this.outstandingInvoices();
    return this.outstandingInvoices().filter(
      (inv) => inv.invoiceNo?.toLowerCase().includes(q),
    );
  }

  onSelectOutstandingInvoice(inv: OutstandingInvoiceModel): void {
    this.invoiceReturnTo = inv.id;
    this.returnTo = inv.invoiceNo;
    this.selectedOutstandingInvoice = inv;
    this.outstandingLookupVisible = false;
  }

  // ── Stock lookup ──────────────────────────────────────────────────────────

  openStockLookupToAdd(): void {
    if (!this.headerLocked && !this.validateHeader()) return;
    this.stockLookupTargetRowIndex = null;
    this.stockLookupSearch = '';
    this.stockLookupVisible = true;
  }

  openStockLookupForRow(index: number): void {
    this.stockLookupTargetRowIndex = index;
    this.stockLookupSearch = '';
    this.stockLookupVisible = true;
  }

  get filteredStockDetails(): StockDetailLookupModel[] {
    const q = this.stockLookupSearch.toLowerCase();
    if (!q) return this.stockDetails();
    return this.stockDetails().filter(
      (d) =>
        d.stockCode?.toLowerCase().includes(q) ||
        d.stockName?.toLowerCase().includes(q),
    );
  }

  getUnitDescription(unitId: string | null | undefined): string {
    if (!unitId) return '';
    return this.units().find((u) => u.id === unitId)?.description ?? unitId;
  }

  private fetchOnHand(stockId: string, lineIndex: number): void {
    if (!stockId || !this.warehouseId) return;
    this.stockOpeningBalanceService.getOnHand(stockId, this.warehouseId).subscribe({
      next: (res) => {
        this.lines.update((lines) => {
          const updated = [...lines];
          if (updated[lineIndex]) {
            updated[lineIndex] = { ...updated[lineIndex], onHand: res.onHand ?? 0 };
          }
          return updated;
        });
      },
    });
  }

  onSelectStock(detail: StockDetailLookupModel): void {
    const price = detail.purchase ?? 0;
    const newLine: EditablePurchasingLine = {
      stockId: detail.stockId,
      stockCode: detail.stockCode ?? '',
      stockName: detail.stockName ?? '',
      unit: this.getUnitDescription(detail.unit),
      qty: 1,
      price,
      disc1: 0,
      disc2: 0,
      disc3: 0,
      disc: 0,
      amount: price,
      onHand: 0,
      taxable: false,
    };

    if (this.stockLookupTargetRowIndex !== null) {
      const idx = this.stockLookupTargetRowIndex;
      this.lines.update((lines) => {
        const updated = [...lines];
        updated[idx] = newLine;
        return updated;
      });
      this.fetchOnHand(detail.stockId, idx);
    } else {
      this.lines.update((lines) => [...lines, newLine]);
      this.fetchOnHand(detail.stockId, this.lines().length - 1);
    }

    this.stockLookupVisible = false;
  }

  onStockCodeBlur(index: number): void {
    const line = this.lines()[index];
    if (!line.stockCode) return;
    const code = line.stockCode.toUpperCase();
    const found = this.stockDetails().find((d) => d.stockCode?.toUpperCase() === code);
    if (found) {
      this.lines.update((lines) => {
        const updated = [...lines];
        updated[index] = {
          ...updated[index],
          stockId: found.stockId,
          stockCode: found.stockCode ?? code,
          stockName: found.stockName ?? '',
          unit: this.getUnitDescription(found.unit) || updated[index].unit,
          price: found.purchase ?? updated[index].price,
        };
        this.computeLineAmount(updated[index]);
        return updated;
      });
      this.fetchOnHand(found.stockId, index);
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Not Found', detail: `Stock code "${code}" not found` });
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  getSupplierName(id: string | null): string {
    if (!id) return '-';
    return this.suppliers().find((s) => s.id === id)?.name ?? id;
  }

  getWarehouseName(id: string | null): string {
    if (!id) return '-';
    return this.warehouses().find((w) => w.id === id)?.description ?? id;
  }

  getCurrencyName(id: string | null): string {
    if (!id) return '-';
    return this.currencies().find((c) => c.id === id)?.currency ?? id;
  }
}
