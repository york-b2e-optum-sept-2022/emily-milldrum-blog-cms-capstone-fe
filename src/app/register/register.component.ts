import { Component } from '@angular/core';
import {AccountService} from "../_services/account.service";
import {MainService} from "../_services/main.service";
import {STATE} from "../_enums/STATE";
import {NgForm} from "@angular/forms";
import {IAccount} from "../_interfaces/IAccount";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  errorMessage: any;
  //TODO register error messages
  constructor(private service: AccountService, private mainService: MainService) {
  }
  cancelRegClick() {
    this.mainService.$state.next(STATE.login)
  }

  onRegisterClick(regForm: NgForm) {
   this.service.registerAccount(regForm.value as IAccount)
  }
}