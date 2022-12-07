import {Component, Input} from '@angular/core';
import {IComment} from "../_interfaces/IComment";
import {Subject, takeUntil} from "rxjs";
import {IPost} from "../_interfaces/IPost";
import {IAccount} from "../_interfaces/IAccount";
import {PostService} from "../_services/post.service";
import {MainService} from "../_services/main.service";
import {AccountService} from "../_services/account.service";
import {STATE} from "../_enums/STATE";
import {CommentService} from "../_services/comment.service";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent {

  //todo IComment error here
  @Input() comment!: any;

  //@Input() comment: IComment | null = null;


  destroy$ = new Subject();
  errMsg: string | null = null;
  post: IPost | null = null;
  account: IAccount | null = null;

  constructor(private commentService: CommentService, private mainService: MainService, private accountService: AccountService) {
    this.commentService.$commentError.pipe(takeUntil(this.destroy$)).subscribe(
      dt => {this.errMsg = dt
      }
    )

    // this.postService.$selectedPost.pipe(takeUntil(this.destroy$)).subscribe(
    //   dt => {this.post = dt
    //
    //     console.log(this.post)
    //     console.log(this.post?.comment)
    //   }
    // )

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
    this.commentService.deleteComment(this.comment);
  }

  onUpdate() {
    // this.postService.$selectedPost.next(this.post)
    // this.mainService.$state.next(STATE.postInput)
  }
}
