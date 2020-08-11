import { Component } from '@angular/core';

import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { DatePicker } from '@ionic-native/date-picker';
import { Register } from '../register/register';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Keyboard } from '@ionic-native/keyboard';
import { AlertController } from 'ionic-angular';


@IonicPage()

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  providers: [ DatePicker, Keyboard ]
})
export class Signup {
  
  validationImageEmail : string;
  validationImageName : string;
  validationImageSurName : string;
  validationImageBirthDate : string;
  tickMarkImage : string;
  crossMarkImage : string;
  dateOfBirth : any;
  signup : FormGroup;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private datePicker: DatePicker, private fb: FormBuilder, public Platform: Platform, private keyboard: Keyboard, public alertCtrl: AlertController) {
    this.signup = this.fb.group({
      email: ['', Validators.compose([Validators.required,Validators.pattern
        ('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{1,}')])],
      name: ['', Validators.compose([Validators.required,Validators.pattern
        ('[a-zA-Z][a-zA-Z ]+$'),Validators.minLength(3),Validators.maxLength(50)])],
      surname: ['', Validators.compose([Validators.required,Validators.pattern
        ('[a-zA-Z][a-zA-Z ]+$'),Validators.minLength(3),Validators.maxLength(50)])], 
      birthdate : ['', Validators.required,] 

   });
   this.tickMarkImage = "./assets/tickMark.png";
   this.crossMarkImage = "./assets/crossMark.png";

   
  
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad Signup');
  }

 //Show datepicker and date selection
 showDate(){
    var nowInMS = new Date().getTime(),//get the current time and convert to milliseconds
    eighteenYearsInMS = 1000 * 60 * 60 * 24 * 365.242189 * 18,//calculate the amount of milliseconds in eighteen years
    eighteenYearsBeforeNow = new Date(nowInMS - eighteenYearsInMS);//build a new date after subtracting

    let maximumDate = this.Platform.is('ios') ? eighteenYearsBeforeNow  : (eighteenYearsBeforeNow ).valueOf(); 
    let birthdateString = this.signup.controls.birthdate.value;
    let birthdate = new Date(birthdateString).getTime();

    if(birthdate<=maximumDate)
    {
        //this.dateOfBirth = birthdate/1000;
        this.validationImageBirthDate = this.tickMarkImage;
    }
    else
    {
        this.validationImageBirthDate = this.crossMarkImage;
    }

  //  let options = {
  //    date: new Date(),
  //    mode: 'date',
  //    allowOldDates: true,
  //    allowFutureDates: false,
  //    maxDate: maximumDate,
  //    androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
  //  }

  //  this.datePicker.show(options).then(
  //    date => {
  //      if(date<=maximumDate)
  //      {
  //        this.dateOfBirth = date.getTime()/1000;
  //        this.validationImageBirthDate = this.tickMarkImage;
  //      }
  //      else
  //      {
  //        this.validationImageBirthDate = this.crossMarkImage;
  //      }
        
  //    },
  //    error => {
  //      //alert('Error: ' + error);
  //      this.validationImageBirthDate = this.crossMarkImage;

  //    }
  //  );
 
 }

  // When email input field is change
  onEmailChange(){
    this.validationImageEmail = ""
  }

  // When email input field has submitted
  onEmailSubmitted(){
    if(this.signup.controls.email.valid == true) {  
    this.validationImageEmail = this.tickMarkImage;
    } 

    else {
    this.validationImageEmail = this.crossMarkImage;
    }
  }

  // When name input field is change
  onNameChange(){
    this.validationImageName = ""
  }

  // When name input field has submitted
  onNameSubmitted(){
    if(this.signup.controls.name.valid == true) {  
    this.validationImageName = this.tickMarkImage;
    } 

    else {
    this.validationImageName = this.crossMarkImage;
    }
  }

  // When surname input field is change
  onSurNameChange(){
    this.validationImageSurName = ""
  }

  // When name input field has submitted
  onSurNameSubmitted(){
    if(this.signup.controls.surname.valid == true) {  
    this.validationImageSurName = this.tickMarkImage;
    } 

    else {
    this.validationImageSurName = this.crossMarkImage;
    }
  }
  
  hideKeyboard(){

    this.keyboard.close();

  }
 
  //Navigate to registeration page
  avanti() {
  
    this.onEmailSubmitted();
    this.onNameSubmitted();
    this.onSurNameSubmitted();
    if (this.validationImageEmail == this.tickMarkImage && this.validationImageName == this.tickMarkImage && this.validationImageSurName == this.tickMarkImage && this.validationImageBirthDate == this.tickMarkImage)
    {
      let email = this.signup.controls.email.value;
      let name = this.signup.controls.name.value;
      let surname = this.signup.controls.surname.value;
      let birthdateString = this.signup.controls.birthdate.value;
      let birthdate = new Date(birthdateString).getTime()/1000;
      this.navCtrl.push(Register, {email, name, surname, birthdate});
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


}
