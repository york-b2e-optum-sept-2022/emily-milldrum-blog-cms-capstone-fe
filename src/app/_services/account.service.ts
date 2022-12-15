import { Injectable } from '@angular/core';
import {IAccount} from "../_interfaces/IAccount";
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
  $accountListError = new BehaviorSubject<string | null>(null); //account list error

  $selectedChat = new BehaviorSubject<IAccount | null>(null); // for chat system
  $messageList = new BehaviorSubject<IMessage[]>([]);
  $messageError = new BehaviorSubject<string | null>(null); //message error

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
    this.main.$state.next(STATE.postList)
    this.$accountError.next(null);
  }

  registerAccount(regAccount: IAccount, passwordRepeat: string){

    // field validation
    if (regAccount.fName.length < 1) {
      this.$accountError.next(ERROR.REGISTER_INVALID_FIRST_NAME_MESSAGE);
      return;
    }
    if (regAccount.lName.length < 1) {
      this.$accountError.next(ERROR.REGISTER_INVALID_LAST_NAME_MESSAGE);
      return;
    }
    if (regAccount.email.length < 5 || !regAccount.email.includes('@') || !regAccount.email.includes('.')) {
      this.$accountError.next(ERROR.REGISTER_INVALID_EMAIL_MESSAGE);
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

    let value = this.accountList.find(act => act.email == regAccount.email) //check for existing account
    if (value){
      this.$accountError.next(ERROR.REGISTER_INVALID_EMAIL_UNIQUE_MESSAGE);
      return;
    }

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
        //TODO send different errors from backend?
        this.$accountError.next(ERROR.LOGIN_INVALID);
      }
    });
  }

  onSearchTextChange(text: string) {
    this.$accountList.next(
      this.accountList.filter(acct => acct.fName.toUpperCase().includes(text.toUpperCase()))
    )
  }

  // findChat(account: IAccount, loggedInAccount: IAccount) {
  //
  //   //if chat between accounts exists, go to
  //   //else if chat between accounts does not exist, create
  //   let newChat: IChatNew = {accountList: [], messageList: []}
  //   if(account.id !== undefined && loggedInAccount.id !== undefined){
  //     newChat.accountList.push(account.id)
  //     newChat.accountList.push(loggedInAccount.id)
  //   }
  //   console.log(newChat)
  //  // this.httpService.createChat(newChat).pipe(first()).subscribe({
  //   this.httpService.getChat(newChat).pipe(first()).subscribe({
  //     next: (chat) => {
  //         console.log(chat)
  //       //set this $selectedChat to this chat
  //       this.main.$state.next(STATE.chat)
  //     },
  //     error: () => {
  //       this.$accountError.next(ERROR.REGISTER_HTTP_ERROR_MESSAGE);
  //     }
  //   });
  // }


  sendMessage(message: string, sender: IAccount | null, receiver: IAccount | null): boolean {
    if(sender == null || receiver == null){
      this.$messageError.next(ERROR.MESSAGE_NULL);
      return false;
    }
    let newMessage: IMessage = {message: message, receiver: receiver, sender: sender};
    this.httpService.sendMsg(newMessage).pipe(first()).subscribe({
      next: (message) => {
        let newList: IMessage[] = [...this.$messageList.getValue()]
        newList.push(message)

        // @ts-ignore
        newList.sort((b,a) =>  new Date(b.createDate) - new Date(a.createDate))
        this.$messageList.next(newList)
        this.$messageError.next(null)
      },
      error: () => {
        this.$messageError.next(ERROR.HTTP_ERROR)
        return false;
      }
    });
    return true;
  }


  getMsg(sender: IAccount | null, receiver: IAccount | null) {
    if(sender == null || receiver == null || sender.id == undefined || receiver.id == undefined){
      this.$messageError.next(ERROR.MESSAGE_NULL);
      return;
    }
    // let request: IMessage = {receiver: receiver, sender: sender};
    this.httpService.getMsg(sender.id, receiver.id).pipe(first()).subscribe({
      next: (message) => {
        this.$messageError.next(null);
        // @ts-ignore
        message.sort((b,a) =>  new Date(b.createDate) - new Date(a.createDate))
        this.$messageList.next(message);

      },
      error: () => {
        this.$messageError.next(ERROR.HTTP_ERROR);
      }
    });
  }

  updateAccount(account: IAccount | null): boolean {
    //validate fname,lname,imgurl
    if(account == null){
      this.$accountError.next(ERROR.ACCOUNT_NULL)
      return false;
    }

    this.httpService.updateAccount(account).pipe(first()).subscribe({
      next: (act) => {
        this.$accountError.next(null);
        this.$loggedInAccount.next(act);
        this.getAllAccounts()
      },
      error: () => {
        this.$accountError.next(ERROR.HTTP_ERROR);
        return false;
      }
    });
    return true;
  }
}
