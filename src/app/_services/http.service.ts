import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IAccount, IAccountLogin} from "../_interfaces/IAccount";
import {Observable} from "rxjs";
import {IPost} from "../_interfaces/IPost";
import {IComment, ICommentNew} from "../_interfaces/IComment";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient) {}

  //account http requests
  getAccounts() {
    return this.httpClient.get('http://localhost:8080/api/account') as Observable<IAccount[]>;
  }

  getAccountById(id: number) {
    return this.httpClient.get('http://localhost:8080/api/account/' + id) as Observable<IAccount>;
  }

  createAccount(account: IAccount) {
    return this.httpClient.post('http://localhost:8080/api/account', account) as Observable<IAccount>;
  }

  login(login: IAccountLogin) {
    return this.httpClient.get(`http://localhost:8080/api/account/login?email=${login.email}&password=${login.password}`) as Observable<IAccount>;
  }

  //post http requests

  getPostsByAuthor(id: number) {
    return this.httpClient.get('http://localhost:8080/api/post/a/'+ id) as Observable<IPost[]>;
  }

  getAllPosts() {
    return this.httpClient.get('http://localhost:8080/api/post') as Observable<IPost[]>;
  }

  createPost(newPost: IPost) {//for new posts
    return this.httpClient.post('http://localhost:8080/api/post', newPost) as Observable<IPost>;
  }

  updatePost(post: IPost) {
    console.log(post)
    return this.httpClient.put<IPost>('http://localhost:8080/api/post', post);
  }

  deletePost(id: number) {
    return this.httpClient.delete<IPost>('http://localhost:8080/api/post/' + id);
  }
  //
  // addComment(post: IPost) {
  //   return this.httpClient.put<IPost>('http://localhost:8080/api/post', post);
  // }


  //delete comment

  deleteComment(id: number) {
    return this.httpClient.delete<IPost>('http://localhost:8080/api/comment/' + id);
  }

  addComment(comment: ICommentNew) {
    return this.httpClient.post<IPost>('http://localhost:8080/api/comment/', comment);
  }
}
