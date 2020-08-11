import {Component, NgZone} from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Webservice } from '../../providers/webservice';
import { Wifi } from '../wifi/wifi';
import {SharedService} from '../../providers/shared-service';
import { Keychain } from '@ionic-native/keychain';
import { AlertController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { Keyboard } from '@ionic-native/keyboard';



declare var google:any;

@IonicPage()
@Component({
  selector: 'page-autocomplete',
  templateUrl: 'autocomplete.html',
  providers: [Webservice, Network, Keyboard]
})
export class Autocomplete  {
  address;
  autocompleteItems;
  autocomplete;
  service;
  loading;
  loadingPresented;
  loadingTimer;
  userInfo : FormGroup;
  gender;
  validationImageCity : string;
  validationGender : string;
  tickMarkImage : string;
  crossMarkImage : string;
  cityData = {
    name: '',
    lat: '',
    lng: ''
  }

 
  constructor(public navCtrl: NavController, public navParams: NavParams, private zone: NgZone, private loadingController:LoadingController, private fb: FormBuilder, private webservice: Webservice, private sharedService: SharedService, public Platform: Platform, private keychain: Keychain, public alertCtrl: AlertController,private network: Network) {
    this.userInfo = this.fb.group({
      city: ['', Validators.required],
      gender: ['', Validators.required]

    });

    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
    this.tickMarkImage = "./assets/tickMark.png";
    this.crossMarkImage = "./assets/crossMark.png";
    Platform.ready().then(() => {
      this.addGoogelMapScriptTag();
    });

  }
  addGoogelMapScriptTag(){
    //Add google map api script fpr places
    var script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyD7gIgWw0OkIgKz3BqalzV4-MEgiwoZTyI&libraries=places';
    script.type = 'text/javascript';
    document.head.appendChild(script);
    

}

  checkNetwork(){


  this.network.onConnect().subscribe(() => {
     alert('network connected!');
     // We just got a connection but we need to wait briefly
     // before we determine the connection type. Might need to wait.
     // prior to doing any api requests as well.

  setTimeout(() => {
    
      alert('Connected to the internet');

  }, 3000);
});


}

offline() {
    alert('offline');
}

online() {
    alert('online');
}
  

  ionViewDidLoad() {

  }


 // Get latitude and longitude of the city 
 getLatitudeLongitude(city:string):void
 {
      // Initialize the Geocoder
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode( {address: city}, (destinations, status) => {

      if (status === google.maps.GeocoderStatus.OK) {
        // Get latitude and longitude of the city 
        var latitude = destinations[0].geometry.location.lat();
        var longitude = destinations[0].geometry.location.lng();
        this.autocomplete.query = city;
        
        // Put city information in cityData
        this.cityData.name = city;
        this.cityData.lat = latitude;
        this.cityData.lng = longitude;


      }
      else if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
        // Put city information in cityData
        this.cityData.name = city;
        this.cityData.lat = "00.00";
        this.cityData.lng = "00.00";
      }
      this.loading.dismissAll();
      this.autocompleteItems.length = 0;
      this.validationImageCity = this.tickMarkImage;

    });

 }

  // When the city is selected by th user
  chooseCity(item: any) {
     this.loading = this.loadingController.create({content : ""});
     this.loading.present();
     
     // get detail
     this.getLatitudeLongitude(item.description);
     
    
  }

  // Get updated result from google places according to the input 
  updateSearch() {
    this.service = new google.maps.places.AutocompleteService();

    this.validationImageCity = ""
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }
    let me = this;
    this.service.getPlacePredictions({types:  ['(cities)'], input: this.autocomplete.query }, function (predictions, status) {
      me.autocompleteItems = []; 
      me.zone.run(function () {
        predictions.forEach(function (prediction) {
          me.autocompleteItems.push(prediction);

        });
      });
    });
  }

  // When city input field has submitted
  onCitySubmitted(){
    this.validationImageCity = this.crossMarkImage; 
  }

  //Navigate to wifi page
  avanti() {

    if (this.validationImageCity == this.tickMarkImage && this.userInfo.controls.gender.value)
    {
       // Show activity indicator
        this.showLoading();
        this.getToken();
    }

    else
    {
      if (this.validationImageCity == this.tickMarkImage)
      {   
      }
      else
      {
         this.validationImageCity = this.crossMarkImage;
      }
      this.showAlert("Please provide valid data");
    }
    
  }
  updateInfo(token : string){  


        // Get response data from the server
        this.webservice.updateInfo(this.cityData, this.userInfo.controls.gender.value, token ).subscribe(data => {
            if(data.status === 200) {          
            // Navigate on wifi page
             this.hideLoading();
             this.navCtrl.push(Wifi);

             }
            
        },
        error=>{
          // Show errors message based on the error 
          if(error.status === 400) {
            this.showAlert("Invalid request");

          }
          else if(error.status === 401) {
             // Remove the token
             this.removeToken();
             // Pop to root page
             this.navCtrl.popToRoot();

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

  getToken()
  {
    if(this.Platform.is('ios')){
      this.iOSTokenRetrieval();
    }
    else{
      this.androidTokenRetrieval(); 
    }
  }

  androidTokenRetrieval(){
    // Get token
    const prefs = window['SharedPreferences'];
    let identifier = this.sharedService.getPackageIdentifierOfAppOfToken();
    prefs.getSharedPreferencesFromOtherApp('token','MODE_PRIVATE', identifier, () => {
        prefs.getString('token', (value) => {
          this.goToUpdateInfo(value);
  

        }, (error) => {
           this.hideLoading();

           // Remove the token
           this.removeToken();

           // Pop to root page
           this.navCtrl.popToRoot();

          })
        }, (error) => {
            this.hideLoading();

            // Remove the token
            this.removeToken();

           // Pop to root page
           this.navCtrl.popToRoot();

    });
  }
  iOSTokenRetrieval(){
     this.keychain.get('token')
    .then(value => {
      if(value){
        this.goToUpdateInfo(value);
      }
      else{
        this.hideLoading();

        // Remove the token
        this.removeToken();
        
        // Pop to root page
        this.navCtrl.popToRoot(); 
      }
      

    })
    .catch(err => {
      this.hideLoading();

      // Remove the token
      this.removeToken();

      // Pop to root page
      this.navCtrl.popToRoot();

    });
  
  }
  goToUpdateInfo(token : string)
  {
    if(token) {
      this.updateInfo(token);
             
    }
    else{
      this.hideLoading();
    }
  }
  removeToken(){
    if(this.Platform.is('ios')){
      this.keychain.remove('token');
    }
    else{
      this.sharedService.removeToken();
    }
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

}
