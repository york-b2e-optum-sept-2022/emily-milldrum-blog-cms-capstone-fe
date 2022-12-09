import {Component} from '@angular/core';
import {first, Subject, takeUntil} from "rxjs";
import {IComment} from "../_interfaces/IComment";
import {CommentService} from "../_services/comment.service";

@Component({
  selector: 'app-comment-input',
  templateUrl: './comment-input.component.html',
  styleUrls: ['./comment-input.component.css']
})
export class CommentInputComponent {

  selectedComment: IComment | null = null;
  destroy$ = new Subject();
  errorMessage: string | null = null;
  comment: string = "";

  constructor(private commentService: CommentService) {
    this.commentService.$commentError.pipe(takeUntil(this.destroy$)).subscribe(m => this.errorMessage = m);

    //subscribe to find selected category to update
    this.commentService.$selectedComment.pipe(first()).subscribe(com => {
      if (com != null){
        this.selectedComment = com;
        this.comment = com.comment;
      }else{
        this.selectedComment = null;
      }
    })
  }


  addComment() {
    let value = this.commentService.addComment(this.comment)
    if(value){
      this.comment = "";
      this.commentService.$commentError.next(null)
    }
  }

  cancelUpdate() {
    this.commentService.$selectedComment.next(null)
    this.commentService.$isUpdating.next(false);
  }

  updateComment() {
    if(this.selectedComment !== null){
      this.selectedComment.comment = this.comment
      let value = this.commentService.updateComment(this.selectedComment);
      if(value){
        this.comment = ""
      }
    }
  }
}
