import {Injectable} from '@angular/core';
import {IAccount} from "../_interfaces/IAccount";
import {BehaviorSubject, first, Subject, takeUntil} from "rxjs";
import {IPost} from "../_interfaces/IPost";
import {HttpService} from "./http.service";
import {MainService} from "./main.service";
import {ERROR} from "../_enums/ERROR";
import {STATE} from "../_enums/STATE";
import {AccountService} from "./account.service";
import {ICommentNew} from "../_interfaces/IComment";

@Injectable({
  providedIn: 'root'
})
export class PostService {


  private postList: IPost[] = [];  //used for populating post list main page
  $postList = new BehaviorSubject<IPost[]>([])
  $postListError = new BehaviorSubject<string | null>(null)  //displays post list errors


  $selectedPost = new BehaviorSubject<IPost | null>(null)  //for viewing individual post
  $postError = new BehaviorSubject<string | null>(null)  //individual post errors

  aut: IAccount = {id: 0, email: "", fName: "", lName: "", password: "", profilePic: ""}
  newPost: IPost = {author: this.aut, body: "", createDate: new Date(), title: "", comment: [], views: []};

  account: IAccount | null = null;
  destroy$ = new Subject();

  constructor(private httpService: HttpService, private main: MainService, private accountService: AccountService) {
    this.getAllPosts();
    this.accountService.$loggedInAccount.pipe(takeUntil(this.destroy$))
      .subscribe(account => {
        this.account = account
      })
  }

  getPostsByAuthor(id: number) {
    this.httpService.getPostsByAuthor(id).pipe(first()).subscribe({
      next: data => {
        this.postList = data;
        this.$postList.next(this.postList);
        this.$postListError.next(null);
      },
      error: () => {
        this.$postListError.next(ERROR.POSTLIST_HTTP_ERROR);
      }
    })
  }

  getAllPosts() {
    this.httpService.getAllPosts().pipe(first()).subscribe({
      next: data => {
        this.postList = data;
        // @ts-ignore
        this.postList.sort((a,b) =>  new Date(b.createDate) - new Date(a.createDate)
        )
        this.$postList.next(this.postList);
        console.log(this.postList)
        this.$postListError.next(null);
      },
      error: () => {
        this.$postListError.next(ERROR.POSTLIST_HTTP_ERROR);
      }
    })
  }


  createPost(title: string, body: string, account: IAccount | null) {
    if (account == null || account.id == undefined) {
      this.$postError.next(ERROR.POST_ACCOUNT_NULL)
      return
    }
    if (title == "" || title == null){
      this.$postError.next(ERROR.POST_TITLE_EMPTY)
      return
    }
    if (body == "" || body == null){
      this.$postError.next(ERROR.POST_BODY_EMPTY)
      return
    }

      this.newPost.title = title;
      this.newPost.body = body;
      this.newPost.createDate = new Date();
      this.newPost.author = account;
      this.newPost.views = [];

    this.httpService.createPost(this.newPost).pipe(first()).subscribe({
      next: (post) => {
        let newList: IPost[] = [...this.postList];
        newList.push(post);
        this.$postList.next(newList)
        this.main.$state.next(STATE.postList)
      },
      error: (err) => {
        console.log(err)
        this.$postError.next(ERROR.POST_HTTP_ERROR)
      }
    })
  }


  updatePost(title: string, body: string) {
    let post = this.$selectedPost.getValue();
    if (post !== null) {
      post.title = title;
      post.body = body;
      post.updateDate = new Date();

      this.httpService.updatePost(post).pipe(first()).subscribe({
        next: (p) => {
          let newList: IPost[] = [...this.postList];
          newList.push(p);
          this.$postList.next(newList)
          this.$selectedPost.next(null)
          this.$postError.next(null)
          this.main.$state.next(STATE.postList)
        },
        error: () => {
          this.$postError.next(ERROR.POST_HTTP_ERROR)
        }
      })
    } else {
      this.$postError.next(ERROR.POST_NULL)
    }
  }

  deletePost(post: IPost | null) {
    if (post !== null && post.id !== undefined) {
      this.httpService.deletePost(post.id).pipe(first()).subscribe({
        next: () => {
          let list: IPost[] = [...this.$postList.getValue()];
          this.$postList.next(
            list.filter(inc => post.id !== inc.id)
          );
          this.$postError.next(null)
          this.main.$state.next(STATE.postList);
          this.$selectedPost.next(null);
        },
        error: () => {
          this.$postError.next(ERROR.POST_HTTP_ERROR)
        }
      })
    } else {
      this.$postError.next(ERROR.POST_NULL)
    }
  }

  addComment(comment: string): boolean { //errors handled in comment service
    let post = this.$selectedPost.getValue();

    if (this.account !== null && post !== null && post !== undefined) {
      if (post.id !== undefined) {
        let commentFormat: ICommentNew = {
          author: this.account,
          postId: post.id,
          createDate: new Date(),
          comment: comment
        }
          this.httpService.addComment(commentFormat).pipe(first()).subscribe({
            next: (c) => {
              if(post && post.comment && post.author !== undefined){
                post.comment.push(c)
                this.$selectedPost.next(post)
              }
            },
            error: () => {
              return false;
            }
          })
        }
      } else {
        return false;
      }
    return true;
    }


  onSearchTextChange(text: string) {
    this.$postList.next(
      this.postList.filter(post => post.title.toUpperCase().includes(text.toUpperCase()))
    )
  }

  addView(id: number) {

    let post = this.$selectedPost.getValue();
    if (post !== null) {
      if(post.views == null){
        post.views = [];
      }
      post.views.push(id);
      this.httpService.updatePost(post).pipe(first()).subscribe({
        next: (p) => {
          let newList: IPost[] = [...this.postList];
          newList.push(p);
          this.$postList.next(newList)
          this.$selectedPost.next(p)
        },
        error: (err) => {
          console.log(err)
        }
      })
    }
  }
}
