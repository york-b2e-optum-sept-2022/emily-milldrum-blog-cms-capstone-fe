import {Component, Input} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {IPost} from "../_interfaces/IPost";
import {IAccount} from "../_interfaces/IAccount";
import {MainService} from "../_services/main.service";
import {AccountService} from "../_services/account.service";
import {CommentService} from "../_services/comment.service";
import {STATE} from "../_enums/STATE";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent {

  //TODO IComment error here
  @Input() comment!: any;

  //@Input() comment: IComment | null = null;


  destroy$ = new Subject();
  errMsg: string | null = null;
  post: IPost | null = null;
  account: IAccount | null = null;
  isUpdating: boolean = false;

  constructor(private commentService: CommentService, private mainService: MainService, private accountService: AccountService) {
    this.commentService.$commentError.pipe(takeUntil(this.destroy$)).subscribe(
      dt => {this.errMsg = dt
      }
    )

    this.commentService.$isUpdating.pipe(takeUntil(this.destroy$)).subscribe(
      dt => {this.isUpdating = dt
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
    this.commentService.deleteComment(this.comment);
  }

  onUpdate() {
    this.isUpdating = true; //comment-input component for input
    this.commentService.$selectedComment.next(this.comment)
  }

  profile() {
    this.accountService.$viewAccount.next(this.account);
    this.mainService.$state.next(STATE.profile)
  }

}
