import {Component, OnDestroy, OnInit} from '@angular/core';
import {AccountService} from "../_services/account.service";
import {MainService} from "../_services/main.service";
import {STATE} from "../_enums/STATE";

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

  //sub: Subscription;
 // @Output() changeRole = new EventEmitter<string>();

  //TODO login error messages
  constructor(private service: AccountService, private mainService: MainService) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    //this.sub.unsubscribe();
  }

  loginClick() {
    //to http service
    this.service.login(this.email, this.password)

  }

  registerClick() {
    this.mainService.$state.next(STATE.register)
  }
}
