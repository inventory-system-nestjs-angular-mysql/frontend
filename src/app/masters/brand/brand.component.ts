import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { BrandService } from './brand.service';
import {
  CreateBrandModel,
  BrandResponseModel,
} from '../../core/models/brand';
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
    selector: 'app-brand',
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
    templateUrl: './brand.component.html',
    providers: [ConfirmationService]
})
export class BrandComponent implements OnInit {
    brandDialog = false;
    brands = signal<BrandResponseModel[]>([]);
    brand: Partial<CreateBrandModel & { id?: string }> = {};
    selectedBrands: BrandResponseModel[] = [];
    submitted = false;
    cols = [
        { field: 'id', header: 'Id' },
        { field: 'description', header: 'Description' }
    ];
    @ViewChild('dt') dt!: Table;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private brandService: BrandService
    ) {}

    ngOnInit() {
        this.loadBrands();
    }

    loadBrands() {
        this.brandService.getBrands().subscribe({
            next: (data) => {
                // Sort by serialNumber (null/undefined values go to the end)
                const sorted = [...data].sort((a, b) => {
                    if (!a.serialNumber && !b.serialNumber) return 0;
                    if (!a.serialNumber) return 1;
                    if (!b.serialNumber) return -1;
                    return (a.serialNumber || '').localeCompare(b.serialNumber || '');
                });
                this.brands.set(sorted);
            },
            error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load Brands' })
        });
    }

    openNew() {
        this.brand = {};
        this.submitted = false;
        this.brandDialog = true;
    }

    editBrand(brand: BrandResponseModel) {
        this.brand = {
            id: brand.id,
            description: brand.description
        };
        this.brandDialog = true;
    }

    deleteSelectedBrands() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected brands?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const deleteRequests = this.selectedBrands.map(brand => this.brandService.deleteBrand(brand.id));
                Promise.all(deleteRequests.map(obs => obs.toPromise())).then(() => {
                    this.loadBrands();
                    this.selectedBrands = [];
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Brands Deleted', life: 3000 });
                });
            }
        });
    }

    hideDialog() {
        this.brandDialog = false;
        this.submitted = false;
    }

    deleteBrand(brand: BrandResponseModel) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + brand.description + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.brandService.deleteBrand(brand.id).subscribe({
                    next: () => {
                        this.loadBrands();
                        this.brand = {};
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Brand Deleted', life: 3000 });
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete Brand' })
                });
            }
        });
    }

    saveBrand() {
        this.submitted = true;
        if (this.brand.description?.trim()) {
            if (this.brand.id) {
                const updateDto = {
                    description: this.brand.description
                };
                this.brandService.updateBrand(this.brand.id, updateDto).subscribe({
                    next: () => {
                        this.loadBrands();
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Brand Updated', life: 3000 });
                        this.brandDialog = false;
                        this.brand = {};
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update Brand' })
                });
            } else {
                const createDto = {
                    description: this.brand.description,
                };
                this.brandService.createBrand(createDto).subscribe({
                    next: () => {
                        this.loadBrands();
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Brand Created', life: 3000 });
                        this.brandDialog = false;
                        this.brand = {};
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create Brand' })
                });
            }
        }
    }
}

