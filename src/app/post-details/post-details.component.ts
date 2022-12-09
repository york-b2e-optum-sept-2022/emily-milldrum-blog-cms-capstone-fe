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
  viewCount: number = 0;

  constructor(private postService: PostService, private mainService: MainService, private accountService: AccountService) {
    this.postService.$postError.pipe(takeUntil(this.destroy$)).subscribe(
      dt => {this.errMsg = dt
      }
    )

    this.postService.$selectedPost.pipe(takeUntil(this.destroy$)).subscribe(
      dt => {this.post = dt
        if(this.post !== null && this.post.comment !== undefined){
          // @ts-ignore
          this.post.comment.sort((a,b) =>  new Date(b.createDate) - new Date(a.createDate))
          this.viewCount=this.post.views.length
        }
      }
    )

    this.accountService.$loggedInAccount.pipe(takeUntil(this.destroy$)).subscribe(
      dt => {this.account = dt
      }
    )
  }

  ngOnInit(){

    if(this.post?.views !== null && this.post?.views !== undefined){//check if view list exists
      this.viewCount = this.post.views.length //assign view count
      console.log(this.post.views.length)
      if(this.account !== null && this.account.id !== undefined && this.account.id !== null){
        // console.log('view list exists')
        // if(this.post.views.length == 0){
        //   console.log('view list length = 0')
        //   this.postService.addView(this.account.id)
        // }
        // @ts-ignore
        let value = this.post.views.find(id => id == this.account.id) //check for this account id in the view count list

        if(!value){
          console.log('adding view')
          this.postService.addView(this.account.id)
        } else {
          console.log('found on view list')
          console.log(value)
        }
      }
    // } else {
    //   console.log('add first view')
    //   if(this.account !== null && this.account.id !== undefined && this.account.id !== null) {
    //     this.postService.addView(this.account.id)
    //   }
    }
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
