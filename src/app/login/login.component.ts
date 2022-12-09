import {Component, OnDestroy, OnInit} from '@angular/core';
import {AccountService} from "../_services/account.service";
import {MainService} from "../_services/main.service";
import {STATE} from "../_enums/STATE";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy {

  email: string = "";
  password: string = "";
  errorMessage: string | null = null;
  isLogin: boolean = true;
  destroy$ = new Subject()

  constructor(private service: AccountService, private mainService: MainService) {
    this.service.$accountError.pipe(takeUntil(this.destroy$)).subscribe(
      dt => {this.errorMessage = dt
      }
    )
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  loginClick() {
    this.service.login(this.email, this.password)
  }

  registerClick() {
    this.mainService.$state.next(STATE.register)
  }

}
