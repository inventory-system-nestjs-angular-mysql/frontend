import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupplierPaymentService } from './supplier-payment.service';
import { WarehouseService } from '../../masters/warehouse/warehouse.service';
import { CurrencyService } from '../../masters/currency/currency.service';
import { BankService } from '../../masters/bank/bank.service';
import { SupplierService } from '../../masters/supplier/supplier.service';
import { WarehouseResponseModel } from '../../core/models/warehouse/warehouse-response.model';
import { CurrencyResponseModel } from '../../core/models/currency/currency-response.model';
import { BankResponseModel } from '../../core/models/bank/bank-response.model';
import { SupplierResponseModel } from '../../core/models/supplier';
import {
  SupplierPaymentResponseModel,
  EditablePaymentLine,
  SupplierLookupModel,
  CreateSupplierPaymentRequest,
} from '../../core/models/supplier-payment';
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
  selector: 'app-supplier-payment',
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
  templateUrl: './supplier-payment.component.html',
  providers: [MessageService, ConfirmationService],
})
export class SupplierPaymentComponent implements OnInit {
  // List
  paymentList = signal<SupplierPaymentResponseModel[]>([]);
  listSearch = '';

  // Dialog state
  dialogVisible = false;
  isNew = true;
  currentId: string | null = null;
  submitted = false;

  // Header fields
  invoiceNo = '';
  date: Date = new Date();
  supplierId: string | null = null;
  supplierCode = '';
  supplierName = '';
  currencyId: string | null = null;
  warehouseId: string | null = null;
  remark = '';

  // Payment amounts
  cash = 0;
  bankTransfer = 0;
  creditCard = 0;
  debitCard = 0;
  voucher = 0;
  cheque = 0;
  fromBankId: string | null = null;
  chequeNo = '';
  chequeDate: Date | null = null;

  // Invoice grid
  paymentLines = signal<EditablePaymentLine[]>([]);
  sortMode: 'invoice' | 'date' | 'dueDate' = 'date';

  // Lookup data
  warehouses = signal<WarehouseResponseModel[]>([]);
  currencies = signal<CurrencyResponseModel[]>([]);
  banks = signal<BankResponseModel[]>([]);
  suppliers = signal<SupplierResponseModel[]>([]);

  // Search by invoice no helper
  invoiceSearchNo = '';
  invoiceSearchVisible = false;

