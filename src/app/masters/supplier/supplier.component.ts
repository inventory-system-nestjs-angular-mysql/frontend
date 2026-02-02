import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { SupplierService } from './supplier.service';
import { CityService } from '../city/city.service';
import { WarehouseService } from '../warehouse/warehouse.service';
import { CurrencyService } from '../currency/currency.service';
import { UploadService } from '../../core/services/upload.service';
import {
  CreateSupplierModel,
  SupplierResponseModel,
} from '../../core/models/supplier';
import { CityResponseModel } from '../../core/models/city/city-response.model';
import { WarehouseResponseModel } from '../../core/models/warehouse/warehouse-response.model';
import { CurrencyResponseModel } from '../../core/models/currency/currency-response.model';
import { CustomerInvoiceModel, EditableInvoiceModel } from '../../core/models/customer';
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
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
    selector: 'app-supplier',
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
        CheckboxModule,
        DatePickerModule
    ],
    templateUrl: './supplier.component.html',
    providers: [ConfirmationService]
})
export class SupplierComponent implements OnInit {
    supplierDialog = false;
    suppliers = signal<SupplierResponseModel[]>([]);
    cities = signal<CityResponseModel[]>([]);
    warehouses = signal<WarehouseResponseModel[]>([]);
    currencies = signal<CurrencyResponseModel[]>([]);
    supplier: Partial<CreateSupplierModel & { id?: string }> = {};
    selectedSuppliers: SupplierResponseModel[] = [];
    submitted = false;
    supplierInvoices = signal<CustomerInvoiceModel[]>([]);
    editableInvoices = signal<EditableInvoiceModel[]>([]);
    cols = [
        { field: 'code', header: 'Code' },
        { field: 'name', header: 'Name' },
        { field: 'cityId', header: 'City' },
        { field: 'discount', header: 'Disc %' },
        { field: 'term', header: 'Term' },
        { field: 'isSuspended', header: 'Status' }
    ];
    invoiceCols = [
        { field: 'invoice', header: 'Invoice' },
        { field: 'date', header: 'Date' },
        { field: 'warehouse', header: 'Warehouse' },
        { field: 'currency', header: 'Curr.' },
        { field: 'amount', header: 'Amount' },
        { field: 'remark', header: 'Remark' },
        { field: 'rem', header: 'Rem' }
    ];
    @ViewChild('dt') dt!: Table;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private supplierService: SupplierService,
        private cityService: CityService,
        private warehouseService: WarehouseService,
        private currencyService: CurrencyService,
        private uploadService: UploadService
    ) {}

    ngOnInit() {
        this.loadSuppliers();
        this.loadCities();
        this.loadWarehouses();
        this.loadCurrencies();
    }

    loadWarehouses() {
        this.warehouseService.getWarehouses().subscribe({
            next: (data) => this.warehouses.set(data),
            error: () => console.error('Failed to load warehouses')
        });
    }

    loadCurrencies() {
        this.currencyService.getCurrencies().subscribe({
            next: (data) => this.currencies.set(data),
            error: () => console.error('Failed to load currencies')
        });
    }

    loadSuppliers() {
        this.supplierService.getSuppliers().subscribe({
            next: (data) => this.suppliers.set(data),
            error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load Suppliers' })
        });
    }

    loadCities() {
        this.cityService.getCities().subscribe({
            next: (data) => this.cities.set(data),
            error: () => console.error('Failed to load cities')
        });
    }


    openNew() {
        this.supplier = {
            code: '',
            name: '',
            discount: 0,
            term: 0,
            creditLimit: 0,
            isSuspended: false,
            billToSame: true
        };
        this.supplierInvoices.set([]);
        this.editableInvoices.set([]);
        this.submitted = false;
        this.supplierDialog = true;
    }

    editSupplier(supplier: SupplierResponseModel) {
        this.supplier = {
            id: supplier.id,
            code: supplier.code,
            name: supplier.name,
            cityId: supplier.cityId ?? undefined,
            address1: supplier.address1 ?? undefined,
            address2: supplier.address2 ?? undefined,
            address3: supplier.address3 ?? undefined,
            address4: supplier.address4 ?? undefined,
            address5: supplier.address5 ?? undefined,
            npwp: supplier.npwp ?? undefined,
            nppkp: supplier.nppkp ?? undefined,
            creditLimit: supplier.creditLimit,
            discount: supplier.discount,
            term: supplier.term,
            billToSame: supplier.billToSame,
            billToName: supplier.billToName ?? undefined,
            billToAddress1: supplier.billToAddress1 ?? undefined,
            billToAddress2: supplier.billToAddress2 ?? undefined,
            billToAddress3: supplier.billToAddress3 ?? undefined,
            billToAddress4: supplier.billToAddress4 ?? undefined,
            createDate: supplier.createDate ? new Date(supplier.createDate) : undefined,
            lastDate: supplier.lastDate ? new Date(supplier.lastDate) : undefined,
            isSuspended: supplier.isSuspended,
            memo: supplier.memo ?? undefined,
            imagePath: supplier.imagePath ?? undefined,
            visitFrequency: supplier.visitFrequency ?? undefined,
            email: supplier.email ?? undefined,
            email2: supplier.email2 ?? undefined,
            email3: supplier.email3 ?? undefined
        };
        this.supplierInvoices.set([]);
        this.editableInvoices.set([]);
        // Load invoices and bind after fetch
        this.supplierService.getSupplierInvoices(supplier.id).subscribe({
            next: (data) => {
                this.supplierInvoices.set(data);
                const editable = data.map(inv => ({
                    id: inv.id, // Preserve invoice ID
                    invoice: inv.invoice,
                    date: inv.date ? new Date(inv.date) : null,
                    warehouse: inv.warehouse || null,
                    currency: inv.currency || null,
                    amount: inv.amount || null,
                    remark: inv.remark || null,
                    rem: inv.rem || null
                }));
                this.editableInvoices.set(editable);
            },
            error: () => {
                this.supplierInvoices.set([]);
                this.editableInvoices.set([]);
            }
        });
        this.supplierDialog = true;
    }

    deleteSelectedSuppliers() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected suppliers?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const deleteRequests = this.selectedSuppliers.map(s => this.supplierService.deleteSupplier(s.id));
                Promise.all(deleteRequests.map(obs => obs.toPromise())).then(() => {
                    this.loadSuppliers();
                    this.selectedSuppliers = [];
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Suppliers Deleted', life: 3000 });
                });
            }
        });
    }

    hideDialog() {
        this.supplierDialog = false;
        this.submitted = false;
        this.supplierInvoices.set([]);
        this.editableInvoices.set([]);
    }

    deleteSupplier(supplier: SupplierResponseModel) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + supplier.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.supplierService.deleteSupplier(supplier.id).subscribe({
                    next: () => {
                        this.loadSuppliers();
                        this.supplier = {};
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Supplier Deleted', life: 3000 });
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete Supplier' })
                });
            }
        });
    }

    saveSupplier() {
        this.submitted = true;
        if (!this.supplier.code?.trim() || !this.supplier.name?.trim()) {
            // Required fields missing, do not close dialog
            return;
        }
        const supplierToSend = { ...this.supplier };

        // Validate invoices before proceeding
        const invoices = this.editableInvoices();
        const invalidInvoices = invoices.filter(inv => 
            !inv.invoice?.trim() || !inv.date || !inv.warehouse || !inv.currency || !inv.amount || inv.amount <= 0
        );
        const invoiceNumbers = invoices.map(inv => inv.invoice?.trim()).filter(Boolean);
        const duplicates = invoiceNumbers.filter((inv, idx, arr) => arr.indexOf(inv) !== idx);
        if (invalidInvoices.length > 0 || duplicates.length > 0) {
            // Do not close dialog if invoice validation fails
            this.saveSupplierInvoices('validate-only'); // Will show messages but not save
            return;
        }

        if (this.supplier.id) {
            // Update
            const { id, ...updateDto } = supplierToSend;
            this.supplierService.updateSupplier(id!, updateDto).subscribe({
                next: () => {
                    // Save invoices after supplier is updated
                    this.saveSupplierInvoices(id!);
                    this.loadSuppliers();
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Supplier Updated', life: 3000 });
                    this.supplierDialog = false;
                    this.supplier = {};
                    this.editableInvoices.set([]);
                },
                error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update Supplier' })
            });
        } else {
            // Create
            const { id, ...createDto } = supplierToSend;
            this.supplierService.createSupplier(createDto as CreateSupplierModel).subscribe({
                next: (createdSupplier) => {
                    // Save invoices after supplier is created
                    this.saveSupplierInvoices(createdSupplier.id);
                    this.loadSuppliers();
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Supplier Created', life: 3000 });
                    this.supplierDialog = false;
                    this.supplier = {};
                    this.editableInvoices.set([]);
                },
                error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create Supplier' })
            });
        }
    }

    onImageSelect(event: any) {
        const file = event.target?.files?.[0] || event.files?.[0];
        if (file) {
            // Upload the image
            this.uploadService.uploadImage(file).subscribe({
                next: (response) => {
                    this.supplier.imagePath = response.path;
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

    getCityName(cityId: string | null | undefined): string {
        if (!cityId) return '';
        const city = this.cities().find(c => c.id === cityId);
        return city?.description || '';
    }

    getWarehouseDescription(warehouseId: string | null | undefined): string {
        if (!warehouseId) return '';
        const warehouse = this.warehouses().find(w => w.id === warehouseId);
        return warehouse?.description || '';
    }

    getCurrencyDescription(currencyId: string | null | undefined): string {
        if (!currencyId) return '';
        const currency = this.currencies().find(c => c.id === currencyId);
        return currency?.currency || '';
    }

    loadSupplierInvoices(supplierId: string) {
        if (!supplierId) {
            this.supplierInvoices.set([]);
            return;
        }
        this.supplierService.getSupplierInvoices(supplierId).subscribe({
            next: (data) => this.supplierInvoices.set(data),
            error: () => {
                this.supplierInvoices.set([]);
                // Silently fail - invoices are optional
            }
        });
    }

    formatDate(date: Date | string | null | undefined): string {
        if (!date) return '';
        const d = typeof date === 'string' ? new Date(date) : date;
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    formatCurrency(amount: number | null | undefined): string {
        if (amount === null || amount === undefined) return '-';
        return new Intl.NumberFormat('id-ID', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        }).format(amount);
    }

    addInvoiceRow() {
        const newInvoice: EditableInvoiceModel = {
            invoice: '',
            date: new Date(),
            warehouse: null,
            currency: null,
            amount: null,
            remark: null
        };
        this.editableInvoices.set([...this.editableInvoices(), newInvoice]);
    }

    removeInvoiceRow(index: number) {
        const invoices = [...this.editableInvoices()];
        const invoiceToRemove = invoices[index];
        
        // If it's an existing invoice (has id), delete it from backend
        if (invoiceToRemove.id) {
            this.confirmationService.confirm({
                message: 'Are you sure you want to delete this invoice?',
                header: 'Confirm',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this.supplierService.deleteInvoice(invoiceToRemove.id!).subscribe({
                        next: () => {
                            invoices.splice(index, 1);
                            this.editableInvoices.set(invoices);
                            this.messageService.add({ 
                                severity: 'success', 
                                summary: 'Success', 
                                detail: 'Invoice deleted successfully' 
                            });
                        },
                        error: () => {
                            this.messageService.add({ 
                                severity: 'error', 
                                summary: 'Error', 
                                detail: 'Failed to delete invoice' 
                            });
                        }
                    });
                }
            });
        } else {
            // If it's a new invoice (no id), just remove from local array
            invoices.splice(index, 1);
            this.editableInvoices.set(invoices);
        }
    }

    saveSupplierInvoices(supplierId: string) {
        // If called with 'validate-only', just run validation and show errors, do not save
        if (supplierId === 'validate-only') {
            const invoices = this.editableInvoices();
            const invalidInvoices = invoices.filter(inv => 
                !inv.invoice?.trim() || !inv.date || !inv.warehouse || !inv.currency || !inv.amount || inv.amount <= 0
            );
            if (invalidInvoices.length > 0) {
                this.messageService.add({ 
                    severity: 'error', 
                    summary: 'Validation Error', 
                    detail: 'Please fill all required invoice fields (Invoice, Date, Warehouse, Currency, Amount > 0)'
                });
            }
            const invoiceNumbers = invoices.map(inv => inv.invoice?.trim()).filter(Boolean);
            const duplicates = invoiceNumbers.filter((inv, idx, arr) => arr.indexOf(inv) !== idx);
            if (duplicates.length > 0) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Duplicate Invoice',
                    detail: `Duplicate invoice number(s) found: ${[...new Set(duplicates)].join(', ')}`
                });
            }
            return;
        }
        const invoices = this.editableInvoices();

        // Validate all invoices have required fields
        const invalidInvoices = invoices.filter(inv => 
            !inv.invoice?.trim() || !inv.date || !inv.warehouse || !inv.currency || !inv.amount || inv.amount <= 0
        );

        // Check for duplicate invoice numbers
        const invoiceNumbers = invoices.map(inv => inv.invoice?.trim()).filter(Boolean);
        const duplicates = invoiceNumbers.filter((inv, idx, arr) => arr.indexOf(inv) !== idx);

        if (invalidInvoices.length > 0 || duplicates.length > 0) {
            // If any validation fails, do not send to API
            return;
        }

        // Send all invoices as bulk - backend will decide create vs update
        const invoicesToSend = invoices.map(inv => ({
            id: inv.id || undefined, // Include ID if it exists, backend will handle create/update
            refNo: inv.invoice!.trim(),
            date: inv.date instanceof Date ? inv.date.toISOString() : inv.date,
            warehouseId: inv.warehouse!,
            exchangeId: inv.currency!,
            value: inv.amount!,
            remark: inv.remark ?? null,
            salesmanId: "..default..............",
            opening: 1, // Mark as opening balance
        }));

        this.supplierService.createSupplierInvoices(supplierId, invoicesToSend).subscribe({
            next: (data) => {
                // Reload invoices to get fresh data with IDs
                if (this.supplierDialog) {
                    this.supplierService.getSupplierInvoices(supplierId).subscribe({
                        next: (invoiceData) => {
                            this.supplierInvoices.set(invoiceData);
                            const editable = invoiceData.map(inv => ({
                                id: inv.id,
                                invoice: inv.invoice,
                                date: inv.date ? new Date(inv.date) : null,
                                warehouse: inv.warehouse || null,
                                currency: inv.currency || null,
                                amount: inv.amount || null,
                                remark: inv.remark || null,
                                rem: inv.rem || null
                            }));
                            this.editableInvoices.set(editable);
                        },
                        error: () => {
                            // Silently fail - invoices are optional
                        }
                    });
                }
            },
            error: (error) => {
                this.messageService.add({ 
                    severity: 'warn', 
                    summary: 'Warning', 
                    detail: 'Supplier saved but some invoices may not have been saved: ' + (error.error?.message || 'Unknown error')
                });
            }
        });
    }
}

