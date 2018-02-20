import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import *  as AppConfig from '../../app/config';

@Injectable()
export class ConfigServiceProvider {
  public cfg: any;
  public remoteCfg: any;

  public currentSite: any;

  constructor(
    private storage: Storage,
    private http: Http,
    private authHttp: AuthHttp) {
    this.cfg = AppConfig.cfg;

  }

  loadConfig() {
    return this.http.get(this.apiUrl() + this.cfg.configUrl)
      .toPromise()
      .then(data => {
        this.remoteCfg = data.json().data;
        this.storage.set("config", data.json().data);
      })
      .catch(e => console.log("reg error", e));
  }

  public initialize() {
    return this.storage.get("site_id").then(site_idx => {
      let idx = site_idx;
      if (!idx) {
        idx = 0;
        this.storage.set("site_id", idx);
      }
      this.currentSite = this.cfg.sites[idx];
      if (this.currentSite) {
        return this.storage.get("config").then(config => {
          this.remoteCfg = config;
          if (!this.remoteCfg) {
            this.loadConfig();
          }
          return true;
        });
      } else {
        return false;
      }
    });
  }

  public changeSite(site: any) {
    let idx_selected = this.cfg.sites.findIndex(function(x){
      return x.name == site.name;
    });

    console.log(idx_selected);

    return this.storage.get("site_id").then(site_idx => {
      let idx = site_idx;
      if (idx_selected != -1 && idx != idx_selected){
        idx = idx_selected;
        this.storage.set("site_id", idx);
      } else {
        return false;
      }
      this.currentSite = this.cfg.sites[idx];
      if (this.currentSite) {
        return this.storage.get("config").then(config => {
          /*this.remoteCfg = config;
          if (!this.remoteCfg) {*/
            this.loadConfig();
          //}
          return true;
        });
      } else {
        return false;
      }
    });
  }

  public baseUrl() {
    return this.currentSite.baseUrl;
  }

  public apiUrl() {
    return this.currentSite.apiUrl;
  }

}