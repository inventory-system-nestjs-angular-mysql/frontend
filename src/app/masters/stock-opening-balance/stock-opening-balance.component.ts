import { Component, OnInit, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockOpeningBalanceService } from './stock-opening-balance.service';
import { WarehouseService } from '../warehouse/warehouse.service';
import { StockService } from '../stock/stock.service';
import { UnitService } from '../unit/unit.service';
import { WarehouseResponseModel } from '../../core/models/warehouse/warehouse-response.model';
import { StockDetailLookupModel } from '../../core/models/stock/stock-detail-lookup.model';
import { UnitResponseModel } from '../../core/models/unit/unit-response.model';
import {
  StockOpeningBalanceLineModel,
  CreateStockOpeningBalanceRequest,
} from '../../core/models/stock-opening-balance.model';
import { DateUtil } from '../../core/utils/date.util';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-stock-opening-balance',
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
    IconFieldModule,
    InputIconModule,
    DatePickerModule,
    SelectModule,
    TooltipModule,
  ],
  templateUrl: './stock-opening-balance.component.html',
  providers: [MessageService],
})
export class StockOpeningBalanceComponent implements OnInit {
  refNo = '';
  date: Date = new Date();
  warehouseId: string | null = null;
  remark = '';
  lines = signal<StockOpeningBalanceLineModel[]>([]);
  warehouses = signal<WarehouseResponseModel[]>([]);
  stockDetails = signal<StockDetailLookupModel[]>([]);
  units = signal<UnitResponseModel[]>([]);
  stockLookupVisible = false;
  stockLookupSearch = '';
  stockLookupTargetRowIndex: number | null = null; // null = "Add from list" mode

  submitted = false;

  constructor(
    private messageService: MessageService,
    private stockOpeningBalanceService: StockOpeningBalanceService,
    private warehouseService: WarehouseService,
    private stockService: StockService,
    private unitService: UnitService
  ) {}

  ngOnInit(): void {
    this.loadWarehouses();
    this.loadStockDetails();
    this.loadUnits();
  }

