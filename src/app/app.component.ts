import { Component, ViewChild } from '@angular/core';
import { Platform, LoadingController} from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { SharedService } from '../providers/shared-service';
import { Keychain } from '@ionic-native/keychain';

@Component({
  templateUrl: 'app.html',
  providers: [],
  template: '<ion-nav #Nav [root]="rootPage"></ion-nav>',

})
export class MyApp {
  @ViewChild('Nav') nav; 
  rootPage:any = HomePage;
  loading : any;
  loadingPresented;
  loadingTimer;
 


  constructor(public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private shareService: SharedService, private loadingController:LoadingController, private keychain: Keychain) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.removeNativeToken();

    });
    
    
  }

  

  removeNativeToken(){
      if(this.platform.is('ios')){
         this.removeNativeTokenIOS();

      }
      else{
         this.removeNativeTokenAndroid();
      }
  }

  removeNativeTokenIOS(){
       this.keychain.get('token')
          .then(value => {
               if(value){
                  this.keychain.remove('token');
                  // Pop to root page
                  //this.nav.popToRoot();
               }
          })
          .catch(err => {

          });
  }

  removeNativeTokenAndroid(){
       // Get token
    const prefs = window['SharedPreferences'];
    prefs.sharedPreferencesWithOtherApp('token','MODE_PRIVATE', () => {
        prefs.getString('token', (value) => {
          if(value){
                  this.shareService.removeToken();
               }
  

        }, (error) => {
           // handle error
           this.hideLoading();

          })
        }, (error) => {
            // handle error
            this.hideLoading();

    });
  }

  showLoading(){
    this.loading = this.loadingController.create({content : ""});
    this.loadingPresented = false;
    this.loadingTimer = setTimeout(() => {
       this.loading.present();
       this.loadingPresented = true;
    }, 2000);
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

