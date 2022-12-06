import {Injectable} from '@angular/core';
import {IAccount} from "../_interfaces/IAccount";
import {BehaviorSubject, first, Subject} from "rxjs";
import {IPost} from "../_interfaces/IPost";
import {HttpService} from "./http.service";
import {MainService} from "./main.service";
import {ERROR} from "../_enums/ERROR";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  //used for populating post list main page
  private postList: IPost[] = [];
  $postList: Subject<IPost[]> = new Subject<IPost[]>();
  //displays post list errors
  $postListError = new BehaviorSubject<string | null>(null)

  //for viewing individual post
  $selectedPost = new BehaviorSubject<IPost | null>(null)
  //individual post errors
  $postError = new BehaviorSubject<string | null>(null)

  aut: IAccount = {id: 0, email: "", fName: "", lName: "", password: "", profilePic: ""}
  newPost: IPost = {author: this.aut, body: "", createDate: new Date(), title: "", comments: []};

  constructor(private httpService: HttpService, private main: MainService) {
    this.getAllPosts();
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
}
