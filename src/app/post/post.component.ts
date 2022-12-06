import {Component, Input} from '@angular/core';
import {IPost} from "../_interfaces/IPost";
import {IAccount} from "../_interfaces/IAccount";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {

  //todo
  @Input() post!: IPost;

}
