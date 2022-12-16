import { Injectable } from '@angular/core';
import {BehaviorSubject, first, Subject} from "rxjs";
import {IComment} from "../_interfaces/IComment";
import {IAccount} from "../_interfaces/IAccount";
import {PostService} from "./post.service";
import {ERROR} from "../_enums/ERROR";
import {HttpService} from "./http.service";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  //for editing individual comment
  $selectedComment = new BehaviorSubject<IComment | null>(null)
  $isUpdating = new BehaviorSubject<boolean>(false)
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

  addComment(comment: string): boolean {
    if (comment == "" || comment == null)
    {
      this.$commentError.next(ERROR.COMMENT_BLANK)
      return false;
    } else {
      let value = this.postService.addComment(comment)
      if(!value){
        this.$commentError.next(ERROR.COMMENT_ERROR)
        return false;
      }
    }
    return true;
  }

  deleteComment(comment: IComment) {
    if(comment.id == undefined){
      this.$commentError.next(ERROR.COMMENT_NULL)
      return;
    }
    this.httpService.deleteComment(comment.id).pipe(first()).subscribe({
      next: (post) => {
        this.postService.$selectedPost.next(post);
        this.$commentError.next(null)
      },
      error: (err) => {
        console.log(err)
        this.$commentError.next(ERROR.COMMENT_HTTP_ERROR)
      }
    })
  }

  updateComment(selectedComment: IComment): boolean{
    if(selectedComment.comment == ""){
      this.$commentError.next(ERROR.COMMENT_BLANK);
      return false;
    }
    this.httpService.updateComment(selectedComment).pipe(first()).subscribe({
      next: () => {
        this.$commentError.next(null)
        this.$selectedComment.next(null)
        this.$isUpdating.next(false)
      },
      error: (err) => {
        console.log(err)
        this.$commentError.next(ERROR.COMMENT_HTTP_ERROR)
        return false;
      }
    })
    return true;
  }
}
