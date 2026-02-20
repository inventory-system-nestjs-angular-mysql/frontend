import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { StockService } from './stock.service';
import { StockGroupService } from '../stockgroup/stockgroup.service';
import {
  CreateStockModel,
  StockResponseModel,
  StockPriceRow,
} from '../../core/models/stock';
import { StockGroupResponseModel } from '../../core/models/stockgroup';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { TabsModule } from 'primeng/tabs';
import { TooltipModule } from 'primeng/tooltip';
import { BrandResponseModel } from '../../core/models/brand';
import { BrandService } from '../brand/brand.service';
import { UnitResponseModel } from '../../core/models/unit';
import { UnitService } from '../unit/unit.service';
import { UploadService } from '../../core/services/upload.service';
import { SupplierResponseModel } from '../../core/models/supplier';
import { SupplierService } from '../supplier/supplier.service';

@Component({
    selector: 'app-stock',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        InputTextModule,
        TextareaModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        SelectModule,
        RadioButtonModule,
        CheckboxModule,
        TabsModule,
        TooltipModule
    ],
    templateUrl: './stock.component.html',
    providers: [ConfirmationService]
})
export class StockComponent implements OnInit {
    stockDialog = false;
    stocks = signal<StockResponseModel[]>([]);
    stockGroups = signal<StockGroupResponseModel[]>([]);
    brands = signal<BrandResponseModel[]>([]);
    suppliers = signal<SupplierResponseModel[]>([]);
    units = signal<UnitResponseModel[]>([]);
    stock: Partial<CreateStockModel & { cSTKpk?: string; priceRows?: StockPriceRow[] }> = {
        taxOption: 'Tax',
        priceRows: []
    };
    stockImageDataUrl: string | null = null;
    selectedStocks: StockResponseModel[] = [];
    submitted = false;
    cols = [
        { field: 'stockName', header: 'Stock Name' },
        { field: 'stockGroupId', header: 'Group' },
        { field: 'brand', header: 'Brand' },
        { field: 'purchasePrice', header: 'Purchase Price' },
        { field: 'taxOption', header: 'Tax' }
    ];
    @ViewChild('dt') dt!: Table;

    constructor(
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private stockService: StockService,
        private stockGroupService: StockGroupService,
        private brandService: BrandService,
        private supplierService: SupplierService,
        private unitService: UnitService,
        private uploadService: UploadService
    ) {}

    ngOnInit() {
        this.loadStocks();
        this.loadStockGroups();
        this.loadBrands();
        this.loadSuppliers();
        this.loadUnits();
    }

    loadStocks() {
        this.stockService.getStocks().subscribe({
            next: (data) => this.stocks.set(data),
            error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load Stocks' })
        });
    }

    loadStockGroups() {
        this.stockGroupService.getStockGroups().subscribe({
            next: (data) => this.stockGroups.set(data),
            error: () => console.error('Failed to load stock groups')
        });
    }

    loadBrands() {
        this.brandService.getBrands().subscribe({
            next: (data) => this.brands.set(data),
            error: () => console.error('Failed to load brands')
        });
    }

    loadSuppliers() {
        this.supplierService.getSuppliers().subscribe({
            next: (data) => this.suppliers.set(data),
            error: () => console.error('Failed to load suppliers')
        });
    }
    
    loadUnits() {
        this.unitService.getUnits().subscribe({
            next: (data) => this.units.set(data),
            error: () => console.error('Failed to load units')
        });
    }

    openNew() {
        this.stock = {
            taxOption: 'Tax',
            priceRows: []
        };
        this.stockImageDataUrl = null;
        this.submitted = false;
        this.stockDialog = true;
    }

    editStock(stock: StockResponseModel) {
        this.stock = { 
            ...stock,
            stockGroupId: stock.stockGroupId ?? undefined // Convert null to undefined
        };
        this.stockImageDataUrl = null;
        if (stock.imagePath) {
            this.uploadService.getImageAsBase64(stock.imagePath).subscribe({
                next: (r) => (this.stockImageDataUrl = r.dataUrl || null),
                error: () => (this.stockImageDataUrl = null),
            });
        }
        // Map stockDetails to priceRows for the form (if needed for backward compatibility)
        if (stock.stockDetails) {
            this.stock.priceRows = stock.stockDetails; // Keep priceRows for form binding
        } else {
            this.stock.priceRows = [];
        }
        this.stockDialog = true;
    }

