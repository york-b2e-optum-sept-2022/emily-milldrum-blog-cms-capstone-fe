import {Component} from '@angular/core';
import {AccountService} from "../_services/account.service";
import {MainService} from "../_services/main.service";
import {STATE} from "../_enums/STATE";
import {NgForm} from "@angular/forms";
import {IAccount} from "../_interfaces/IAccount";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  passwordRepeat: string = "";
  errorMessage: any;
  destroy$ = new Subject()

  constructor(private service: AccountService, private mainService: MainService) {
    this.service.$accountError.pipe(takeUntil(this.destroy$)).subscribe(
      dt => {
        this.errorMessage = dt
      }
    )
  }

  cancelRegClick() {
    this.mainService.$state.next(STATE.login)
  }

  onRegisterClick(regForm: NgForm) {
    this.passwordRepeat = regForm.value.passwordRepeat;
    this.service.registerAccount(regForm.value as IAccount, this.passwordRepeat)
  }
}
