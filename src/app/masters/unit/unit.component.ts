import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { UnitService } from './unit.service';
import {
  CreateUnitModel,
  UnitResponseModel,
} from '../../core/models/unit';
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

// Unit interface imported from service

@Component({
    selector: 'app-unit',
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
    templateUrl: './unit.component.html',
    providers: [MessageService, ConfirmationService]
})
export class UnitComponent implements OnInit {
    unitDialog = false;
    units = signal<UnitResponseModel[]>([]);
    unit: Partial<CreateUnitModel & { id?: string }> = {};
    selectedUnits: UnitResponseModel[] = [];
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
        private unitService: UnitService
    ) {}

    ngOnInit() {
        this.loadUnits();
    }

    loadUnits() {
        this.unitService.getUnits().subscribe({
            next: (data) => {
                // Sort by serialNumber (null/undefined values go to the end)
                const sorted = [...data].sort((a, b) => {
                    if (!a.serialNumber && !b.serialNumber) return 0;
                    if (!a.serialNumber) return 1;
                    if (!b.serialNumber) return -1;
                    return (a.serialNumber || '').localeCompare(b.serialNumber || '');
                });
                this.units.set(sorted);
            },
            error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load Units' })
        });
    }

    openNew() {
        this.unit = {};
        this.submitted = false;
        this.unitDialog = true;
    }

    editUnit(u: UnitResponseModel) {
        this.unit = {
            id: u.id,
            description: u.description,
            serialNumber: u.serialNumber,
            coreTax: u.coreTax
        };
        this.unitDialog = true;
    }

    deleteSelectedUnits() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected units?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const deleteRequests = this.selectedUnits.map(u => this.unitService.deleteUnit(u.id));
                Promise.all(deleteRequests.map(obs => obs.toPromise())).then(() => {
                    this.loadUnits();
                    this.selectedUnits = [];
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Units Deleted', life: 3000 });
                });
            }
        });
    }

    hideDialog() {
        this.unitDialog = false;
        this.submitted = false;
    }

    deleteUnit(u: UnitResponseModel) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + u.description + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.unitService.deleteUnit(u.id).subscribe({
                    next: () => {
                        this.loadUnits();
                        this.unit = {};
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Unit Deleted', life: 3000 });
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete Unit' })
                });
            }
        });
    }

    saveUnit() {
        this.submitted = true;
        if (this.unit.description?.trim()) {
            if (this.unit.id) {
                const updateDto = { 
                    description: this.unit.description,
                    coreTax: this.unit.coreTax
                };
                this.unitService.updateUnit(this.unit.id, updateDto).subscribe({
                    next: () => {
                        this.loadUnits();
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Unit Updated', life: 3000 });
                        this.unitDialog = false;
                        this.unit = {};
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update Unit' })
                });
            } else {
                const createDto = { 
                    description: this.unit.description,
                    coreTax: this.unit.coreTax
                };
                this.unitService.createUnit(createDto).subscribe({
                    next: () => {
                        this.loadUnits();
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Unit Created', life: 3000 });
                        this.unitDialog = false;
                        this.unit = {};
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create Unit' })
                });
            }
        }
    }
}

