import { Component } from '@angular/core';
import {PostService} from "../_services/post.service";
import {MainService} from "../_services/main.service";
import {Subject, takeUntil} from "rxjs";
import {IPost} from "../_interfaces/IPost";
import {AccountService} from "../_services/account.service";
import {IAccount} from "../_interfaces/IAccount";
import {STATE} from "../_enums/STATE";

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent {

  destroy$ = new Subject();
  errMsg: string | null = null;
  post: IPost | null = null;
  account: IAccount | null = null;

  constructor(private postService: PostService, private mainService: MainService, private accountService: AccountService) {
    this.postService.$postError.pipe(takeUntil(this.destroy$)).subscribe(
      dt => {this.errMsg = dt
      }
    )

    this.postService.$selectedPost.pipe(takeUntil(this.destroy$)).subscribe(
      dt => {this.post = dt

        console.log(this.post)
        console.log(this.post?.comment)
        if(this.post !== null && this.post.comment !== undefined){
          // @ts-ignore
          this.post.comment.sort((a,b) =>  new Date(b.createDate) - new Date(a.createDate))
        }
      }
    )

    this.accountService.$loggedInAccount.pipe(takeUntil(this.destroy$)).subscribe(
      dt => {this.account = dt
      }
    )
  }

  ngOnInit(){
  }
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }


  onDelete() {
    this.postService.deletePost(this.post);
  }

  onUpdate() {
    this.postService.$selectedPost.next(this.post)
    this.mainService.$state.next(STATE.postInput)
  }

  viewPost() {

  }
}
