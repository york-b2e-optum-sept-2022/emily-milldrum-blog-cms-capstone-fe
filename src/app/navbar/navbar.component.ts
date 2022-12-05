import {Component} from '@angular/core';
import {STATE} from "../_enums/STATE";
import {MainService} from "../_services/main.service";
import {AccountService} from "../_services/account.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private main: MainService, private accountService: AccountService) {
  }

  home() {
    this.main.$state.next(STATE.postList)
  }

  Logout() {
    this.main.$state.next(STATE.login)
    this.accountService.$loggedInAccount.next(null)
  }
}