    deleteSelectedStocks() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected stocks?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const deleteRequests = this.selectedStocks.map(s => this.stockService.deleteStock(s.cSTKpk));
                Promise.all(deleteRequests.map(obs => obs.toPromise())).then(() => {
                    this.loadStocks();
                    this.selectedStocks = [];
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Stocks Deleted', life: 3000 });
                });
            }
        });
    }

    hideDialog() {
        this.stockDialog = false;
        this.submitted = false;
        this.stockImageDataUrl = null;
    }

    deleteStock(stock: StockResponseModel) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + stock.stockName + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.stockService.deleteStock(stock.cSTKpk).subscribe({
                    next: () => {
                        this.loadStocks();
                        this.stock = {};
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Stock Deleted', life: 3000 });
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete Stock' })
                });
            }
        });
    }

    saveStock() {
        this.submitted = true;
        if (this.stock.stockName?.trim() && this.stock.stockGroupId != null) {
            // Map priceRows to stockDetails for API
            const stockToSend = {
                ...this.stock,
                stockDetails: this.stock.priceRows, // Map priceRows to stockDetails
                priceRows: undefined // Remove priceRows from payload
            };

            if (this.stock.cSTKpk) {
                // Update
                const { cSTKpk, priceRows, ...updateDto } = stockToSend;
                this.stockService.updateStock(cSTKpk!, updateDto).subscribe({
                    next: () => {
                        this.loadStocks();
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Stock Updated', life: 3000 });
                        this.stockDialog = false;
                        this.stock = {};
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update Stock' })
                });
            } else {
                // Create
                const { cSTKpk, priceRows, ...createDto } = stockToSend;
                this.stockService.createStock(createDto as CreateStockModel).subscribe({
                    next: () => {
                        this.loadStocks();
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Stock Created', life: 3000 });
                        this.stockDialog = false;
                        this.stock = {};
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create Stock' })
                });
            }
        }
    }

    addPriceRow() {
        if (!this.stock.priceRows) {
            this.stock.priceRows = [];
        }
        this.stock.priceRows.push({
            stockCode: '',
            unit: 'Pcs',
            factor: 1,
            purchase: 0,
            wholesale: 0,
            retail: 0,
            isKey: false
        });
    }

    removePriceRow(index: number) {
        if (this.stock.priceRows) {
            this.stock.priceRows.splice(index, 1);
        }
    }

    onImageSelect(event: any) {
        const file = event.target?.files?.[0] || event.files?.[0];
        if (file) {
            // Upload the image
            this.uploadService.uploadImage(file).subscribe({
                next: (response) => {
                    this.stock.imagePath = response.path;
                    this.uploadService.getImageAsBase64(response.path).subscribe({
                        next: (r) => (this.stockImageDataUrl = r.dataUrl || null),
                        error: () => (this.stockImageDataUrl = null),
                    });
                    this.messageService.add({ 
                        severity: 'success', 
                        summary: 'Success', 
                        detail: 'Image uploaded successfully' 
                    });
                },
                error: (error) => {
                    this.messageService.add({ 
                        severity: 'error', 
                        summary: 'Error', 
                        detail: error.error?.message || 'Failed to upload image' 
                    });
                }
            });
        }
    }

    getImageUrl(path: string | null | undefined): string {
        return this.uploadService.getImageUrl(path);
    }

    getGroupName(groupId: string | null | undefined): string {
        if (!groupId) return '';
        const group = this.stockGroups().find(g => g.id === groupId);
        return group?.description || '';
    }

    getBrandName(brandId: string | null | undefined): string {
        if (!brandId) return '';
        const brand = this.brands().find(g => g.id === brandId);
        return brand?.description || '';
    }
}

