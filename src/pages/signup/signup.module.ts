import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Signup } from './signup';
import { CommonModule } from '@angular/common';



@NgModule({

  declarations: [
    Signup
  ],
  imports: [
    IonicPageModule.forChild(Signup),CommonModule
  ],
  exports: [
    Signup
  ]
})
export class SignupModule {}
