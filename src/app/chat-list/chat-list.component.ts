import { Component } from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {AccountService} from "../_services/account.service";
import {IAccount} from "../_interfaces/IAccount";
import {MainService} from "../_services/main.service";
import {STATE} from "../_enums/STATE";

@Component({
  selector: 'app-pm-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent {

  accountList: IAccount[] = [];
  errorMessage: string | null = null;
  destroy$ = new Subject();
  searchText: string = "";
  loggedInAccount: IAccount | null = null;

  constructor(private accountService: AccountService, private main: MainService) {
    this.accountService.$accountList.pipe(takeUntil(this.destroy$)).subscribe(
      ls => {this.accountList = ls
        console.log(this.accountList)
      }
    )
    this.accountService.$accountListError.pipe(takeUntil(this.destroy$)).subscribe(
      dt => {this.errorMessage = dt
      }
    )

    this.accountService.$loggedInAccount.pipe(takeUntil(this.destroy$)).subscribe(
      dt => {
          this.loggedInAccount = dt
      }
    )
  }


  ngOnInit(): void {
    this.accountService.getAllAccounts();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  onSearchTextChange(text: string){
    this.accountService.onSearchTextChange(text);
    console.log(text)
  }

  privateMsg(account: IAccount) {
    this.main.$state.next(STATE.chat)
    this.accountService.$selectedChat.next(account);
    this.accountService.getMsg(this.loggedInAccount, account);

    console.log(account)
    // if(account !== null && this.loggedInAccount !== null)
    // {
    //   this.accountService.findChat(account, this.loggedInAccount)
    // }
  }

  viewProfile(account: IAccount) {
    console.log(account)
    this.accountService.$viewAccount.next(account)
    this.main.$state.next(STATE.profile)
  }
}
