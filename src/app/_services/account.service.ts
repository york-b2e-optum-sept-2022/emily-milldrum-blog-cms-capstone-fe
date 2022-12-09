import { Injectable } from '@angular/core';
import {IAccount} from "../_interfaces/IAccount";
import {IChat, IChatNew} from "../_interfaces/IChat";
import {BehaviorSubject, first, Subject} from "rxjs";
import {HttpService} from "./http.service";
import {ERROR} from "../_enums/ERROR";
import {MainService} from "./main.service";
import {STATE} from "../_enums/STATE";
import {IMessage} from "../_interfaces/IMessage";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  //used for populating search for posts by user & pm list
  private accountList: IAccount[] = [];
  $accountList: Subject<IAccount[]> = new Subject<IAccount[]>();

  $loggedInAccount = new BehaviorSubject<IAccount | null>(null); // account that is logged in
  $viewAccount = new BehaviorSubject<IAccount | null>(null); // for individual profile page

  $accountError = new BehaviorSubject<string | null>(null) //selected account errors
  $accountListError  = new BehaviorSubject<string | null>(null); //account list error

  $selectedChat = new BehaviorSubject<IAccount | null>(null); // for chat system
  $messageList = new BehaviorSubject<IMessage[]>([]);

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

  onSearchTextChange(text: string) {
    this.$accountList.next(
      this.accountList.filter(acct => acct.fName.toUpperCase().includes(text.toUpperCase()))
    )
  }

  findChat(account: IAccount, loggedInAccount: IAccount) {

    //if chat between accounts exists, go to
    //else if chat between accounts does not exist, create
    let newChat: IChatNew = {accountList: [], messageList: []}
    if(account.id !== undefined && loggedInAccount.id !== undefined){
      newChat.accountList.push(account.id)
      newChat.accountList.push(loggedInAccount.id)
    }
    console.log(newChat)
   // this.httpService.createChat(newChat).pipe(first()).subscribe({
    this.httpService.getChat(newChat).pipe(first()).subscribe({
      next: (chat) => {
          console.log(chat)
        //set this $selectedChat to this chat
        this.main.$state.next(STATE.chat)
      },
      error: () => {
        this.$accountError.next(ERROR.REGISTER_HTTP_ERROR_MESSAGE);
      }
    });
  }


  sendMessage(message: string, sender: IAccount | null, receiver: IAccount | null): boolean {
    if(sender == null || receiver == null){
      //TODO ERROR
      return false;
    }
    let newMessage: IMessage = {message: message, receiver: receiver, sender: sender};
    this.httpService.sendMsg(newMessage).pipe(first()).subscribe({
      next: (message) => {
        let newList: IMessage[] = [...this.$messageList.getValue()]
        newList.push(message)
        this.$messageList.next(newList)
      },
      error: () => {
        //TODO
        this.$accountError.next(ERROR.REGISTER_HTTP_ERROR_MESSAGE);
        return false;
      }
    });
    return true;
  }


  getMsg(sender: IAccount | null, receiver: IAccount | null) {
    if(sender == null || receiver == null || sender.id == undefined || receiver.id == undefined){
      //TODO ERROR
      return;
    }
    // let request: IMessage = {receiver: receiver, sender: sender};
    this.httpService.getMsg(sender.id, receiver.id).pipe(first()).subscribe({
      next: (message) => {
        console.log(message)
        //reset errors TODO
        this.$messageList.next(message);
      },
      error: () => {
        //TODO
        this.$accountError.next(ERROR.REGISTER_HTTP_ERROR_MESSAGE);
      }
    });
  }
}
