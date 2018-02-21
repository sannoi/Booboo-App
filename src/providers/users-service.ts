import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { Headers } from '@angular/http';
import { RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { LocationServiceProvider } from './location-service';
import {ConfigServiceProvider} from './config-service/config-service';

@Injectable()
export class UsersService {

  constructor(
    private authHttp: AuthHttp,
    public locationService: LocationServiceProvider,
    private configService: ConfigServiceProvider) { }

  getAll() {
    var _def = 'q=&orden=nombre&ordenDir=ASC&page=1&resultados=500&lat=&lon=';
    return this.authHttp.get(this.configService.apiUrl() + this.configService.cfg.user.list + '/?' + _def)
      .toPromise()
      .then(rs => {
        console.log(rs, rs.json().resultados);
        return rs.json().resultados;
      });
  }

  getDrivers() {
    var _def = 'q=&orden=nombre&ordenDir=ASC&page=1&resultados=500&lat=&lon=&categoria=7';
    return this.authHttp.get(this.configService.apiUrl() + this.configService.cfg.user.list + '/?' + _def)
      .toPromise()
      .then(rs => {
        console.log(rs, rs.json().resultados);
        return rs.json().resultados;
      });
  }

  getAllByOwner() {
    var _def = 'q=&orden=nombre&ordenDir=ASC&page=1&resultados=500&lat=&lon=&solo_usuario_actual=1&incluir_padre=1';
    return this.authHttp.get(this.configService.apiUrl() + this.configService.cfg.user.list + '/?' + _def)
      .toPromise()
      .then(rs => {
        console.log(rs, rs.json().resultados);
        return rs.json().resultados;
      });
  }

  getOne(id: any) {
    var infoUrl = this.configService.cfg.user.info;
    var parsedUrl = infoUrl.replace('##ID##', id);
    return this.authHttp.get(this.configService.apiUrl() + parsedUrl)
      .toPromise()
      .then(rs => {
        return rs.json();
      });
  }

  saveGeolocation() {
    let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
    });
    let options = new RequestOptions({
      headers: headers
    });
    let data = { latitud: this.locationService.position.latitude, longitud: this.locationService.position.longitude };

    return this.authHttp.post(this.configService.apiUrl() + this.configService.cfg.user.geolocation, this.serializeObj(data), options)
      .toPromise()
      .then(rs => {
        return rs.json();
      });
  }

  saveFirebaseDeviceToken(token: string) {
    let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
    });
    let options = new RequestOptions({
      headers: headers
    });
    let data = { fb_token: token };

    return this.authHttp.post(this.configService.apiUrl() + this.configService.cfg.user.save_firebase_token, this.serializeObj(data), options)
      .toPromise()
      .then(rs => {
        return rs.json();
      });
  }

  clearFirebaseDeviceToken() {
    return this.authHttp.get(this.configService.apiUrl() + this.configService.cfg.user.clear_firebase_token)
      .toPromise()
      .then(rs => {
        console.log(rs, rs.json());
        return rs.json();
      });
  }

  public serializeObj(obj) {
    var result = [];

    for (var property in obj)
      result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

    return result.join("&");
  }

}
