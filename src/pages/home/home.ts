import { Component } from '@angular/core';
import { NavController, Platform, LoadingController } from 'ionic-angular';
import { Signup } from '../signup/signup';
import { Login } from '../login/login';
import { Wifi } from '../wifi/wifi';
import { AppPreferences } from '@ionic-native/app-preferences';
import { Keychain } from '@ionic-native/keychain';
import {SharedService} from '../../providers/shared-service';
import { Webservice } from '../../providers/webservice';


declare var SharedPreferences:any;


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [AppPreferences]
})
export class HomePage {
  getTokenAttempt : string;
  loading : any;
  loadingPresented;
  loadingTimer;

  constructor(public navCtrl: NavController, private appPreferences: AppPreferences, public Platform: Platform, private keychain: Keychain, private sharedService: SharedService, private loadingController:LoadingController, private webservice: Webservice ) {
    this.getTokenAttempt = 'first';

  }

  
  
  //Navigate to signup page
  signUp() {
    this.navCtrl.push(Signup);

  }

  //Navigate to login page
  login() {
    if(this.Platform.is('ios')){
      this.loginIOS()
    }
    else{
      this.loginAndroid() 
    }
    
  }

  loginAndroid(){
     // Get token
    const prefs = window['SharedPreferences'];
    let identifier = this.sharedService.getPackageIdentifierOfAppOfToken();
    prefs.getSharedPreferencesFromOtherApp('token','MODE_PRIVATE',identifier, () => {
        prefs.getString('token', (value) => {
          let token =  value;
          if(token) {
          //self.alert(token);
          //this.navCtrl.push(Wifi);
            this.goTocheckTokenValidity(token);

          }
          else{
            if(this.getTokenAttempt == 'first') {  
             this.getTokenAttempt = 'second';
             this.sharedService.setPackageIdentifierOfAppOfToken(this.sharedService.packageIdentifierOfSegnalazioniApp);
             this.loginAndroid()
            }
            else{
              this.sharedService.setPackageIdentifierOfAppOfToken(this.sharedService.packageIdentifierOfWifiApp);
              this.navCtrl.push(Login);
            }
          }

        }, (error) => {
           // handle error
            //alert(error);
          if(this.getTokenAttempt == 'first') {  
             this.getTokenAttempt = 'second';
             this.sharedService.setPackageIdentifierOfAppOfToken(this.sharedService.packageIdentifierOfSegnalazioniApp);
             this.loginAndroid()
           }
           else{
              //this.showAlert(prefs.packageIdentifierOfAppOfToken);
              this.sharedService.setPackageIdentifierOfAppOfToken(this.sharedService.packageIdentifierOfWifiApp);
              this.navCtrl.push(Login);
           }
            
          })
        }, (error) => {
            // handle error
            if(this.getTokenAttempt == 'first') {  
             this.getTokenAttempt = 'second';
             this.sharedService.setPackageIdentifierOfAppOfToken(this.sharedService.packageIdentifierOfSegnalazioniApp);
             this.loginAndroid()
           }
           else{
              //this.showAlert(prefs.packageIdentifierOfAppOfToken);
              this.sharedService.setPackageIdentifierOfAppOfToken(this.sharedService.packageIdentifierOfWifiApp);
              this.navCtrl.push(Login);
           }

    });
    
    
  }

  loginIOS(){
  
    this.keychain.get('token')
    .then(value => {
     let token =  value;
          if(token) {
            this.goTocheckTokenValidity(token);

            //this.navCtrl.push(Wifi);
          }
          else{
            this.navCtrl.push(Login);
          }

    })
    .catch(err => {
    this.navCtrl.push(Login);
    });


  }
  
  // CheckToken
  checkTokenValidity(token: string){
  // Show activity indicator
    this.showLoading();

  // Get response data from the server
    this.webservice.checkTokenValidity(token).subscribe(data => {
        this.hideLoading();
        this.navCtrl.push(Wifi);
      
    },
    error=>{ 
        // Remove the token
        this.removeToken();
        
        // hide the loading 
        this.hideLoading();
        });
  }
  

  
  goTocheckTokenValidity(token : string)
  {
    if(token){
      this.checkTokenValidity(token); 
    }
    else{
    this.hideLoading();
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

  removeToken(){
    if(this.Platform.is('ios')){
      this.keychain.remove('token');
    }
    else{
      this.sharedService.removeToken();
    }
  }

  

}
