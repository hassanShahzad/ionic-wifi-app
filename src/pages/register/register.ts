import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Webservice } from '../../providers/webservice';
import { Keyboard } from '@ionic-native/keyboard';
import { AlertController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
  providers: [Webservice, Keyboard]
})
export class Register {
  validationImagePassword : string;
  validationImageConformPassword : string;
  register : FormGroup;
  loading : any;
  tickMarkImage : string;
  crossMarkImage : string;
  loadingPresented;
  loadingTimer;

  userRegistrationData = {
    email : '',
    name: '',
    surname: '',
    birthdate: '',
    password: ''
    
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder, public webservice: Webservice, private loadingController:LoadingController, private keyboard: Keyboard, public Platform: Platform, public alertCtrl: AlertController) {
    this.register = this.fb.group({
      password: ['', Validators.compose([Validators.required,Validators.minLength(8),Validators.maxLength(32)])],
      conformPassword: ['', Validators.compose([Validators.required,Validators.minLength(8),Validators.maxLength(32)])] 

    });

    this.userRegistrationData.email = navParams.get('email');

    this.userRegistrationData.name = navParams.get('name');

    this.userRegistrationData.surname = navParams.get('surname');

    this.userRegistrationData.birthdate = navParams.get('birthdate');
    this.tickMarkImage = "./assets/tickMark.png";
    this.crossMarkImage = "./assets/crossMark.png";

   // Platform.ready().then(() => {
      // Here I'm using the keyboard class from ionic native.
    //  keyboard.disableScroll(true)
    //  statusBar.styleDefault();
   // });
   

  }

  ionViewDidLoad() {
  }

  // When passord input field is change
  onPasswordChange(){
    this.validationImagePassword = ""
  }

  // When password input field has submitted
  onPasswordSubmitted(){
    if(this.register.controls.password.valid == true) {  
    this.validationImagePassword = this.tickMarkImage;
    } 

    else {
    this.validationImagePassword = this.crossMarkImage;
    }
  }

  // When conformPassword input field is change
  onConformPasswordChange(){
    this.validationImageConformPassword = ""
  }

  // When conformPassword input field has submitted
  onConformPasswordSubmitted(){
    if(this.register.controls.conformPassword.valid == true && this.register.controls.conformPassword.value == this.register.controls.password.value) {  
    this.validationImageConformPassword = this.tickMarkImage;
    } 

    else {
    this.validationImageConformPassword = this.crossMarkImage;
    }
  }

  hideKeyboard(){

    this.keyboard.close();

  }

  registrati(){
    this.onPasswordSubmitted();
    this.onConformPasswordSubmitted();  
    if (this.validationImagePassword == this.tickMarkImage && this.validationImageConformPassword == this.tickMarkImage)
    {
        this.userRegistrationData.password = this.register.controls.password.value;

        // Show activity indicator
        this.showLoading();

        // Get response data from the server
        this.webservice.sendSignUpDataToServer(this.userRegistrationData).subscribe(data => {
         
          this.hideLoading();
          // On successful registeration show alert and navigate back to home page
          if(data.status === 200) {
            this.navCtrl.popToRoot();
            this.showAlert("User signed up successfully");

          }
        
        },
        error=>{
          // Show errors message based on the error 
          if(error.status === 400) {
            this.showAlert("Invalid request");

          }
          else if(error.status === 401) {
            this.showAlert("User already exists");

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
