import { Component } from '@angular/core';
import {MainService} from "./_services/main.service";
import {Subject, takeUntil} from "rxjs";
import {STATE} from "./_enums/STATE";
import {IAccount} from "./_interfaces/IAccount";
import {AccountService} from "./_services/account.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Social City';
  state: STATE = STATE.login;
  destroy$ = new Subject();
  stateEnum = STATE;
  account: IAccount | null = null;

  constructor(private main: MainService, private accountService: AccountService) {
    this.main.$state.pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.state = state
      })

    this.accountService.$loggedInAccount.pipe(takeUntil(this.destroy$))
      .subscribe(account => {
        this.account = account
      })

  }
  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
