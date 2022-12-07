import {Injectable} from '@angular/core';
import {IAccount} from "../_interfaces/IAccount";
import {BehaviorSubject, first, Subject, takeUntil} from "rxjs";
import {IPost} from "../_interfaces/IPost";
import {HttpService} from "./http.service";
import {MainService} from "./main.service";
import {ERROR} from "../_enums/ERROR";
import {STATE} from "../_enums/STATE";
import {AccountService} from "./account.service";
import {IComment, ICommentNew} from "../_interfaces/IComment";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  //used for populating post list main page
  private postList: IPost[] = [];
  $postList = new BehaviorSubject<IPost[]>([])
  //: Subject<IPost[]> = new Subject<IPost[]>();
  //displays post list errors
  $postListError = new BehaviorSubject<string | null>(null)

  //for viewing individual post
  $selectedPost = new BehaviorSubject<IPost | null>(null)
  //individual post errors
  $postError = new BehaviorSubject<string | null>(null)

  aut: IAccount = {id: 0, email: "", fName: "", lName: "", password: "", profilePic: ""}
  newPost: IPost = {author: this.aut, body: "", createDate: new Date(), title: "", comment: []};

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
        console.log(this.postList)
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
    } else {
      this.newPost.title = title;
      this.newPost.body = body;
      this.newPost.createDate = new Date();
      this.newPost.author = account;
    }
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
    // this.$isCreating.next(false)
    // this.resetAll()
    // return true;
  }

  updatePost(title: string, body: string) {

    let post = this.$selectedPost.getValue();
    if (post !== null) {
      post.title = title;
      post.body = body;
      post.updateDate = new Date();
      console.log(post)
      this.httpService.updatePost(post).pipe(first()).subscribe({
        next: (p) => {
          let newList: IPost[] = [...this.postList];
          newList.push(p);
          this.$postList.next(newList)
          this.$selectedPost.next(p)
          this.main.$state.next(STATE.post)
        },
        error: (err) => {
          console.log(err)
          this.$postError.next(ERROR.POST_HTTP_ERROR)
        }
      })
    } else {
      //todo error
    }
  }

  deletePost(post: IPost | null) {
    console.log('post service delete')
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
        error: (err) => {
          console.log(err)
          this.$postError.next(ERROR.POST_HTTP_ERROR)
        }
      })
    } else {
      this.$postError.next(ERROR.POST_NULL)
    }
  }

  addComment(comment: string) {

    /*
    todo
    adding comment to backend but sloppy
    need to render comment list on front end blog post
     */
    // console.log(comment)
    // console.log(this.account)
    // console.log(this.$selectedPost.getValue())
    //make comment find author, post, create date,
    //then run update post.
    //let post = {...this.$selectedPost.getValue()};
    let post = this.$selectedPost.getValue();

    if (this.account !== null && post !== null && post !== undefined) {
      if (post.id !== undefined) {
        let commentFormat: ICommentNew = {
          author: this.account,
          postId: post.id,
          createDate: new Date(),
          comment: comment
        }

        // if (post.comment !== undefined && post.comment !== null) {
        //   post.comment.push(commentFormat)
        // } else {//if no comments list, make empty array
        //   post.comment = []
        //   post.comment.push(commentFormat)

          console.log(post)
          //console.log(post.comments)
          //   this.httpService.updatePost(post).pipe(first()).subscribe({
          //     next: (p) => {
          //       let newList: IPost[] = [...this.postList];
          //       newList.push(p);
          //       this.$postList.next(newList)
          //       this.$selectedPost.next(p)
          //       this.main.$state.next(STATE.post)
          //     },
          //     error: (err) => {
          //       console.log(err)
          //       this.$postError.next(ERROR.POST_HTTP_ERROR)
          //     }
          //   })
          // }
          this.httpService.addComment(commentFormat).pipe(first()).subscribe({
            next: (post) => {
              this.$selectedPost.next(post)
             // this.resetErrorMessages()
            },
            error: (err) => {
              console.log(err)
              //this.next(ERROR.STAGE_ADD_ERROR)
            }
          })
        }
      } else {
        //todo
        console.log('something wrong')
      }
    }


  onSearchTextChange(text: string) {
    this.$postList.next(
      this.postList.filter(post => post.title.toUpperCase().includes(text.toUpperCase()))
    )
  }

}
