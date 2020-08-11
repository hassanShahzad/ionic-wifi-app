import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Autocomplete } from './autocomplete';

@NgModule({
  declarations: [
    Autocomplete,
  ],
  imports: [
    IonicPageModule.forChild(Autocomplete),
  ],
  exports: [
    Autocomplete
  ]
})
export class AutocompleteModule {}
