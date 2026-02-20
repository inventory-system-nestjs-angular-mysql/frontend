import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { CustomerService } from './customer.service';
import { CityService } from '../city/city.service';
import { WarehouseService } from '../warehouse/warehouse.service';
import { WarehouseResponseModel } from '../../core/models/warehouse/warehouse-response.model';
import { CurrencyService } from '../currency/currency.service';
import { CurrencyResponseModel } from '../../core/models/currency/currency-response.model';
import {
  CreateCustomerModel,
  CustomerResponseModel,
  CustomerInvoiceModel,
  EditableInvoiceModel,
} from '../../core/models/customer';
import { DateUtil } from '../../core/utils/date.util';
import { CityResponseModel } from '../../core/models/city/city-response.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UploadService } from '../../core/services/upload.service';
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
import { RadioButtonModule } from 'primeng/radiobutton';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
    selector: 'app-customer',
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
        RadioButtonModule,
        DatePickerModule
    ],
    templateUrl: './customer.component.html',
    providers: [ConfirmationService]
})
export class CustomerComponent implements OnInit {
    customerDialog = false;
    customers = signal<CustomerResponseModel[]>([]);
    cities = signal<CityResponseModel[]>([]);
    warehouses = signal<WarehouseResponseModel[]>([]);
    currencies = signal<CurrencyResponseModel[]>([]);
    customer: Partial<CreateCustomerModel & { id?: string }> = {};
    selectedCustomers: CustomerResponseModel[] = [];
    submitted = false;
    customerInvoices = signal<CustomerInvoiceModel[]>([]);
    editableInvoices = signal<EditableInvoiceModel[]>([]);
    cols = [
        { field: 'code', header: 'Code' },
        { field: 'name', header: 'Name' },
        { field: 'cityId', header: 'City' },
        { field: 'email', header: 'Email' },
        { field: 'creditLimit', header: 'Credit Limit' },
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

    // Religion options
    religions = [
        { label: 'Tidak Tahu', value: 'Tidak Tahu' },
        { label: 'Islam', value: 'Islam' },
        { label: 'Kristen', value: 'Kristen' },
        { label: 'Katolik', value: 'Katolik' },
        { label: 'Hindu', value: 'Hindu' },
        { label: 'Buddha', value: 'Buddha' }
    ];

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private customerService: CustomerService,
        private cityService: CityService,
        private warehouseService: WarehouseService,
        private currencyService: CurrencyService,
        private uploadService: UploadService
    ) {}


