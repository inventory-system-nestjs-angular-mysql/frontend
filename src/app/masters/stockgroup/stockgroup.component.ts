import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { StockGroupService } from './stockgroup.service';
import {
  CreateStockGroupModel,
  StockGroupResponseModel,
} from '../../core/models/stockgroup';
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
import { TooltipModule } from 'primeng/tooltip';

// StockGroup interface imported from service

@Component({
    selector: 'app-stockgroup',
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
        ConfirmDialogModule,

    ],
    templateUrl: './stockgroup.component.html',
    providers: [ConfirmationService]
})
export class StockGroupComponent implements OnInit {
    stockGroupDialog = false;
    stockGroups = signal<StockGroupResponseModel[]>([]);
    stockGroup: Partial<CreateStockGroupModel & { id?: string }> = {};
    selectedStockGroups: StockGroupResponseModel[] = [];
    submitted = false;
    cols = [
        { field: 'id', header: 'Id' },
        { field: 'description', header: 'Description' }
    ];
    @ViewChild('dt') dt!: Table;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private stockGroupService: StockGroupService
    ) {}

    ngOnInit() {
        this.loadStockGroups();
    }

    loadStockGroups() {
        this.stockGroupService.getStockGroups().subscribe({
            next: (data) => {
                // Sort by serialNumber (null/undefined values go to the end)
                const sorted = [...data].sort((a, b) => {
                    if (!a.serialNumber && !b.serialNumber) return 0;
                    if (!a.serialNumber) return 1;
                    if (!b.serialNumber) return -1;
                    return (a.serialNumber || '').localeCompare(b.serialNumber || '');
                });
                this.stockGroups.set(sorted);
            },
            error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load Stock Groups' })
        });
    }

    openNew() {
        this.stockGroup = {};
        this.submitted = false;
        this.stockGroupDialog = true;
    }

    editStockGroup(sg: StockGroupResponseModel) {
        this.stockGroup = {
            id: sg.id,
            description: sg.description,
            serialNumber: sg.serialNumber
        };
        this.stockGroupDialog = true;
    }

    deleteSelectedStockGroups() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected stock groups?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const deleteRequests = this.selectedStockGroups.map(sg => this.stockGroupService.deleteStockGroup(sg.id));
                Promise.all(deleteRequests.map(obs => obs.toPromise())).then(() => {
                    this.loadStockGroups();
                    this.selectedStockGroups = [];
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Stock Groups Deleted', life: 3000 });
                });
            }
        });
    }

    hideDialog() {
        this.stockGroupDialog = false;
        this.submitted = false;
    }

    deleteStockGroup(sg: StockGroupResponseModel) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + sg.description + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.stockGroupService.deleteStockGroup(sg.id).subscribe({
                    next: () => {
                        this.loadStockGroups();
                        this.stockGroup = {};
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Stock Group Deleted', life: 3000 });
                    },
                    // error: () => {}
                    error: (error) => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete Stock Group' })
                });
            }
        });
    }

    saveStockGroup() {
        this.submitted = true;
        if (this.stockGroup.description?.trim()) {
            if (this.stockGroup.id) {
                const updateDto = { 
                    description: this.stockGroup.description
                };
                this.stockGroupService.updateStockGroup(this.stockGroup.id, updateDto).subscribe({
                    next: () => {
                        this.loadStockGroups();
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Stock Group Updated', life: 3000 });
                        this.stockGroupDialog = false;
                        this.stockGroup = {};
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update Stock Group' })
                });
            } else {
                const createDto = { 
                    description: this.stockGroup.description,
                };
                this.stockGroupService.createStockGroup(createDto).subscribe({
                    next: () => {
                        this.loadStockGroups();
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Stock Group Created', life: 3000 });
                        this.stockGroupDialog = false;
                        this.stockGroup = {};
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create Stock Group' })
                });
            }
        }
    }
}
