import { Component } from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {PostService} from "../_services/post.service";
import {IPost} from "../_interfaces/IPost";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent {
  postList: IPost[] = [];
  errorMessage: string | null = null;
  destroy$ = new Subject();

  constructor(private postService: PostService) {
    this.postService.$postList.pipe(takeUntil(this.destroy$)).subscribe(
      ls => {this.postList = ls
        console.log(this.postList)
      }
    )
    this.postService.$postListError.pipe(takeUntil(this.destroy$)).subscribe(
      dt => {this.errorMessage = dt
      }
    )
  }


  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