    ngOnInit() {
        this.loadCustomers();
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

    loadCustomers() {
        this.customerService.getCustomers().subscribe({
            next: (data) => this.customers.set(data),
            error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load Customers' })
        });
    }

    loadCities() {
        this.cityService.getCities().subscribe({
            next: (data) => this.cities.set(data),
            error: () => console.error('Failed to load cities')
        });
    }

    openNew() {
        this.customer = {
            code: '',
            name: '',
            discount: 0,
            term: 0,
            creditLimit: 0,
            outstandingLimit: 0,
            isSuspended: false,
            billToSame: true,
            priceType: 3, // Default to 'All'
            gender: 0 // Default to Male
        };
        this.customerInvoices.set([]);
        this.editableInvoices.set([]);
        this.submitted = false;
        this.customerDialog = true;
    }

    editCustomer(customer: CustomerResponseModel) {
        this.customer = {
            id: customer.id,
            code: customer.code,
            name: customer.name,
            cityId: customer.cityId ?? undefined,
            address1: customer.address1 ?? undefined,
            address2: customer.address2 ?? undefined,
            address3: customer.address3 ?? undefined,
            address4: customer.address4 ?? undefined,
            address5: customer.address5 ?? undefined,
            npwp: customer.npwp ?? undefined,
            nppkp: customer.nppkp ?? undefined,
            creditLimit: customer.creditLimit,
            outstandingLimit: customer.outstandingLimit,
            discount: customer.discount,
            term: customer.term,
            billToSame: customer.billToSame,
            billToName: customer.billToName ?? undefined,
            billToAddress1: customer.billToAddress1 ?? undefined,
            billToAddress2: customer.billToAddress2 ?? undefined,
            billToAddress3: customer.billToAddress3 ?? undefined,
            billToAddress4: customer.billToAddress4 ?? undefined,
            createDate: customer.createDate ? new Date(customer.createDate) : undefined,
            lastDate: customer.lastDate ? new Date(customer.lastDate) : undefined,
            isSuspended: customer.isSuspended,
            memo: customer.memo ?? undefined,
            imagePath: customer.imagePath ?? undefined,
            visitFrequency: customer.visitFrequency ?? undefined,
            email: customer.email ?? undefined,
            email2: customer.email2 ?? undefined,
            email3: customer.email3 ?? undefined,
            zip: customer.zip ?? undefined,
            telephone: customer.telephone ?? undefined,
            birthday: customer.birthday ? new Date(customer.birthday) : undefined,
            religion: customer.religion ?? undefined,
            distance: customer.distance ?? undefined,
            freight: customer.freight ?? undefined,
            priceType: customer.priceType ?? 3,
            salesmanId: customer.salesmanId ?? undefined,
            gender: customer.gender ?? 0,
            nik: customer.nik ?? undefined
        };
        this.customerInvoices.set([]);
        this.editableInvoices.set([]);
        this.customerService.getCustomerInvoices(customer.id).subscribe({
            next: (data) => {
                this.customerInvoices.set(data);
                const editable = data.map(inv => ({
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
                this.customerInvoices.set([]);
                this.editableInvoices.set([]);
            }
        });
        this.customerDialog = true;
    }

    deleteSelectedCustomers() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected customers?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const deleteRequests = this.selectedCustomers.map(c => this.customerService.deleteCustomer(c.id));
                Promise.all(deleteRequests.map(obs => obs.toPromise())).then(() => {
                    this.loadCustomers();
                    this.selectedCustomers = [];
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Customers Deleted', life: 3000 });
                });
            }
        });
    }

    hideDialog() {
        this.customerDialog = false;
        this.submitted = false;
        this.customerInvoices.set([]);
        this.editableInvoices.set([]);
    }

