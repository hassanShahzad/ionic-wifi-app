import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-travel-info',
  templateUrl: 'travel-info.html',
})
export class TravelInfo {
  travelInfo;
  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
    this.travelInfo = navParams.get('result');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TravelInfo');
  }
  ionViewWillEnter() {
        //this.viewCtrl.navbar.back-button.color = "red";
  }
}
