import { Injectable } from "@angular/core";

@Injectable()
export class TableSet {
    MaxCapacity: number;
    Quantity: number;
    constructor(maxCp: number, qty: number) {
        this.MaxCapacity = maxCp;
        this.Quantity = qty;
    }
}