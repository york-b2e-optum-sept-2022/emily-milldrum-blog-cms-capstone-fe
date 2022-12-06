import { Injectable } from '@angular/core';
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
}
