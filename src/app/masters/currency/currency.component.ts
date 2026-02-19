import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { CurrencyService } from './currency.service';
import {
  CreateCurrencyModel,
  CurrencyResponseModel,
} from '../../core/models/currency';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
    selector: 'app-currency',
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
        InputNumberModule,
        DialogModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule
    ],
    templateUrl: './currency.component.html',
    providers: [ConfirmationService]
})
export class CurrencyComponent implements OnInit {
    currencyDialog = false;
    currencies = signal<CurrencyResponseModel[]>([]);
    currency: Partial<CreateCurrencyModel & { id?: string }> = {};
    selectedCurrencies: CurrencyResponseModel[] = [];
    submitted = false;
    cols = [
        { field: 'currency', header: 'Currency' },
        { field: 'rate', header: 'Rate' },
        { field: 'taxRate', header: 'Tax Rate' }
    ];
    @ViewChild('dt') dt!: Table;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private currencyService: CurrencyService
    ) {}

    ngOnInit() {
        this.loadCurrencies();
    }

    loadCurrencies() {
        this.currencyService.getCurrencies().subscribe({
            next: (data) => {
                // Sort by serialNumber (null/undefined values go to the end)
                const sorted = [...data].sort((a, b) => {
                    if (!a.serialNumber && !b.serialNumber) return 0;
                    if (!a.serialNumber) return 1;
                    if (!b.serialNumber) return -1;
                    return (a.serialNumber || '').localeCompare(b.serialNumber || '');
                });
                this.currencies.set(sorted);
            },
            error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load Currencies' })
        });
    }

    openNew() {
        this.currency = {
            rate: 0,
            taxRate: 0
        };
        this.submitted = false;
        this.currencyDialog = true;
    }

    editCurrency(currency: CurrencyResponseModel) {
        this.currency = {
            id: currency.id,
            currency: currency.currency,
            rate: currency.rate,
            taxRate: currency.taxRate,
            serialNumber: currency.serialNumber
        };
        this.currencyDialog = true;
    }

    deleteSelectedCurrencies() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected currencies?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const deleteRequests = this.selectedCurrencies.map(currency => this.currencyService.deleteCurrency(currency.id));
                Promise.all(deleteRequests.map(obs => obs.toPromise())).then(() => {
                    this.loadCurrencies();
                    this.selectedCurrencies = [];
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Currencies Deleted', life: 3000 });
                });
            }
        });
    }

    hideDialog() {
        this.currencyDialog = false;
        this.submitted = false;
    }

    deleteCurrency(currency: CurrencyResponseModel) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + currency.currency + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.currencyService.deleteCurrency(currency.id).subscribe({
                    next: () => {
                        this.loadCurrencies();
                        this.currency = {};
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Currency Deleted', life: 3000 });
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete Currency' })
                });
            }
        });
    }

    saveCurrency() {
        this.submitted = true;
        if (this.currency.currency?.trim() && this.currency.rate !== undefined) {
            if (this.currency.id) {
                const updateDto = {
                    currency: this.currency.currency,
                    rate: this.currency.rate,
                    taxRate: this.currency.taxRate ?? 0,
                    serialNumber: this.currency.serialNumber
                };
                this.currencyService.updateCurrency(this.currency.id, updateDto).subscribe({
                    next: () => {
                        this.loadCurrencies();
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Currency Updated', life: 3000 });
                        this.currencyDialog = false;
                        this.currency = {};
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update Currency' })
                });
            } else {
                const createDto: CreateCurrencyModel = {
                    currency: this.currency.currency!,
                    rate: this.currency.rate!,
                    taxRate: this.currency.taxRate ?? 0,
                    serialNumber: this.currency.serialNumber
                };
                this.currencyService.createCurrency(createDto).subscribe({
                    next: () => {
                        this.loadCurrencies();
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Currency Created', life: 3000 });
                        this.currencyDialog = false;
                        this.currency = {};
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create Currency' })
                });
            }
        }
    }

    formatNumber(value: number | null | undefined): string {
        if (value === null || value === undefined) return '-';
        return new Intl.NumberFormat('id-ID', { 
            minimumFractionDigits: 4, 
            maximumFractionDigits: 4 
        }).format(value);
    }
}

