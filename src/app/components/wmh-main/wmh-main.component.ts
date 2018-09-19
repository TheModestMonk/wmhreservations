import { Component, OnInit } from '@angular/core';
import { LocalStorageService} from '../../services/local.storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wmh-main',
  templateUrl: './wmh-main.component.html',
  styleUrls: ['./wmh-main.component.css']
})
export class WmhMainComponent implements OnInit {
public companyInfo : any = null;
  constructor(private localStorage: LocalStorageService, public router: Router) { 

  }

  ngOnInit() {
    this.companyInfo = this.localStorage.getCompanyFromLocalStorage();
    if (this.companyInfo === null){//First visit, setup required
      this.router.navigate(['introduction']);
    }
  }

}
