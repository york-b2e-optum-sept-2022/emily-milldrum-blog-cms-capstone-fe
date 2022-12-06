import {Component, Input} from '@angular/core';
import {IPost} from "../_interfaces/IPost";
import {IAccount} from "../_interfaces/IAccount";
import {PostService} from "../_services/post.service";
import {Subject, takeUntil} from "rxjs";
import {ERROR} from "../_enums/ERROR";
import {MainService} from "../_services/main.service";
import {STATE} from "../_enums/STATE";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {

  //todo
  @Input() post: IPost | null = null;
  destroy$ = new Subject();
  postList: IPost[] = [];
  errorMessage: string | null = null;

  constructor(private postService: PostService, private mainService: MainService) {
    this.postService.$postError.pipe(takeUntil(this.destroy$)).subscribe(
      dt => {this.errorMessage = dt
      }
    )
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  onUpdate() {

  }

  onDelete() {

  }

  viewPost() {
    this.postService.$selectedPost.next(this.post);
    this.mainService.$state.next(STATE.post);
  }
}
