import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { WmhMainComponent } from './components/wmh-main/wmh-main.component';
import { IntroductionComponent } from './components/introduction/introduction.component';

import {MatStepperModule} from '@angular/material/stepper';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { StorageServiceModule } from 'angular-webstorage-service';
import {LocalStorageService} from '../app/services/local.storage.service'



const appRoutes: Routes = [
  { path: 'introduction', component: IntroductionComponent },
  {
    path: 'WmhMain',
    component: WmhMainComponent,
    data: { title: 'WMH Reservations' }
  },
  { path: '**',
    redirectTo: '/WmhMain',
    pathMatch: 'full'
  },
];
@NgModule({
  declarations: [
    AppComponent,
    WmhMainComponent,
    IntroductionComponent
  ],
  imports: [
    BrowserAnimationsModule,
    MatStepperModule,
    StorageServiceModule,
    FormsModule,
    BrowserModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    InputsModule,
    DateInputsModule
  ],
  providers: [ LocalStorageService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