  // Search supplier by name helper
  supplierNameSearch = '';
  supplierSearchVisible = false;
  supplierSearchResults = signal<SupplierLookupModel[]>([]);

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private supplierPaymentService: SupplierPaymentService,
    private warehouseService: WarehouseService,
    private currencyService: CurrencyService,
    private bankService: BankService,
    private supplierService: SupplierService,
  ) {}

  ngOnInit(): void {
    this.loadList();
    this.loadWarehouses();
    this.loadCurrencies();
    this.loadBanks();
    this.loadSuppliers();
  }

  loadList(): void {
    this.supplierPaymentService.getList().subscribe({
      next: (data) => this.paymentList.set(data),
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load payments' }),
    });
  }

  loadWarehouses(): void {
    this.warehouseService.getWarehouses().subscribe({ next: (d) => this.warehouses.set(d) });
  }

  loadCurrencies(): void {
    this.currencyService.getCurrencies().subscribe({ next: (d) => this.currencies.set(d) });
  }

  loadBanks(): void {
    this.bankService.getBanks().subscribe({ next: (d) => this.banks.set(d) });
  }

  loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe({ next: (d) => this.suppliers.set(d) });
  }

  // ── Computed ──────────────────────────────────────────────────────────────

  get invoicesValue(): number {
    return this.paymentLines().reduce((s, l) => s + l.paid, 0);
  }

  get totalPaid(): number {
    return this.cash + this.bankTransfer + this.creditCard + this.debitCard + this.voucher + this.cheque;
  }

  get difference(): number {
    return +(this.totalPaid - this.invoicesValue).toFixed(2);
  }

  // ── List ──────────────────────────────────────────────────────────────────

  openNew(): void {
    this.resetForm();
    this.isNew = true;
    this.currentId = null;
    this.dialogVisible = true;
    this.supplierPaymentService.getNextInvoiceNo().subscribe({
      next: (no) => { this.invoiceNo = String(no); },
    });
  }

  editRecord(record: SupplierPaymentResponseModel): void {
    this.supplierPaymentService.getOne(record.id).subscribe({
      next: (data) => {
        this.isNew = false;
        this.currentId = data.id;
        this.invoiceNo = data.invoiceNo ?? '';
        this.date = data.date ? new Date(data.date) : new Date();
        this.supplierId = data.supplierId;
        this.supplierCode = data.supplierCode ?? '';
        this.supplierName = data.supplierName ?? '';
        this.currencyId = data.currencyId;
        this.warehouseId = data.warehouseId;
        this.remark = data.remark ?? '';
        this.cash = data.cash;
        this.bankTransfer = data.bankTransfer;
        this.creditCard = data.creditCard;
        this.debitCard = data.debitCard;
        this.voucher = data.voucher;
        this.cheque = data.cheque;
        this.fromBankId = data.fromBankId;
        this.chequeNo = data.chequeNo ?? '';
        this.chequeDate = data.chequeDate ? new Date(data.chequeDate) : null;

        // Re-load outstanding invoices and merge with saved lines
        if (data.supplierId && data.currencyId) {
          this.supplierPaymentService.getOutstandingInvoices(data.supplierId, data.currencyId).subscribe({
            next: (outstanding) => {
              const savedMap = new Map((data.lines ?? []).map((l) => [l.invoiceId, l]));
              const lines: EditablePaymentLine[] = outstanding.map((inv) => {
                const saved = savedMap.get(inv.id);
                const paid = saved ? saved.amount : 0;
                return {
                  ...inv,
                  paid,
                  paidInFull: paid !== 0 && paid === inv.balance,
                  remark: '',
                };
              });
              // Also restore any saved lines whose invoices no longer appear in outstanding
              // (fully paid ones won't appear, but we keep them in history via the saved detail)
              this.paymentLines.set(this.applySortMode(lines));
              this.dialogVisible = true;
            },
          });
        } else {
          this.paymentLines.set([]);
          this.dialogVisible = true;
        }
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load record' }),
    });
  }

  deleteRecord(record: SupplierPaymentResponseModel): void {
    this.confirmationService.confirm({
      message: `Delete payment "${record.invoiceNo}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.supplierPaymentService.deletePayment(record.id).subscribe({
          next: () => {
            this.paymentList.update((list) => list.filter((r) => r.id !== record.id));
            this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Payment deleted' });
          },
          error: (err) => this.messageService.add({
            severity: 'error', summary: 'Error', detail: err?.error?.message ?? 'Failed to delete',
          }),
        });
      },
    });
  }

  // ── Form ──────────────────────────────────────────────────────────────────

  resetForm(): void {
    this.invoiceNo = '';
    this.date = new Date();
    this.supplierId = null;
    this.supplierCode = '';
    this.supplierName = '';
    this.currencyId = null;
    this.warehouseId = null;
    this.remark = '';
    this.cash = 0;
    this.bankTransfer = 0;
    this.creditCard = 0;
    this.debitCard = 0;
    this.voucher = 0;
    this.cheque = 0;
    this.fromBankId = null;
    this.chequeNo = '';
    this.chequeDate = null;
    this.paymentLines.set([]);
    this.submitted = false;
    this.sortMode = 'date';
  }

  hideDialog(): void {
    this.dialogVisible = false;
    this.resetForm();
  }

  onSupplierChange(): void {
    this.paymentLines.set([]);
    this.loadOutstandingInvoices();
  }

  onCurrencyChange(): void {
    this.paymentLines.set([]);
    this.loadOutstandingInvoices();
  }

  loadOutstandingInvoices(): void {
    if (!this.supplierId || !this.currencyId) return;
    this.supplierPaymentService.getOutstandingInvoices(this.supplierId, this.currencyId).subscribe({
      next: (data) => {
        const lines: EditablePaymentLine[] = data.map((inv) => ({
          ...inv,
          paid: 0,
          paidInFull: false,
          remark: '',
        }));
        this.paymentLines.set(this.applySortMode(lines));
      },
      error: () => this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Failed to load outstanding invoices' }),
    });
  }

  // ── Invoice grid actions ──────────────────────────────────────────────────

  onPaidInFullChange(line: EditablePaymentLine): void {
    if (line.paidInFull) {
      line.paid = line.balance;
    }
  }

  onPaidChange(line: EditablePaymentLine): void {
    line.paidInFull = line.paid !== 0 && line.paid === line.balance;
  }

  checkAll(): void {
    this.paymentLines.update((lines) =>
      lines.map((l) => ({ ...l, paid: l.balance, paidInFull: true })),
    );
  }

  uncheckAll(): void {
    this.paymentLines.update((lines) =>
      lines.map((l) => ({ ...l, paid: 0, paidInFull: false })),
    );
  }

  setSortMode(mode: 'invoice' | 'date' | 'dueDate'): void {
    this.sortMode = mode;
    this.paymentLines.update((lines) => this.applySortMode([...lines]));
  }

  private applySortMode(lines: EditablePaymentLine[]): EditablePaymentLine[] {
    return [...lines].sort((a, b) => {
      if (this.sortMode === 'invoice') return (a.invoiceNo ?? '').localeCompare(b.invoiceNo ?? '');
      if (this.sortMode === 'dueDate') return (a.dueDate ?? '').localeCompare(b.dueDate ?? '');
      return (a.date ?? '').localeCompare(b.date ?? '');
    });
  }

  // ── Quick Pay ─────────────────────────────────────────────────────────────

  applyQuickPay(field: 'cash' | 'bankTransfer' | 'creditCard' | 'debitCard' | 'voucher' | 'cheque'): void {
    const total = this.invoicesValue;
    this.cash = 0;
    this.bankTransfer = 0;
    this.creditCard = 0;
    this.debitCard = 0;
    this.voucher = 0;
    this.cheque = 0;
    this[field] = total;
  }

  // ── Helper dialogs ────────────────────────────────────────────────────────

  openInvoiceSearch(): void {
    this.invoiceSearchNo = '';
    this.invoiceSearchVisible = true;
  }

  confirmInvoiceSearch(): void {
    if (!this.invoiceSearchNo.trim()) return;
    this.supplierPaymentService.searchByInvoice(this.invoiceSearchNo.trim().toUpperCase()).subscribe({
      next: (result) => {
        if (!result) {
          this.messageService.add({ severity: 'warn', summary: 'Not Found', detail: 'Invoice not found' });
          return;
        }
        if (result.supplierId) this.supplierId = result.supplierId;
        if (result.warehouseId) this.warehouseId = result.warehouseId;
        if (result.currencyId) this.currencyId = result.currencyId;
        const sup = this.suppliers().find((s) => s.id === result.supplierId);
        if (sup) { this.supplierCode = sup.code; this.supplierName = sup.name; }
        this.invoiceSearchVisible = false;
        this.loadOutstandingInvoices();
      },
    });
  }

  openSupplierSearch(): void {
    this.supplierNameSearch = '';
    this.supplierSearchResults.set([]);
    this.supplierSearchVisible = true;
  }

  runSupplierSearch(): void {
    if (!this.supplierNameSearch.trim()) return;
    this.supplierPaymentService.searchSupplierByName(this.supplierNameSearch.trim()).subscribe({
      next: (results) => this.supplierSearchResults.set(results),
    });
  }

  selectSupplierFromSearch(item: SupplierLookupModel): void {
    this.supplierId = item.id;
    this.supplierCode = item.code;
    this.supplierName = item.name;
    this.supplierSearchVisible = false;
    this.paymentLines.set([]);
    this.loadOutstandingInvoices();
  }

  // ── Save ──────────────────────────────────────────────────────────────────

  saveRecord(): void {
    this.submitted = true;
    if (!String(this.invoiceNo).trim() || !this.supplierId || !this.currencyId || !this.date) return;

    const selectedLines = this.paymentLines().filter((l) => l.paid !== 0);
    if (!selectedLines.length) {
      this.messageService.add({ severity: 'warn', summary: 'No Invoices', detail: 'Please select at least one invoice to pay.' });
      return;
    }

    if (Math.abs(this.difference) > 0.01) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Amount Mismatch',
        detail: `Total Paid must equal Invoice(s) value. Difference: ${this.difference.toLocaleString()}`,
      });
      return;
    }

    const payload: CreateSupplierPaymentRequest = {
      invoiceNo: String(this.invoiceNo).trim().toUpperCase(),
      date: new Date(this.date).toISOString().split('T')[0],
      supplierId: this.supplierId,
      supplierCode: this.supplierCode,
      currencyId: this.currencyId,
      warehouseId: this.warehouseId,
      remark: this.remark || null,
      cash: this.cash,
      bankTransfer: this.bankTransfer,
      creditCard: this.creditCard,
      debitCard: this.debitCard,
      voucher: this.voucher,
      cheque: this.cheque,
      fromBankId: this.fromBankId,
      chequeNo: this.chequeNo || null,
      chequeDate: this.chequeDate ? new Date(this.chequeDate).toISOString().split('T')[0] : null,
      lines: selectedLines.map((l, i) => ({
        invoiceId: l.id,
        amount: l.paid,
        dueDate: l.dueDate,
        remark: l.remark || null,
        order: i + 1,
      })),
    };

    const req$ = this.isNew
      ? this.supplierPaymentService.create(payload)
      : this.supplierPaymentService.update(this.currentId!, payload);

    req$.subscribe({
      next: () => {
        this.loadList();
        this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Payment saved successfully' });
        this.hideDialog();
      },
      error: (err) => this.messageService.add({
        severity: 'error', summary: 'Error', detail: err?.error?.message ?? 'Failed to save',
      }),
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  getWarehouseName(id: string | null): string {
    if (!id) return '-';
    return this.warehouses().find((w) => w.id === id)?.description ?? id;
  }

  getCurrencyName(id: string | null): string {
    if (!id) return '-';
    return this.currencies().find((c) => c.id === id)?.currency ?? id;
  }

  isReturnInvoice(line: EditablePaymentLine): boolean {
    return line.special === 'RB';
  }
}
