import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform } from 'ionic-angular';
import { TrainInfo } from '../train-info/train-info';
import { TravelInfo } from '../travel-info/travel-info';
import { Webservice } from '../../providers/webservice';
import {SharedService} from '../../providers/shared-service';
import { Keychain } from '@ionic-native/keychain';
import { AlertController } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';




  declare var SharedPreferences;

@IonicPage()
@Component({
  selector: 'page-wifi',
  templateUrl: 'wifi.html',
  providers: [Webservice, Keyboard]
})
export class Wifi {
  loading : any;
  wifiImage : string;
  travelImage : string;
  trainImage : string;
  settingImage : string;
  loadingPresented;
  loadingTimer;
  dataType : string;


  constructor(public navCtrl: NavController, public navParams: NavParams, private webservice: Webservice, private shareService: SharedService, private loadingController:LoadingController, public Platform: Platform, private keychain: Keychain, public alertCtrl: AlertController) {
      this.wifiImage = "./assets/wifi.png";
      this.trainImage = "./assets/train.png";
      this.travelImage = "./assets/travel.png";
      this.settingImage = "./assets/setting.png";

  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad Wifi');
  }

  // Get travel information (stops, time)
  getTravelInfo() {
    //this.navCtrl.push(TravelInfo);

    // Show activity indicator
    this.showLoading();
    this.dataType = "travel";
    // Get token
    //this.getToken();
    this.goToTrainTravelInfo();



  }

  // Get information about the train
  getTrainInfo() {
      //this.navCtrl.push(TrainInfo);
    // Show activity indicator
    this.showLoading();
    this.dataType = "train";
    // Get token
    //this.getToken();
    this.goToTrainTravelInfo();

  }

  travelData()
  {
    this.webservice.getTravelInfo().subscribe(data => {
        this.hideLoading();

        // On successful registeration show alert and navigate back to home page
        let result = data;
        data.forEach(info => {
          info.time = new Date(info.time).toLocaleTimeString()
        });

        this.navCtrl.push(TravelInfo, {result});

    },
    error=>{
        // Show errors message based on the error
        if(error.status === 400) {
          this.showAlert("Invalid request");

        }
        else if(error.status === 401) {

           this.showAlert("Invalid data");

        }
        else if(error.status === 403) {
            this.showAlert("Permission denied");

        }
        else {
            this.showAlert("An error occur");

        }

        this.hideLoading();

        });


  }


  trainData(){
    // Get response data from the server
    this.webservice.getTrainInfo().subscribe(data => {
        this.hideLoading();
        // On successful registeration show alert and navigate back to home page
        let result = data;
        this.navCtrl.push(TrainInfo, {result});
    },
    error=>{
        // Show errors message based on the error
        if(error.status === 400) {
           this.showAlert("Invalid request");

        }
        else if(error.status === 401) {

           this.showAlert("Invalid data");

        }
        else if(error.status === 403) {
            this.showAlert("Permission denied");

        }
        else {
            this.showAlert("An error occur");

        }

        this.hideLoading();

        });

  }

  showAlert(msg : string) {
    let alert = this.alertCtrl.create({
      title: '',
      subTitle: msg,
      buttons: ['OK']
   });
    alert.present();
  }


  showLoading(){
    this.loading = this.loadingController.create({content : ""});
    this.loadingPresented = false;
    this.loadingTimer = setTimeout(() => {
       this.loading.present();
       this.loadingPresented = true;
    }, 500);
  }

  hideLoading(){
    if (this.loadingPresented) {
    this.loading.dismissAll();
    }
    else {
    clearTimeout(this.loadingTimer);
    }
  }



  goToTrainTravelInfo()
  {

    //if(token) {
      if(this.dataType == "travel"){
        this.travelData();
      }
      else if(this.dataType == "train"){
        this.trainData();

      }

    //}
    else{
      this.hideLoading();
    }
  }

}