  loadWarehouses(): void {
    this.warehouseService.getWarehouses().subscribe({
      next: (data) => this.warehouses.set(data),
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load warehouses',
        }),
    });
  }

  loadStockDetails(): void {
    this.stockService.getStockDetailsForLookup().subscribe({
      next: (data) => this.stockDetails.set(data),
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load stock details',
        }),
    });
  }

  loadUnits(): void {
    this.unitService.getUnits().subscribe({
      next: (data) => this.units.set(data),
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load units',
        }),
    });
  }

  get totalAmount(): number {
    return this.lines().reduce((sum, row) => sum + (row.amount || 0), 0);
  }

  addEmptyRow(): void {
    this.lines.set([
      ...this.lines(),
      {
        stockDetailId: '',
        stockCode: '',
        stockName: '',
        prevStock: 0,
        qty: 0,
        unit: '',
        purchasePrice: 0,
        amount: 0,
      },
    ]);
  }

  addRowFromStockDetail(detail: StockDetailLookupModel): void {
    const price = detail.purchase ?? 0;
    const qty = 1;
    this.lines.set([
      ...this.lines(),
      {
        stockDetailId: detail.id,
        stockCode: detail.stockCode ?? '',
        stockName: detail.stockName ?? '',
        prevStock: 0,
        qty,
        unit: detail.unit ?? '',
        unitDescription: detail.unitDescription ?? null,
        purchasePrice: price,
        amount: qty * price,
      },
    ]);
    this.stockLookupVisible = false;
    this.stockLookupTargetRowIndex = null;
  }

  openStockLookupForRow(index: number): void {
    this.stockLookupTargetRowIndex = index;
    this.stockLookupSearch = '';
    this.stockLookupVisible = true;
  }

  openStockLookupToAdd(): void {
    this.stockLookupTargetRowIndex = null;
    this.stockLookupSearch = '';
    this.stockLookupVisible = true;
  }

  onSelectStockDetailFromLookup(detail: StockDetailLookupModel): void {
    if (this.stockLookupTargetRowIndex !== null) {
      const idx = this.stockLookupTargetRowIndex;
      const list = [...this.lines()];
      const price = detail.purchase ?? 0;
      const qty = list[idx]?.qty || 1;
      list[idx] = {
        ...list[idx],
        stockDetailId: detail.id,
        stockCode: detail.stockCode ?? '',
        stockName: detail.stockName ?? '',
        unit: detail.unit ?? '',
        unitDescription: detail.unitDescription ?? null,
        purchasePrice: price,
        amount: qty * price,
      };
      this.lines.set(list);
    } else {
      this.addRowFromStockDetail(detail);
    }
    this.stockLookupVisible = false;
    this.stockLookupTargetRowIndex = null;
  }

  @HostListener('document:keydown.f2', ['$event'])
  onF2(event: Event): void {
    const target = event.target as HTMLElement;
    if (target?.getAttribute?.('data-stock-code-input') === 'true') {
      const idx = target.getAttribute('data-row-index');
      if (idx != null) {
        this.openStockLookupForRow(parseInt(idx, 10));
      }
    }
  }

  removeLine(index: number): void {
    const list = [...this.lines()];
    list.splice(index, 1);
    this.lines.set(list);
  }

  onQtyOrPriceChange(row: StockOpeningBalanceLineModel): void {
    row.amount = (row.qty || 0) * (row.purchasePrice || 0);
  }

  save(): void {
    this.submitted = true;
    if (!this.refNo?.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation',
        detail: 'Invoice No. is required',
      });
      return;
    }
    if (!this.date) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation',
        detail: 'Date is required',
      });
      return;
    }
    if (!this.warehouseId?.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation',
        detail: 'Warehouse is required',
      });
      return;
    }
    const validLines = this.lines().filter(
      (r) => r.stockDetailId?.trim() && r.qty > 0 && r.amount >= 0
    );
    if (validLines.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation',
        detail: 'Add at least one stock line with quantity > 0',
      });
      return;
    }

    const dateStr = DateUtil.toDateOnlyString(this.date);
    if (!dateStr) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation',
        detail: 'Invalid date',
      });
      return;
    }

    const body: CreateStockOpeningBalanceRequest = {
      refNo: this.refNo.trim(),
      date: dateStr,
      warehouseId: this.warehouseId.trim(),
      remark: this.remark?.trim() || null,
      lines: validLines.map((r) => ({
        stockDetailId: r.stockDetailId,
        stockCode: r.stockCode ?? null,
        stockName: r.stockName ?? null,
        qty: r.qty,
        unit: r.unit || null,
        purchasePrice: r.purchasePrice,
        amount: r.amount,
      })),
    };

    this.stockOpeningBalanceService.createOpeningBalance(body).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Stock Opening Balance saved',
        });
        this.resetForm();
      },
      error: (err) =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message ?? 'Failed to save Stock Opening Balance',
        }),
    });
  }

  resetForm(): void {
    this.refNo = '';
    this.date = new Date();
    this.warehouseId = null;
    this.remark = '';
    this.lines.set([]);
    this.submitted = false;
  }

  getWarehouseDescription(id: string | null | undefined): string {
    if (!id) return '';
    return this.warehouses().find((w) => w.id === id)?.description ?? '';
  }

  getUnitDescription(id: string | null | undefined): string {
    if (!id) return '';
    return this.units().find((u) => u.id === id)?.description ?? id;
  }

  filteredStockDetailsForLookup(): StockDetailLookupModel[] {
    const search = (this.stockLookupSearch || '').toLowerCase();
    let list = this.stockDetails();
    if (search.trim()) {
      list = list.filter(
        (d) =>
          (d.stockCode?.toLowerCase().includes(search) ||
            d.stockName?.toLowerCase().includes(search) ||
            d.unitDescription?.toLowerCase().includes(search))
      );
    }
    return list;
  }
}
