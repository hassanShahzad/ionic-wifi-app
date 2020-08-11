import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class Webservice {
  serviceUrl: string;
  routerUrl: string;

  constructor(public http: Http) {
    //console.log('Hello Webservice Provider');
    this.serviceUrl = "http://test.k4tech.com/";
    this.routerUrl = "http://192.168.16.1/";
  }


  // Login mechanism
  sendLoginDataToServer(email: String, password: String){

      let bodyString = JSON.stringify({
        email: email,
        password: password
      });

      // Set content type to JSON
      let headers  = new Headers({ 'Content-Type': 'application/json' });

      // Create a request option
      let options = new RequestOptions({ headers: headers });

      return this.http.post(this.routerUrl+'signin',bodyString, options
      )
      .map( (data) => {
        return data.json();//if response content type is json
        },
        (error) => {
        throw error
        }
      )

  }


  // Mechanism for send user city and gender data to the server
  updateInfo(city: any, gender: String, token : String){
        let bodyString = JSON.stringify({
          city: city,
          gender: gender,
          token: token
        });

        // Set content type to JSON
        let headers  = new Headers({ 'Content-Type': 'application/json' });

        // Create a request option
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.serviceUrl+'updateinfo',bodyString, options)
        .map( (data) => {
          return data;//if response content type is json
          },
          (error) => {
          throw error
          }
        )

  }

  // Mechanism for signup
  sendSignUpDataToServer(registerationData: any){
        let bodyString = JSON.stringify(registerationData);

        // Set content type to JSON
        let headers  = new Headers({ 'Content-Type': 'application/json' });

        // Create a request option
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.serviceUrl+'signup',bodyString, options)
        .map( (data) => {
          return data;//if response content type is json
          },
          (error) => {
          throw error
          }
        )

  }

  // Mechanism for geting travel information from the server
  getTravelInfo(){
        return this.http.get(this.routerUrl+'travelStops')
        .map( (data) => {
          return data.json();//if response content type is json
          },
          (error) => {
          throw error
          }
        )

  }

  // Mechanism for geting train information from the server
  getTrainInfo(){
        return this.http.get(this.routerUrl+'travelInfo')
        .map( (data) => {
           return data.json();//if response content type is json
           },
           (error) => {
           throw error
           }
        )
  }

  // Mechanism for checking token validity
  checkTokenValidity(token){
        let bodyString = JSON.stringify({token: token});
        // Set content type to JSON
        let headers  = new Headers({ 'Content-Type': 'application/json' });

        // Create a request option
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.serviceUrl+'testtoken',bodyString, options)
        .map( (data) => {
           return data;//if response content type is json
           },
           (error) => {
           throw error
           }
        )

  }



}
