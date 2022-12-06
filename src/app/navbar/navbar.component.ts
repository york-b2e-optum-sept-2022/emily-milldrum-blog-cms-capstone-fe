import {Component} from '@angular/core';
import {STATE} from "../_enums/STATE";
import {MainService} from "../_services/main.service";
import {AccountService} from "../_services/account.service";
import {Subject, takeUntil} from "rxjs";
import {IAccount} from "../_interfaces/IAccount";
import {PostService} from "../_services/post.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {


  destroy$ = new Subject();
  errMsg: string | null = null;
  account: IAccount | null = null;


  constructor(private main: MainService, private accountService: AccountService,
              private postService: PostService) {
    this.accountService.$loggedInAccount.pipe(takeUntil(this.destroy$)).subscribe(
      dt => {this.account = dt
      }
    )
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  home() {
    this.main.$state.next(STATE.postList)
    this.postService.$selectedPost.next(null);
  }

  logout() {
    this.main.$state.next(STATE.login)
    this.accountService.$loggedInAccount.next(null)
    this.postService.$selectedPost.next(null);
  }

  post() {
    this.main.$state.next(STATE.postInput)
    this.postService.$selectedPost.next(null);
  }
}