    deleteCustomer(customer: CustomerResponseModel) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + customer.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.customerService.deleteCustomer(customer.id).subscribe({
                    next: () => {
                        this.loadCustomers();
                        this.customer = {};
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Customer Deleted', life: 3000 });
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete Customer' })
                });
            }
        });
    }

    saveCustomer() {
        this.submitted = true;
        if (!this.customer.code?.trim() || !this.customer.name?.trim() || !this.customer.cityId) {
            return;
        }
        const customerToSend = {
            ...this.customer,
            createDate: DateUtil.toDateOnlyString(this.customer.createDate) ?? undefined,
            lastDate: DateUtil.toDateOnlyString(this.customer.lastDate) ?? undefined,
            birthday: DateUtil.toDateOnlyString(this.customer.birthday) ?? undefined
        };

        const invoices = this.editableInvoices();
        const invalidInvoices = invoices.filter(inv =>
            !inv.invoice?.trim() || !inv.date || !inv.warehouse || !inv.currency || !inv.amount || inv.amount <= 0
        );
        const invoiceNumbers = invoices.map(inv => inv.invoice?.trim()).filter(Boolean);
        const duplicates = invoiceNumbers.filter((inv, idx, arr) => arr.indexOf(inv) !== idx);
        if (invalidInvoices.length > 0 || duplicates.length > 0) {
            this.saveCustomerInvoices('validate-only');
            return;
        }

        if (this.customer.id) {
            const { id, ...updateDto } = customerToSend;
            this.customerService.updateCustomer(id!, updateDto as Partial<CreateCustomerModel>).subscribe({
                next: () => {
                    this.saveCustomerInvoices(id!);
                    this.loadCustomers();
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Customer Updated', life: 3000 });
                    this.customerDialog = false;
                    this.customer = {};
                    this.editableInvoices.set([]);
                },
                error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update Customer' })
            });
        } else {
            const { id, ...createDto } = customerToSend;
            this.customerService.createCustomer(createDto as unknown as CreateCustomerModel).subscribe({
                next: (createdCustomer) => {
                    this.saveCustomerInvoices(createdCustomer.id);
                    this.loadCustomers();
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Customer Created', life: 3000 });
                    this.customerDialog = false;
                    this.customer = {};
                    this.editableInvoices.set([]);
                },
                error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create Customer' })
            });
        }
    }

    onImageSelect(event: any) {
        const file = event.target?.files?.[0] || event.files?.[0];
        if (file) {
            // Upload the image
            this.uploadService.uploadImage(file).subscribe({
                next: (response) => {
                    this.customer.imagePath = response.path;
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

    getCityName(cityId: string | null | undefined): string {
        if (!cityId) return '';
        const city = this.cities().find(c => c.id === cityId);
        return city?.description || '';
    }

    getPriceTypeLabel(priceType: number | null | undefined): string {
        if (priceType === 1) return 'ISX';
        if (priceType === 2) return 'POSX';
        if (priceType === 3) return 'All';
        return '';
    }

    loadCustomerInvoices(customerId: string) {
        if (!customerId) {
            this.customerInvoices.set([]);
            return;
        }
        this.customerService.getCustomerInvoices(customerId).subscribe({
            next: (data) => this.customerInvoices.set(data),
            error: () => {
                this.customerInvoices.set([]);
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
        if (invoiceToRemove.id) {
            this.confirmationService.confirm({
                message: 'Are you sure you want to delete this invoice?',
                header: 'Confirm',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this.customerService.deleteInvoice(invoiceToRemove.id!).subscribe({
                        next: () => {
                            invoices.splice(index, 1);
                            this.editableInvoices.set(invoices);
                            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Invoice deleted successfully' });
                        },
                        error: () => {
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete invoice' });
                        }
                    });
                }
            });
        } else {
            invoices.splice(index, 1);
            this.editableInvoices.set(invoices);
        }
    }

    saveCustomerInvoices(customerId: string) {
        if (customerId === 'validate-only') {
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
        const invalidInvoices = invoices.filter(inv =>
            !inv.invoice?.trim() || !inv.date || !inv.warehouse || !inv.currency || !inv.amount || inv.amount <= 0
        );
        const invoiceNumbers = invoices.map(inv => inv.invoice?.trim()).filter(Boolean);
        const duplicates = invoiceNumbers.filter((inv, idx, arr) => arr.indexOf(inv) !== idx);
        if (invalidInvoices.length > 0 || duplicates.length > 0) {
            return;
        }
        const invoicesToSend = invoices.map(inv => ({
            id: inv.id || undefined,
            refNo: inv.invoice!.trim(),
            date: DateUtil.toDateOnlyString(inv.date) ?? (typeof inv.date === 'string' ? inv.date : ''),
            warehouseId: inv.warehouse!,
            exchangeId: inv.currency!,
            value: inv.amount!,
            remark: inv.remark ?? null,
            salesmanId: '..default..............',
            opening: 1
        }));
        this.customerService.createCustomerInvoices(customerId, invoicesToSend).subscribe({
            next: () => {
                if (this.customerDialog) {
                    this.customerService.getCustomerInvoices(customerId).subscribe({
                        next: (invoiceData) => {
                            this.customerInvoices.set(invoiceData);
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
                        error: () => {}
                    });
                }
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: 'Customer saved but some invoices may not have been saved: ' + (error.error?.message || 'Unknown error')
                });
            }
        });
    }

    getImageUrl(path: string | null | undefined): string {
        return this.uploadService.getImageUrl(path);
    }
}

