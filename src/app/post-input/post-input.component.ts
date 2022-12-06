import { Component } from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {IPost} from "../_interfaces/IPost";
import {IAccount} from "../_interfaces/IAccount";
import {PostService} from "../_services/post.service";
import {MainService} from "../_services/main.service";
import {AccountService} from "../_services/account.service";

@Component({
  selector: 'app-post-input',
  templateUrl: './post-input.component.html',
  styleUrls: ['./post-input.component.css']
})
export class PostInputComponent {
  destroy$ = new Subject();
  errorMessage: string | null = null;
  post: IPost | null = null;
  account: IAccount | null = null;
  title: string = ""
  body: string = ""


  constructor(private postService: PostService, private mainService: MainService, private accountService: AccountService) {
    // this.postService.$postInputError.pipe(takeUntil(this.destroy$)).subscribe(
    //   dt => {this.errMsg = dt
    //   }
    // )

    this.postService.$selectedPost.pipe(takeUntil(this.destroy$)).subscribe(
      dt => {this.post = dt
        if(this.post !==null){
          this.title = this.post.title
          this.body = this.post.body
        }
      }
    )

    this.accountService.$loggedInAccount.pipe(takeUntil(this.destroy$)).subscribe(
      dt => {this.account = dt
      }
    )
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  onCreate() {
    console.log(this.title)
    console.log(this.body)
    console.log(this.account)
    this.postService.createPost(this.title, this.body, this.account)

  }

  onCancel() {

  }

  onUpdate() {

  }

  closeThis() {

  }
}