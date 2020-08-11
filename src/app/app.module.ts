import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { Webservice } from '../providers/webservice';
import { SharedService } from '../providers/shared-service';
import { Keychain } from '@ionic-native/keychain';



import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Signup } from '../pages/signup/signup';
import { Register } from '../pages/register/register';
import { Login } from '../pages/login/login';
import { Autocomplete } from '../pages/autocomplete/autocomplete';
import { Wifi } from '../pages/wifi/wifi';
import { TrainInfo } from '../pages/train-info/train-info';
import { TravelInfo } from '../pages/travel-info/travel-info';





@NgModule({
  declarations: [
    MyApp,
    HomePage,
    Signup,
    Register,
    Login,
    Autocomplete,
    Wifi,
    TrainInfo,
    TravelInfo
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{
    'backButtonText':'',
    'backButtonIcon':'arrow-back',
    'iconMode': 'ios' 

}),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    Signup,
    Register,
    Login,
    Autocomplete,
    Wifi,
    TrainInfo,
    TravelInfo
    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Webservice,
    SharedService,
    Keychain
  ]
})
export class AppModule {}
