import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TravelInfo } from './travel-info';

@NgModule({
  declarations: [
    TravelInfo,
  ],
  imports: [
    IonicPageModule.forChild(TravelInfo),
  ],
  exports: [
    TravelInfo
  ]
})
export class TravelInfoModule {}
