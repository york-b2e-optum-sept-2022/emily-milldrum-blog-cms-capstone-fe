import {Component, ViewChild} from '@angular/core';
import {STATE} from "../_enums/STATE";
import {MainService} from "../_services/main.service";
import {AccountService} from "../_services/account.service";
import {Subject, takeUntil} from "rxjs";
import {IAccount} from "../_interfaces/IAccount";
import {PostService} from "../_services/post.service";
import {MatMenuTrigger} from "@angular/material/menu";
import {MatDialog} from "@angular/material/dialog";
import {PostInputComponent} from "../post-input/post-input.component";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {


  destroy$ = new Subject();
  errMsg: string | null = null;
  account: IAccount | null = null;
  searchText = "";
  // @ts-ignore
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;



  constructor(private main: MainService, private accountService: AccountService,
              private postService: PostService, public dialog: MatDialog) {
    this.accountService.$loggedInAccount.pipe(takeUntil(this.destroy$)).subscribe(
      dt => {this.account = dt
      }
    )
  }

  openDialog() {
    this.postService.$selectedPost.next(null)
    this.dialog.open(PostInputComponent);
  }


  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  onSearchTextChange(text: string){
    this.postService.onSearchTextChange(text);
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

  pm() {
    this.main.$state.next(STATE.chatList);
    this.postService.$selectedPost.next(null);
  }

  profile() {
    this.main.$state.next(STATE.profile)
    this.accountService.$viewAccount.next(this.account)
  }

  chat() {
    this.main.$state.next(STATE.chatList)
  }
}
export class DialogFromMenuExampleDialog {}
