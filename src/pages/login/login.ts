import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform } from 'ionic-angular';
import { Autocomplete } from '../autocomplete/autocomplete';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Webservice } from '../../providers/webservice';
import {SharedService} from '../../providers/shared-service';
import { Wifi } from '../wifi/wifi';
import { AppPreferences } from '@ionic-native/app-preferences';
import { Keychain } from '@ionic-native/keychain';
import { Keyboard } from '@ionic-native/keyboard';
import { AlertController } from 'ionic-angular';




@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [Webservice,AppPreferences, Keyboard]
})
export class Login {
  validationImageEmail : string;
  validationImagePassword : string;
  tickMarkImage : string;
  crossMarkImage : string;
  login : FormGroup;
  loading : any;
  loadingPresented;
  loadingTimer;

  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder,private webservice: Webservice, private sharedService: SharedService, private loadingController:LoadingController, private appPreferences: AppPreferences, public Platform: Platform, private keychain: Keychain, private keyboard: Keyboard, public alertCtrl: AlertController) {
    this.login = this.fb.group({
      email: ['', Validators.compose([Validators.required,Validators.pattern
        ('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{1,}')])],
      password: ['', Validators.compose([Validators.required,Validators.minLength(8),Validators.maxLength(32)])]

    });
    this.tickMarkImage = "./assets/tickMark.png";
    this.crossMarkImage = "./assets/crossMark.png";

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Login');
  }

  // When email input field is change
  onEmailChange(){
    this.validationImageEmail = ""
  }

  // When email input field has submitted
  onEmailSubmitted(){
    if(this.login.controls.email.valid == true) {
    this.validationImageEmail = this.tickMarkImage;

    }

    else {
    this.validationImageEmail = this.crossMarkImage;

    }
  }

  // When passord input field is change
  onPasswordChange(){
    this.validationImagePassword = ""
  }

  // When password input field has submitted
  onPasswordSubmitted(){
    if(this.login.controls.password.valid == true) {
    this.validationImagePassword = this.tickMarkImage;
    }

    else {
    this.validationImagePassword = this.crossMarkImage;
    }
  }

  hideKeyboard(){

    this.keyboard.close();

  }

  //Navigate to autocomplete page
  avanti() {
    this.onEmailSubmitted();
    this.onPasswordSubmitted();
    if (this.validationImagePassword == this.tickMarkImage && this.validationImageEmail == this.tickMarkImage)
    {
        // Show activity indicator
        this.showLoading();

        // Get response data from the server
        this.webservice.sendLoginDataToServer(this.login.controls.email.value, this.login.controls.password.value).subscribe(data => {
             this.hideLoading();
             let result = data;
             this.getToken(result);


        },
        error=>{
          // Show errors message based on the error
          if(error.status === 400) {
            this.showAlert("Invalid request");

          }
          else if(error.status === 401) {
            this.showAlert("Invalid user name or password");

          }
          else if(error.status === 403) {
            this.showAlert("Permission denied");

          }
          else {
            this.showAlert("You can not connect with network outside the train");

          }

          this.hideLoading();

        });

    }

    else
    {
      this.showAlert("Please provide valid data");
    }

  }

  showAlert(msg : string) {
    let alert = this.alertCtrl.create({
      title: '',
      subTitle: msg,
      buttons: ['OK']
   });
    alert.present();
  }

  getToken(result:any)
  {
    if(this.Platform.is('ios')){
      this.iOSTokenRetrieval(result);
    }
    else{
      this.androidTokenRetrieval(result);
    }
  }



  androidTokenRetrieval(result:any){
    let token = result.token;
    const prefs = window['SharedPreferences'];
    let identifier = this.sharedService.getPackageIdentifierOfAppOfToken();
    prefs.getSharedPreferencesFromOtherApp('token','MODE_PRIVATE', identifier, () => {
        prefs.putString('token', token)
        this.goToWifiPage(result);

      }, (error) => {
        // handle error
        this.hideLoading();

      });

  }
  iOSTokenRetrieval(result:any){
     let token = result.token;

     this.keychain.set('token', token, false).then(() => {
     //this.saveTokenInNativeStorage(token);
     this.goToWifiPage(result);

    })
    .catch(err => {
      this.hideLoading();

    });

  }
  // saveTokenInNativeStorage(token:string){

   // this.nativeStorage.setItem('token',token)
   // .then(

   // error => console.error('Error storing item', error)
   // );
  //}
  goToWifiPage(result:any)
  {
    // On successful login
    let firstLogin =  result.first_login;

    // Check if the user is login for the first time
    if(firstLogin === true) {
      this.navCtrl.push(Autocomplete);
    }
    else{
      this.navCtrl.push(Wifi);

    }

    //if(this.Platform.is('android')){
      // remove login page from navgation stack
      //this.navCtrl.remove(1);
    //}

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
