import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { SalesmanService } from './salesman.service';
import { UploadService } from '../../core/services/upload.service';
import {
  CreateSalesmanModel,
  SalesmanResponseModel,
} from '../../core/models/salesman';
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
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
    selector: 'app-salesman',
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
        CheckboxModule,
        DatePickerModule
    ],
    templateUrl: './salesman.component.html',
    providers: [ConfirmationService]
})
export class SalesmanComponent implements OnInit {
    salesmanDialog = false;
    salesmen = signal<SalesmanResponseModel[]>([]);
    salesman: Partial<CreateSalesmanModel & { id?: string }> = {};
    selectedSalesmen: SalesmanResponseModel[] = [];
    submitted = false;
    cols = [
        { field: 'name', header: 'Name' },
        { field: 'address1', header: 'Address' },
        { field: 'commission', header: 'Commission' },
        { field: 'lastDate', header: 'Last Transaction' },
        { field: 'isSuspended', header: 'Status' }
    ];
    @ViewChild('dt') dt!: Table;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private salesmanService: SalesmanService,
        private uploadService: UploadService
    ) {}

    ngOnInit() {
        this.loadSalesmen();
    }

    loadSalesmen() {
        this.salesmanService.getSalesmen().subscribe({
            next: (data) => this.salesmen.set(data),
            error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load Salesmen' })
        });
    }

    openNew() {
        this.salesman = {
            name: '',
            commission: 0,
            isSuspended: false
        };
        this.submitted = false;
        this.salesmanDialog = true;
    }

    editSalesman(salesman: SalesmanResponseModel) {
        this.salesman = {
            id: salesman.id,
            name: salesman.name,
            address1: salesman.address1 ?? undefined,
            address2: salesman.address2 ?? undefined,
            address3: salesman.address3 ?? undefined,
            lastDate: salesman.lastDate ? new Date(salesman.lastDate) : undefined,
            commission: salesman.commission ?? undefined,
            isSuspended: salesman.isSuspended,
            memo: salesman.memo ?? undefined,
            imagePath: salesman.imagePath ?? undefined,
            special: salesman.special ?? undefined
        };
        this.salesmanDialog = true;
    }

    deleteSelectedSalesmen() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected salesmen?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const deleteRequests = this.selectedSalesmen.map(s => this.salesmanService.deleteSalesman(s.id));
                Promise.all(deleteRequests.map(obs => obs.toPromise())).then(() => {
                    this.loadSalesmen();
                    this.selectedSalesmen = [];
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Salesmen Deleted', life: 3000 });
                });
            }
        });
    }

    hideDialog() {
        this.salesmanDialog = false;
        this.submitted = false;
    }

    deleteSalesman(salesman: SalesmanResponseModel) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + salesman.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.salesmanService.deleteSalesman(salesman.id).subscribe({
                    next: () => {
                        this.loadSalesmen();
                        this.salesman = {};
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Salesman Deleted', life: 3000 });
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete Salesman' })
                });
            }
        });
    }

    saveSalesman() {
        this.submitted = true;
        if (this.salesman.name?.trim()) {
            const salesmanToSend = { ...this.salesman };
            
            if (this.salesman.id) {
                // Update
                const { id, ...updateDto } = salesmanToSend;
                this.salesmanService.updateSalesman(id!, updateDto).subscribe({
                    next: () => {
                        this.loadSalesmen();
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Salesman Updated', life: 3000 });
                        this.salesmanDialog = false;
                        this.salesman = {};
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update Salesman' })
                });
            } else {
                // Create
                const { id, ...createDto } = salesmanToSend;
                this.salesmanService.createSalesman(createDto as CreateSalesmanModel).subscribe({
                    next: () => {
                        this.loadSalesmen();
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Salesman Created', life: 3000 });
                        this.salesmanDialog = false;
                        this.salesman = {};
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create Salesman' })
                });
            }
        }
    }

    onImageSelect(event: any) {
        const file = event.target?.files?.[0] || event.files?.[0];
        if (file) {
            // Upload the image
            this.uploadService.uploadImage(file).subscribe({
                next: (response) => {
                    this.salesman.imagePath = response.path;
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
}

