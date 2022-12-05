import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IAccount, IAccountLogin} from "../_interfaces/IAccount";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient) {}

  getAccounts() {
    return this.httpClient.get('http://localhost:8080/api/account') as Observable<IAccount[]>;
  }

  getAccountById(id: number) {
    return this.httpClient.get('http://localhost:8080/api/account/' + id) as Observable<IAccount>;
  }

  createAccount(account: IAccount) {
    return this.httpClient.post('http://localhost:8080/api/account', account) as Observable<IAccount>;
  }

  login(login: IAccountLogin) {
    return this.httpClient.get(`http://localhost:8080/api/account/login?email=${login.email}&password=${login.password}`) as Observable<IAccount>;
  }
}
