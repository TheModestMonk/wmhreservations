import { Component, OnInit } from '@angular/core';
import { LocalStorageService} from '../../services/local.storage.service';
import { Router } from '@angular/router';

import { Reservation } from '../../classes/reservation.class';

@Component({
  selector: 'app-wmh-main',
  templateUrl: './wmh-main.component.html',
  styleUrls: ['./wmh-main.component.css']
})
export class WmhMainComponent implements OnInit {
  dialogOpened = false;
  steps: any = { hour: 1, minute: 15 };
  search: any = {};
  newRez: any = {};
  companyInfo : any = null;
  companyMaxTableSize : number = 0;
  todayDateTime: Date = new Date();
  companyOpenTime: Date = new Date();
  companyCloseTime: Date = new Date();
  reservationList: Reservation[] = null;
  filteredResList: Reservation[] = null;
  bookedTable: number = null;
  bookedSize: number = null;
  bookedDateTime: Date = null;
  moreInfoFlag: boolean = true;
  missingNameFlag: boolean = true;
  withinWorkingHours: boolean = true;
  
  reservationLength: number = 4; //Length in 15 minute intervals so 4 = 1 hour blocked reservation
  

  constructor(private localStorage: LocalStorageService, private router: Router) { 
  }

  ngOnInit() {
    this.companyInfo = this.localStorage.getCompanyFromLocalStorage();
    if (this.companyInfo === null){//First visit, setup required
      this.router.navigate(['introduction']);
    }
    
    this.companyOpenTime = new Date(this.companyInfo["companyHourOpen"]);
    this.companyCloseTime = new Date(this.companyInfo["companyHourClose"]);
    this.reservationLength = this.companyInfo["intervals"];
    this.todayDateTime = this.roundMinutes(this.todayDateTime); // 5:19-> 5:15
    this.search.ReservationTime = this.todayDateTime;
    this.search.ArrivedFlag = false;
    this.companyInfo.tableList.forEach(tableSet => {
      if (this.companyMaxTableSize < tableSet.MaxCapacity){
        this.companyMaxTableSize = tableSet.MaxCapacity;
      }
    });

    this.reservationList = this.localStorage.getReservationsFromLocalStorage();
    this.filterReservations();
  }

  close() {
    this.dialogOpened = false;
    
    this.bookedTable = null;
    this.bookedDateTime = null;
    this.bookedSize = null;
    this.moreInfoFlag = true;
    this.missingNameFlag = false;
  }
  open() {
    this.dialogOpened = true;
  }

