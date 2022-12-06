import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
import {IComment} from "../_interfaces/IComment";
import {IAccount} from "../_interfaces/IAccount";
import {PostService} from "./post.service";
import {ERROR} from "../_enums/ERROR";

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

  constructor(private postService: PostService){
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  addComment(comment: string) {
    if (comment == "" || comment == null || comment == undefined)
    {
      this.$commentError.next(ERROR.COMMENT_BLANK)
    } else {
      this.postService.addComment(comment)
    }
  }
}
