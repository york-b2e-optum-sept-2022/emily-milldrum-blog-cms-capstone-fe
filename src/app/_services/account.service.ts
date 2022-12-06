import { Injectable } from '@angular/core';
import {IAccount} from "../_interfaces/IAccount";
import {BehaviorSubject, first, Subject} from "rxjs";
import {HttpService} from "./http.service";
import {ERROR} from "../_enums/ERROR";
import {MainService} from "./main.service";
import {STATE} from "../_enums/STATE";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  //used for populating search for posts by user & pm list
  private accountList: IAccount[] = [];
  $accountList: Subject<IAccount[]> = new Subject<IAccount[]>();

  //the account that is logged in
  $loggedInAccount = new BehaviorSubject<IAccount | null>(null);

  //displays account errors
  $accountError = new BehaviorSubject<string | null>(null)

  constructor(private httpService: HttpService, private main: MainService) {
    this.getAllAccounts();
  }

  getAccountList(){
    return this.accountList;
  }

  getAllAccounts() {
    this.httpService.getAccounts().pipe(first()).subscribe({
      next: data => {
        this.accountList = data;
        this.$accountList.next(this.accountList);
        this.$accountError.next(null);
      },
      error: () => {
        this.$accountError.next(ERROR.REGISTER_HTTP_ERROR_MESSAGE);
      }
    })
  }

  loginSequence(account: IAccount){
    this.$loggedInAccount.next(account)
    console.log("in login sequence changing state")
    this.main.$state.next(STATE.postList)
    console.log(this.main.$state.getValue())
    this.$accountError.next(null);
  }

  registerAccount(regAccount: IAccount, passwordRepeat: string){

    // field validation
    if (regAccount.email.length < 5 || !regAccount.email.includes('@') || !regAccount.email.includes('.')) {
      this.$accountError.next(ERROR.REGISTER_INVALID_EMAIL_MESSAGE);
      return;
    }
    if (regAccount.fName.length < 1) {
      this.$accountError.next(ERROR.REGISTER_INVALID_FIRST_NAME_MESSAGE);
      return;
    }
    if (regAccount.lName.length < 1) {
      this.$accountError.next(ERROR.REGISTER_INVALID_LAST_NAME_MESSAGE);
      return;
    }
    if (regAccount.password.length < 4) {
      this.$accountError.next(ERROR.REGISTER_INVALID_PASSWORD_LENGTH_MESSAGE);
      return;
    }
    if (regAccount.password !== passwordRepeat) {
      this.$accountError.next(ERROR.REGISTER_INVALID_PASSWORD_MATCH);
      return;
    }

    //TODO check for existing account before reg
    this.httpService.createAccount(regAccount).pipe(first()).subscribe({
      next: (account) => {
        console.log(account)
        this.loginSequence(account)
      },
      error: () => {
        this.$accountError.next(ERROR.REGISTER_HTTP_ERROR_MESSAGE);
      }
    });
  }

  login(email: string, password: string) {
    let login = {
      email: email,
      password: password,
    }
    this.httpService.login(login).pipe(first()).subscribe({
      next: (account) => {
        if(account){
          this.loginSequence(account)
        }else{
          this.$accountError.next(ERROR.LOGIN_INVALID)
        }
      },
      error: () => {
        this.$accountError.next(ERROR.REGISTER_HTTP_ERROR_MESSAGE);
      }
    });
  }
}
