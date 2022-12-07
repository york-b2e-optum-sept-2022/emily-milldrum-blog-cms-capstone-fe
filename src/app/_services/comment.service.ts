import { Injectable } from '@angular/core';
import {BehaviorSubject, first, Subject} from "rxjs";
import {IComment} from "../_interfaces/IComment";
import {IAccount} from "../_interfaces/IAccount";
import {PostService} from "./post.service";
import {ERROR} from "../_enums/ERROR";
import {HttpService} from "./http.service";
import {IPost} from "../_interfaces/IPost";
import {STATE} from "../_enums/STATE";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  //for editing individual comment
  $selectedComment = new BehaviorSubject<IComment | null>(null)
  //displays comment errors
  $commentError = new BehaviorSubject<string | null>(null)
  account: IAccount | null = null;
  destroy$ = new Subject();

  constructor(private postService: PostService, private httpService: HttpService){
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  addComment(comment: string) {
    //TODO something is wrong here
    //
    // duplicating addded, but adding 1 to backend.. front end problem
    if (comment == "" || comment == null || comment == undefined)
    {
      this.$commentError.next(ERROR.COMMENT_BLANK)
    } else {
      this.postService.addComment(comment)
    }
  }

  deleteComment(comment: IComment) {


   // this.httpService.deleteComment(comment.)

    console.log('post service delete')

    if(comment.id == undefined){
      this.$commentError.next(ERROR.COMMENT_NULL)
      return;
    }
    this.httpService.deleteComment(comment.id).pipe(first()).subscribe({
      next: (post) => {
        this.postService.$selectedPost.next(post);
        this.$commentError.next(null)
        //let list: IPost[] = [...this.$postList.getValue()];
       // this..next(
         // list.filter(inc => post.id !== inc.id)
        // );
        // this.$postError.next(null)
        // this.main.$state.next(STATE.postList);
        // this.$selectedPost.next(null);
      },
      error: (err) => {
        console.log(err)
        this.$commentError.next(ERROR.COMMENT_HTTP_ERROR)
      }
    })
  }
}
