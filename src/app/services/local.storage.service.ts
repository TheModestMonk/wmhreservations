import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';
import { TableSet } from '../classes/table-set.class';
import { Reservation } from '../classes/reservation.class';
// key that is used to access the data in local storage
const STORAGE_KEY = 'company_info';
const RESERVATION_KEY = 'reservations';
@Injectable()
export class LocalStorageService {
    constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) { }
    
    public storeCompanyOnLocalStorage(companyName: string, companyHourOpen: Date, companyHourClose: Date, tableList: TableSet[], intervals: number): void {
        //get from local storage
        let currentCompanyInfo = this.storage.get(STORAGE_KEY);

        if (currentCompanyInfo !== null){//delete stored company/reservations
            this.storage.remove(STORAGE_KEY);
            this.storage.remove(RESERVATION_KEY);
        }
        this.storage.set(STORAGE_KEY, 
        {
            companyName: companyName,
            companyHourOpen: companyHourOpen,
            companyHourClose: companyHourClose,
            tableList: tableList,
            intervals : intervals
        });
        
        // to local storage
        console.log(this.storage.get(STORAGE_KEY) || 'LocaL storage is empty');
    }

    public getCompanyFromLocalStorage(): any {
        //get from local storage
        let currentCompanyInfo = this.storage.get(STORAGE_KEY);
        return currentCompanyInfo;    
    }

    public storeReservationOnLocalStorage(partyName: string, reservationDtm: Date, reservationSize: number, tableSize: number, tableNumber: number, arrivedFlag: boolean){
        
        let Reservations: any[] = this.storage.get(RESERVATION_KEY);
        if (Reservations === null)
            Reservations = [];
        let newRes = {
            'PartyName' : partyName, 'ReservationDtm': reservationDtm.setSeconds(0,0), 'ReservationSize': reservationSize, 
            'TableSize': tableSize, 'TableNumber': tableNumber, 'ArrivedFlag': arrivedFlag
        }
        Reservations.push(newRes);
        let sortedRes: any[] = Reservations.sort(
            function(a, b) {
                return  a.ReservationDtm - b.ReservationDtm;
              });
        this.storage.set(RESERVATION_KEY, sortedRes);
    }
    public updateReservationOnLocalStorage(partyName: string, reservationDtm: Date, reservationSize: number, tableSize: number, tableNumber: number, arrivedFlag: boolean){
        
        let Reservations: any[] = this.storage.get(RESERVATION_KEY);
        let index = 0;
        let foundIndex = -1;
        Reservations.forEach(item => {
            if (item.TableNumber === tableNumber 
                && item.TableSize === tableSize 
                && item.ReservationDtm  === reservationDtm){
                foundIndex = index;
            }
            index++;
        });
        if(foundIndex !== -1){//found reservation
            Reservations[foundIndex].ArrivedFlag = arrivedFlag;
            this.storage.set(RESERVATION_KEY, Reservations);
        }
    }
    public getReservationsFromLocalStorage(): Reservation[] {
        //get from local storage
        let Reservations = this.storage.get(RESERVATION_KEY);
        return Reservations;    
    }
    public cancelReservationFromLocalStorage(reserv : Reservation){
        
        let Reservations: any[] = this.storage.get(RESERVATION_KEY);
        let index = 0;
        let foundIndex = -1;
        Reservations.forEach(item => {
            if (item.TableNumber === reserv.TableNumber 
                && item.TableSize === reserv.TableSize 
                && item.ReservationDtm === reserv.ReservationDtm){
                    foundIndex = index;
            }
            index++;
        });
        if(foundIndex !== -1){//found reservation
            Reservations.splice(foundIndex,1);
            this.storage.set(RESERVATION_KEY, Reservations);
        }
    }

}