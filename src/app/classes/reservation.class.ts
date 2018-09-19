import { Injectable } from "@angular/core";

@Injectable()
export class Reservation {
    PartyName: string;
    ReservationDtm: Date;
    ReservationSize: number;
    constructor(partyName: string, reservationDtm: Date, reservationSize: number) {
        this.PartyName = partyName;
        this.ReservationDtm = reservationDtm;
        this.ReservationSize = reservationSize;
    }
}