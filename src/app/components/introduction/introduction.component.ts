import { Component, OnInit } from '@angular/core';
import { TableSet } from '../../classes/table-set.class';
import { LocalStorageService} from '../../services/local.storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.css']
})
export class IntroductionComponent implements OnInit {
  steps: any = { hour: 1, minute: 15 };
  startTime: Date = new Date(2000, 2, 10, 8, 0, 0);
  endTime: Date = new Date(2000, 2, 10, 22, 30, 0);
  companyName: string = '';
  tableList: TableSet[] = [];
  isLinear = true;
  constructor(private localStorage: LocalStorageService, private router: Router) {
  }

  ngOnInit() {
    //Just some defaults to make it easier to test
    this.tableList.push(new TableSet(2,2));
    this.tableList.push(new TableSet(5,2));
    this.tableList.push(new TableSet(8,1));
  }
  addToTable(ts:TableSet, numAdded: number) {
    ts.Quantity += numAdded;
    if (ts.Quantity === 0){
      this.deleteTable(ts);
    }
  }
  deleteTable(ts:TableSet){
    const index = this.tableList.indexOf(ts, 0);
    if (index > -1) {
      this.tableList.splice(index, 1);
    }
  }
  addTables(maxCapacity: number, qty: number) {
    if (maxCapacity > 0 && qty > 0){
    let alreadyExists: boolean = false;
    this.tableList.forEach(element => {
      if (element.MaxCapacity === maxCapacity){
        element.Quantity += qty;
        alreadyExists = true;
        return;
      }
      });
      if (!alreadyExists){
        this.tableList.push(new TableSet(maxCapacity, qty));
        let sortedRes: TableSet[] = this.tableList.sort(
          function(a, b) {
              return  a.MaxCapacity - b.MaxCapacity;
            });
        this.tableList = sortedRes;
      }
    }
  }
  storeToLocalStorage(){
    this.localStorage.storeCompanyOnLocalStorage(this.companyName, this.startTime, this.endTime, this.tableList);
    this.router.navigate(['WmhMain']);
  }

}
