import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Wifi } from './wifi';

@NgModule({
  declarations: [
    Wifi,
  ],
  imports: [
    IonicPageModule.forChild(Wifi),
  ],
  exports: [
    Wifi
  ]
})
export class WifiModule {}
