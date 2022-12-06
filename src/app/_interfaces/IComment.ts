import {IAccount} from "./IAccount";
import {IPost} from "./IPost";

export interface IComment {
  id?: number,
  post: IPost,
  author: IAccount,
  createDate: Date,
  updateDate?: Date,
  comment: string
}

export interface ICommentNew {
  id?: number,
  post: number,
  author: IAccount,
  createDate: Date,
  updateDate?: Date,
  comment: string
}

