import { Injectable } from "@angular/core";

@Injectable()
export class Reservation {
    PartyName: string;
    ReservationDtm: Date;
    ReservationSize: number;
    TableSize: number;
    TableNumber: number;
    ArrivedFlag: boolean;
    constructor(partyName: string, reservationDtm: Date, reservationSize: number, tableSize: number, tableNumber: number, arrivedFlag: boolean) {
        this.PartyName = partyName;
        this.ReservationDtm = reservationDtm;
        this.ReservationSize = reservationSize;
        this.TableSize = tableSize;
        this.TableNumber = tableNumber;
        this.ArrivedFlag = arrivedFlag;
    }



}