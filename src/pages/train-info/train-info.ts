import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-train-info',
  templateUrl: 'train-info.html',
})
export class TrainInfo {
  trainInfo;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.trainInfo = navParams.get('result');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TrainInfo');
  }

}