  roundMinutes(date) {

    if (date.getMinutes() < 15){
      date.setMinutes(0,0,0);
    }
    else if (date.getMinutes() < 30){
      date.setMinutes(15,0,0);
    }
    else if (date.getMinutes() < 45){
      date.setMinutes(30,0,0);
    }
    else {
      date.setMinutes(45,0,0);
    }
   

    return date;
  } 
  resetFilter(){
    this.search = {};
    this.search.ReservationTime = this.todayDateTime;
    this.filterReservations();
  }
  //Example 9am-5pm -> 6pm should fail
  isWithinWorkingHours(timeToCheck : Date){
    let minute = timeToCheck.getMinutes();//0
    let hour = timeToCheck.getHours();//18
    let openMinute = this.companyOpenTime.getMinutes();//0
    let openHour = this.companyOpenTime.getHours();//9
    let closeMinute = this.companyCloseTime.getMinutes();//0
    let closeHour = this.companyCloseTime.getHours();//17

    if (openHour > hour ){//9 > 18 - > false
      return false;
    }
    else if (openHour === hour && openMinute > minute){
      return false;
    }
    else if (closeHour < hour){//17 < 18 -> true
      return false;
    }
    else if (closeHour === hour && closeMinute < minute){
      return false;
    }
    return true;
  }
  getNextReservation(){
    this.newRez.ReservationTime = this.search.ReservationTime;
    this.newRez.Name = this.search.Name;
    this.newRez.PartySize = this.search.PartySize;
  }
  findSmallestTable(): number{
    let tableSizeRequired = this.companyMaxTableSize;
    this.companyInfo.tableList.forEach(tableSet => {
      if (tableSet.MaxCapacity >= this.newRez.PartySize 
        && tableSet.MaxCapacity < tableSizeRequired){
        tableSizeRequired = tableSet.MaxCapacity;
      }
    });
    return tableSizeRequired;

  }
  findTableSetBySize(sizeOfSet: number){
    let numOfTables = 0;
    this.companyInfo.tableList.forEach(tableSet => {
      if (tableSet.MaxCapacity === sizeOfSet){
        numOfTables = tableSet.Quantity;
      }
    });
    return numOfTables;

  }
  tryToFillReservation(resDtm : Date, tableSize: number, tableNum: number) : boolean{
    let emptyTable = true;
    //Cycle through until you find a reservation that matches
    this.reservationList.forEach(bookedRes => {
      if (bookedRes.ReservationDtm as number  === resDtm.getTime()
        && bookedRes.TableSize === tableSize
        && bookedRes.TableNumber === tableNum)
      {
        emptyTable = false;
      }
    });
    return emptyTable;
  }
  searchByDateAndSize() : boolean{
    if (this.newRez.PartySize == null || this.newRez.PartySize < 0 || this.newRez.PartySize > this.companyMaxTableSize){
      this.moreInfoFlag = true;
      return false;
    }
    this.moreInfoFlag = false;

    let lookingResTime : Date = new Date((this.newRez.ReservationTime as Date).setSeconds(0,0));
    
    if (!this.isWithinWorkingHours(lookingResTime))
    {
      this.withinWorkingHours = false;
      return false;
    }
    this.withinWorkingHours = true;
    let tableFound : boolean = false;
    //Create a reservation that fits the closest available time request for the size they requested.
    let bestTableSize : number = this.findSmallestTable();
    let possibleTables : number = this.findTableSetBySize(bestTableSize);
    let tableFoundNum : number = 0;

    if (this.reservationList === null || this.reservationList.length === 0)//First customer!
    {
      this.bookedTable = 1;
      this.bookedDateTime = lookingResTime;
      this.bookedSize = bestTableSize;
      return true;
    }
    while (!tableFound){
      for(let i = 1; i <= possibleTables; i++) {
        tableFound = this.tryToFillReservation(lookingResTime, bestTableSize, i);
        if (tableFound){//Great! Now make sure that same table is open for the next times
          for (let j = 1; j < this.reservationLength; j++)
          {
            if (!this.tryToFillReservation(new Date(lookingResTime.getTime() + j*15*60000),bestTableSize, i)) {
              tableFound = false;
              break;
            }
          }
          if (tableFound)//Still a good table, check previous reservations
          {
            for (let j = 1; j < this.reservationLength; j++)
            {
              if (!this.tryToFillReservation(new Date(lookingResTime.getTime() - j*15*60000),bestTableSize, i)) {
                tableFound = false;
                break;
              }
            }
          }
          if (tableFound)//Forward backward and right on time, this table is perfect for the search
          {
            tableFoundNum = i;
            break;
          }
        }
      }
      if (tableFound){
        break;
      }
      lookingResTime = new Date(lookingResTime.getTime() + 15*60000);//Check for 15 minutes later
      //Make sure that time is within operation hours
      if (!this.isWithinWorkingHours(lookingResTime))
      {
        this.withinWorkingHours = false;
        return false;
      }

    }
    this.bookedTable = tableFoundNum;
    this.bookedDateTime = lookingResTime;
    this.bookedSize = bestTableSize;
    return true;
    

  }
  addReservation(){
    if (this.moreInfoFlag){
      
    }
    if (this.newRez.Name === null || this.newRez.Name === ''){
      this.missingNameFlag = true;
    }
    this.missingNameFlag = false;
    if (!this.searchByDateAndSize()){
      return;
    }
    this.localStorage.storeReservationOnLocalStorage(this.newRez.Name, this.bookedDateTime, this.newRez.PartySize, this.bookedSize, this.bookedTable, false);
    this.reservationList = this.localStorage.getReservationsFromLocalStorage();
    this.filterReservations();
  }
  updateReservation(updRes : Reservation){
    this.localStorage.updateReservationOnLocalStorage(updRes.PartyName, updRes.ReservationDtm, updRes.ReservationSize, updRes.TableSize, updRes.TableNumber, !updRes.ArrivedFlag);
  }
  cancelReservation(reserv : Reservation){
    this.localStorage.cancelReservationFromLocalStorage(reserv);
    this.reservationList = this.localStorage.getReservationsFromLocalStorage();
    this.filterReservations();
  }
  filterReservations(){
    if (!this.reservationList || this.reservationList.length === 0) {
      this.filteredResList = [];
      return;
    }
    let fil : Reservation[] = this.reservationList;
    if (this.search.Name !== undefined && this.search.Name !== null){
      fil = fil.filter(item => item.PartyName.indexOf(this.search.Name) !== -1);
    }
    if (this.search.ReservationTime !== undefined && this.search.ReservationTime !== null){
      let filterDtm : Date = this.search.ReservationTime.setSeconds(0,0);
      fil = fil.filter(item => item.ReservationDtm >= filterDtm);
    }
    if (this.search.PartySize !== undefined && this.search.PartySize !== null){
      fil = fil.filter(item => item.ReservationSize === this.search.PartySize);
    }
    if (this.search.ArrivedFlag !== undefined 
      && this.search.ArrivedFlag !== null
      && this.search.ArrivedFlag  === false){
      fil = fil.filter(item => item.ArrivedFlag === this.search.ArrivedFlag);
    }
    this.filteredResList = fil;
  }

}
