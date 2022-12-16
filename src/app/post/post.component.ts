import {Component, Input} from '@angular/core';
import {IPost} from "../_interfaces/IPost";
import {PostService} from "../_services/post.service";
import {Subject, takeUntil} from "rxjs";
import {MainService} from "../_services/main.service";
import {STATE} from "../_enums/STATE";
import {AccountService} from "../_services/account.service";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {

  @Input() post: IPost | null = null;
  destroy$ = new Subject();
  postList: IPost[] = [];
  errorMessage: string | null = null;

  bodyTrim: string = "";

  constructor(private postService: PostService, private mainService: MainService, private accountService: AccountService) {
    this.postService.$postError.pipe(takeUntil(this.destroy$)).subscribe(
      dt => {this.errorMessage = dt
      }
    )
  }

  ngOnInit(){
    if(this.post !== null){
      this.bodyTrim = this.post.body.slice(0,120)+' ... read more';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  viewPost() {
    this.postService.$selectedPost.next(this.post);
    this.mainService.$state.next(STATE.post);
  }

  profile() {
    if(this.post !== null)
    this.accountService.$viewAccount.next(this.post.author);
    this.mainService.$state.next(STATE.profile)
  }
}
