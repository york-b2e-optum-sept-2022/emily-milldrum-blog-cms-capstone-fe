import { Component } from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {AccountService} from "../_services/account.service";
import {IAccount} from "../_interfaces/IAccount";

@Component({
  selector: 'app-pm-list',
  templateUrl: './pm-list.component.html',
  styleUrls: ['./pm-list.component.css']
})
export class PmListComponent {

  accountList: IAccount[] = [];
  errorMessage: string | null = null;
  destroy$ = new Subject();
  searchText: string = "";

  constructor(private accountService: AccountService) {
    this.accountService.$accountList.pipe(takeUntil(this.destroy$)).subscribe(
      ls => {this.accountList = ls
        console.log(this.accountList)
      }
    )
    this.accountService.$accountListError.pipe(takeUntil(this.destroy$)).subscribe(
      dt => {this.errorMessage = dt
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

  privateMsg() {

  }

  viewProfile() {

  }
}
