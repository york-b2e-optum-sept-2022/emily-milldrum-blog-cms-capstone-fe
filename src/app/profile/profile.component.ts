import { Component } from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {IPost} from "../_interfaces/IPost";
import {IAccount} from "../_interfaces/IAccount";
import {PostService} from "../_services/post.service";
import {MainService} from "../_services/main.service";
import {AccountService} from "../_services/account.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  destroy$ = new Subject();
  errorMessage: string | null = null;
  postList: IPost[] = [];
  account: IAccount | null = null;
  editing: boolean = false;
  profilePic: string = "";



  constructor(private postService: PostService, private mainService: MainService, private accountService: AccountService) {


    this.accountService.$loggedInAccount.pipe(takeUntil(this.destroy$)).subscribe(
      dt => {this.account = dt
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
  }

ngOnInit(): void {

  this.accountService.$viewAccount.pipe(takeUntil(this.destroy$)).subscribe(
    dt => {this.account = dt
      console.log(this.account)
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
    console.log('edit profile')
    this.editing = true;
  }

  cancelEdit() {
    this.editing = false;
  }
}
