import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { SupplierService } from './supplier.service';
import { CityService } from '../city/city.service';
import {
  CreateSupplierModel,
  SupplierResponseModel,
} from '../../core/models/supplier';
import { CityResponseModel } from '../../core/models/city/city-response.model';
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
    supplier: Partial<CreateSupplierModel & { id?: string }> = {};
    selectedSuppliers: SupplierResponseModel[] = [];
    submitted = false;
    cols = [
        { field: 'code', header: 'Code' },
        { field: 'name', header: 'Name' },
        { field: 'cityId', header: 'City' },
        { field: 'discount', header: 'Disc %' },
        { field: 'term', header: 'Term' },
        { field: 'isSuspended', header: 'Status' }
    ];
    @ViewChild('dt') dt!: Table;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private supplierService: SupplierService,
        private cityService: CityService
    ) {}

    ngOnInit() {
        this.loadSuppliers();
        this.loadCities();
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
        if (this.supplier.code?.trim() && this.supplier.name?.trim()) {
            const supplierToSend = { ...this.supplier };
            
            if (this.supplier.id) {
                // Update
                const { id, ...updateDto } = supplierToSend;
                this.supplierService.updateSupplier(id!, updateDto).subscribe({
                    next: () => {
                        this.loadSuppliers();
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Supplier Updated', life: 3000 });
                        this.supplierDialog = false;
                        this.supplier = {};
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update Supplier' })
                });
            } else {
                // Create
                const { id, ...createDto } = supplierToSend;
                this.supplierService.createSupplier(createDto as CreateSupplierModel).subscribe({
                    next: () => {
                        this.loadSuppliers();
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Supplier Created', life: 3000 });
                        this.supplierDialog = false;
                        this.supplier = {};
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create Supplier' })
                });
            }
        }
    }

    onImageSelect(event: any) {
        const file = event.files[0];
        if (file) {
            this.supplier.imagePath = file.name;
        }
    }

    getCityName(cityId: string | null | undefined): string {
        if (!cityId) return '';
        const city = this.cities().find(c => c.id === cityId);
        return city?.description || '';
    }
}

