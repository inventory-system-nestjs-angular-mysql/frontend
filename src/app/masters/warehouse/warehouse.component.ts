import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { WarehouseService } from './warehouse.service';
import {
  CreateWarehouseModel,
  WarehouseResponseModel,
} from '../../core/models/warehouse';
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
    selector: 'app-warehouse',
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
    templateUrl: './warehouse.component.html',
    providers: [MessageService, ConfirmationService]
})
export class WarehouseComponent implements OnInit {
    warehouseDialog = false;
    warehouses = signal<WarehouseResponseModel[]>([]);
    warehouse: Partial<CreateWarehouseModel & { id?: string }> = {};
    selectedWarehouses: WarehouseResponseModel[] = [];
    submitted = false;
    cols = [
        { field: 'id', header: 'Id' },
        { field: 'serialNumber', header: 'Serial Number' },
        { field: 'description', header: 'Description' }
    ];
    @ViewChild('dt') dt!: Table;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private warehouseService: WarehouseService
    ) {}

    ngOnInit() {
        this.loadWarehouses();
    }

    loadWarehouses() {
        this.warehouseService.getWarehouses().subscribe({
            next: (data) => {
                // Sort by serialNumber (null/undefined values go to the end)
                const sorted = [...data].sort((a, b) => {
                    if (!a.serialNumber && !b.serialNumber) return 0;
                    if (!a.serialNumber) return 1;
                    if (!b.serialNumber) return -1;
                    return (a.serialNumber || '').localeCompare(b.serialNumber || '');
                });
                this.warehouses.set(sorted);
            },
            error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load Warehouses' })
        });
    }

    openNew() {
        this.warehouse = {};
        this.submitted = false;
        this.warehouseDialog = true;
    }

    editWarehouse(warehouse: WarehouseResponseModel) {
        this.warehouse = {
            id: warehouse.id,
            description: warehouse.description
        };
        this.warehouseDialog = true;
    }

    deleteSelectedWarehouses() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected warehouses?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const deleteRequests = this.selectedWarehouses.map(warehouse => this.warehouseService.deleteWarehouse(warehouse.id));
                Promise.all(deleteRequests.map(obs => obs.toPromise())).then(() => {
                    this.loadWarehouses();
                    this.selectedWarehouses = [];
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Warehouses Deleted', life: 3000 });
                });
            }
        });
    }

    hideDialog() {
        this.warehouseDialog = false;
        this.submitted = false;
    }

    deleteWarehouse(warehouse: WarehouseResponseModel) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + warehouse.description + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.warehouseService.deleteWarehouse(warehouse.id).subscribe({
                    next: () => {
                        this.loadWarehouses();
                        this.warehouse = {};
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Warehouse Deleted', life: 3000 });
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete Warehouse' })
                });
            }
        });
    }

    saveWarehouse() {
        this.submitted = true;
        if (this.warehouse.description?.trim()) {
            if (this.warehouse.id) {
                const updateDto = { 
                    description: this.warehouse.description
                };
                this.warehouseService.updateWarehouse(this.warehouse.id, updateDto).subscribe({
                    next: () => {
                        this.loadWarehouses();
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Warehouse Updated', life: 3000 });
                        this.warehouseDialog = false;
                        this.warehouse = {};
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update Warehouse' })
                });
            } else {
                const createDto = { 
                    description: this.warehouse.description,
                };
                this.warehouseService.createWarehouse(createDto).subscribe({
                    next: () => {
                        this.loadWarehouses();
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Warehouse Created', life: 3000 });
                        this.warehouseDialog = false;
                        this.warehouse = {};
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create Warehouse' })
                });
            }
        }
    }
}

