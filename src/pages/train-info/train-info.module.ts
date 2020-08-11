import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrainInfo } from './train-info';

@NgModule({
  declarations: [
    TrainInfo,
  ],
  imports: [
    IonicPageModule.forChild(TrainInfo),
  ],
  exports: [
    TrainInfo
  ]
})
export class TrainInfoModule {}
