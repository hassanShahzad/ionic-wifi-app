import { Injectable } from "@angular/core";
@Injectable()
export class SharedService {
  packageIdentifierOfWifiApp: string;
  packageIdentifierOfSegnalazioniApp: string;
  packageIdentifierOfAppOfToken: string;

  constructor() {
    this.packageIdentifierOfWifiApp = "com.abc.wifi";
    this.packageIdentifierOfSegnalazioniApp = "com.abc.reports";
    this.packageIdentifierOfAppOfToken = this.packageIdentifierOfWifiApp;
  }

  // remove token
  removeToken() {
    // Get token
    const prefs = window["SharedPreferences"];
    prefs.getSharedPreferencesFromOtherApp(
      "token",
      "MODE_PRIVATE",
      this.packageIdentifierOfAppOfToken,
      () => {
        prefs.remove("token");
      },
      error => {
        // handle error
        //alert(error);
      }
    );
  }

  setPackageIdentifierOfAppOfToken(identifier) {
    this.packageIdentifierOfAppOfToken = identifier;
  }

  getPackageIdentifierOfAppOfToken() {
    return this.packageIdentifierOfAppOfToken;
  }
}
