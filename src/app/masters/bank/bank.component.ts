import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { BankService } from './bank.service';
import {
  CreateBankModel,
  BankResponseModel,
} from '../../core/models/bank';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
    selector: 'app-bank',
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
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule
    ],
    templateUrl: './bank.component.html',
    providers: [MessageService, ConfirmationService]
})
export class BankComponent implements OnInit {
    bankDialog = false;
    banks = signal<BankResponseModel[]>([]);
    bank: Partial<CreateBankModel & { id?: string }> = {};
    selectedBanks: BankResponseModel[] = [];
    submitted = false;
    cols = [
        { field: 'id', header: 'Id' },
        { field: 'description', header: 'Description' }
    ];
    @ViewChild('dt') dt!: Table;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private bankService: BankService
    ) {}

    ngOnInit() {
        this.loadBanks();
    }

    loadBanks() {
        this.bankService.getBanks().subscribe({
            next: (data) => {
                // Sort by serialNumber (null/undefined values go to the end)
                const sorted = [...data].sort((a, b) => {
                    if (!a.serialNumber && !b.serialNumber) return 0;
                    if (!a.serialNumber) return 1;
                    if (!b.serialNumber) return -1;
                    return (a.serialNumber || '').localeCompare(b.serialNumber || '');
                });
                this.banks.set(sorted);
            },
            error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load Banks' })
        });
    }

    openNew() {
        this.bank = {};
        this.submitted = false;
        this.bankDialog = true;
    }

    editBank(bank: BankResponseModel) {
        this.bank = {
            id: bank.id,
            description: bank.description
        };
        this.bankDialog = true;
    }

    deleteSelectedBanks() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected banks?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const deleteRequests = this.selectedBanks.map(bank => this.bankService.deleteBank(bank.id));
                Promise.all(deleteRequests.map(obs => obs.toPromise())).then(() => {
                    this.loadBanks();
                    this.selectedBanks = [];
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Banks Deleted', life: 3000 });
                });
            }
        });
    }

    hideDialog() {
        this.bankDialog = false;
        this.submitted = false;
    }

    deleteBank(bank: BankResponseModel) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + bank.description + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.bankService.deleteBank(bank.id).subscribe({
                    next: () => {
                        this.loadBanks();
                        this.bank = {};
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Bank Deleted', life: 3000 });
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete Bank' })
                });
            }
        });
    }

    saveBank() {
        this.submitted = true;
        if (this.bank.description?.trim()) {
            if (this.bank.id) {
                const updateDto = {
                    description: this.bank.description
                };
                this.bankService.updateBank(this.bank.id, updateDto).subscribe({
                    next: () => {
                        this.loadBanks();
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Bank Updated', life: 3000 });
                        this.bankDialog = false;
                        this.bank = {};
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update Bank' })
                });
            } else {
                const createDto = {
                    description: this.bank.description,
                };
                this.bankService.createBank(createDto).subscribe({
                    next: () => {
                        this.loadBanks();
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Bank Created', life: 3000 });
                        this.bankDialog = false;
                        this.bank = {};
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create Bank' })
                });
            }
        }
    }
}

