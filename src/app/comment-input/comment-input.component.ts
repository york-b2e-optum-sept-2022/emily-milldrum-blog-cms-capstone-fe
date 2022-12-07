import {Component, Input} from '@angular/core';
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
  // categoryField: string | null = null;
  // categoryNew: IProductCategoryNew = {
  //   category: ""
  // };
  destroy$ = new Subject();
  errorMessage: string | null = null;
  comment: string = "";

  constructor(private commentService: CommentService) {
    this.commentService.$commentError.pipe(takeUntil(this.destroy$)).subscribe(message => this.errorMessage = message);

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
    this.commentService.addComment(this.comment)
  }

  cancelUpdate() {
    this.commentService.$selectedComment.next(null)
    this.commentService.$isUpdating.next(false);
  }

  updateComment() {
    if(this.selectedComment !== null){
      this.selectedComment.comment = this.comment
      this.commentService.updateComment(this.selectedComment)
    }

  }
}
