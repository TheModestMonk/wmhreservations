import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';
import { TableSet } from '../classes/TableSet';
// key that is used to access the data in local storage
const STORAGE_KEY = 'company_info';
@Injectable()
export class LocalStorageService {
    anotherTodolist = {};
    constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) { }
     public storeOnLocalStorage(companyName: string, companyHourOpen: Date, companyHourClose: Date, tableList: TableSet[]): void {
        //get from local storage
        let currentCompanyInfo = this.storage.get(STORAGE_KEY);

        if (currentCompanyInfo === null){
            this.storage.set(STORAGE_KEY, 
                {
                    companyName: companyName,
                    companyHourOpen: companyHourOpen,
                    companyHourClose: companyHourClose,
                    tableList: tableList
                });
        }
        //Delete current storage
        else{

        }
        
        // to local storage
        console.log(this.storage.get(STORAGE_KEY) || 'LocaL storage is empty');
    }
    public getCompanyFromLocalStorage(): any {
        //get from local storage
        let currentCompanyInfo = this.storage.get(STORAGE_KEY);
        return currentCompanyInfo;    
        
        // to local storage
        console.log(this.storage.get(STORAGE_KEY) || 'LocaL storage is empty');
   }
}