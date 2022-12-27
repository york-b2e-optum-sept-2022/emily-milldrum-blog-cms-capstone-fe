import { Component } from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {IPost} from "../_interfaces/IPost";
import {IAccount} from "../_interfaces/IAccount";
import {PostService} from "../_services/post.service";
import {MainService} from "../_services/main.service";
import {AccountService} from "../_services/account.service";
import {ERROR} from "../_enums/ERROR";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  destroy$ = new Subject();

  acctErrorMessage: string | null = null;
  errorMessage: string | null = null;
  postList: IPost[] = [];
  account: IAccount | null = null;
  loggedIn: IAccount | null = null
  accountCopy: IAccount | null = null;
  editing: boolean = false;
  profilePic: string = "";
  fName: string = "";
  lName: string = "";

  constructor(private postService: PostService, private mainService: MainService, private accountService: AccountService) {


    //the logged in account
    this.accountService.$loggedInAccount.pipe(takeUntil(this.destroy$)).subscribe(
      dt => {this.loggedIn = dt
      }
    )
    this.postService.$postList.pipe(takeUntil(this.destroy$)).subscribe(
      ls => {this.postList = ls
      }
    )
    this.postService.$postListError.pipe(takeUntil(this.destroy$)).subscribe(
      dt => {this.errorMessage = dt
      }
    )
    this.accountService.$accountError.pipe(takeUntil(this.destroy$)).subscribe(
      dt => {this.acctErrorMessage = dt
      }
    )
 }

ngOnInit(): void {

    //the account of the page we are viewing
  this.accountService.$viewAccount.pipe(takeUntil(this.destroy$)).subscribe(
    dt => {this.account = dt
      if(this.account != null) { // make copies so edits don't apply immediately
        this.profilePic = this.account.profilePic
        this.fName = this.account.fName
        this.lName = this.account.lName
      }
    }
  )
    this.postList = [];
    if(this.account !== null && this.account.id !== undefined){
      this.postService.getPostsByAuthor(this.account.id);
    }
}


ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  edit() {
    this.editing = true;
  }

  cancelEdit() {
    this.editing = false;
  }

  updateProfile() {
    if(this.account !=  null){//set copies to account to send
      if(this.fName == ""){
        this.accountService.$accountError.next(ERROR.REGISTER_INVALID_FIRST_NAME_MESSAGE)
        return;
      }
      if(this.lName == ""){
        this.accountService.$accountError.next(ERROR.REGISTER_INVALID_LAST_NAME_MESSAGE)
        return;
      }
      this.account.profilePic = this.profilePic
      this.account.fName = this.fName
      this.account.lName =this.lName
      let value = this.accountService.updateAccount(this.account)
      if(value){
        this.editing=false;
      }
    }
  }
}
