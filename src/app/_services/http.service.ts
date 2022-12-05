import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor() { }

  createAccount(newAccount: { password: string; email: string }) {
    //return IAccount;
  }
}
