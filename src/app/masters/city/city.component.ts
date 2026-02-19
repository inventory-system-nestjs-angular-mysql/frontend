import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { CityService } from './city.service';
import {
  CreateCityModel,
  CityResponseModel,
} from '../../core/models/city';
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
    selector: 'app-city',
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
    templateUrl: './city.component.html',
    providers: [ConfirmationService]
})
export class CityComponent implements OnInit {
    cityDialog = false;
    cities = signal<CityResponseModel[]>([]);
    city: Partial<CreateCityModel & { id?: string }> = {};
    selectedCities: CityResponseModel[] = [];
    submitted = false;
    cols = [
        { field: 'id', header: 'Id' },
        { field: 'description', header: 'Description' }
    ];
    @ViewChild('dt') dt!: Table;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private cityService: CityService
    ) {}

    ngOnInit() {
        this.loadCities();
    }

    loadCities() {
        this.cityService.getCities().subscribe({
            next: (data) => {
                // Sort by serialNumber (null/undefined values go to the end)
                const sorted = [...data].sort((a, b) => {
                    if (!a.serialNumber && !b.serialNumber) return 0;
                    if (!a.serialNumber) return 1;
                    if (!b.serialNumber) return -1;
                    return (a.serialNumber || '').localeCompare(b.serialNumber || '');
                });
                this.cities.set(sorted);
            },
            error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load Cities' })
        });
    }

    openNew() {
        this.city = {};
        this.submitted = false;
        this.cityDialog = true;
    }

    editCity(city: CityResponseModel) {
        this.city = {
            id: city.id,
            description: city.description
        };
        this.cityDialog = true;
    }

    deleteSelectedCities() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected cities?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const deleteRequests = this.selectedCities.map(city => this.cityService.deleteCity(city.id));
                Promise.all(deleteRequests.map(obs => obs.toPromise())).then(() => {
                    this.loadCities();
                    this.selectedCities = [];
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Cities Deleted', life: 3000 });
                });
            }
        });
    }

    hideDialog() {
        this.cityDialog = false;
        this.submitted = false;
    }

    deleteCity(city: CityResponseModel) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + city.description + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.cityService.deleteCity(city.id).subscribe({
                    next: () => {
                        this.loadCities();
                        this.city = {};
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'City Deleted', life: 3000 });
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete City' })
                });
            }
        });
    }

    saveCity() {
        this.submitted = true;
        if (this.city.description?.trim()) {
            if (this.city.id) {
                const updateDto = {
                    description: this.city.description
                };
                this.cityService.updateCity(this.city.id, updateDto).subscribe({
                    next: () => {
                        this.loadCities();
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'City Updated', life: 3000 });
                        this.cityDialog = false;
                        this.city = {};
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update City' })
                });
            } else {
                const createDto = {
                    description: this.city.description,
                };
                this.cityService.createCity(createDto).subscribe({
                    next: () => {
                        this.loadCities();
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'City Created', life: 3000 });
                        this.cityDialog = false;
                        this.city = {};
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create City' })
                });
            }
        }
    }
}

