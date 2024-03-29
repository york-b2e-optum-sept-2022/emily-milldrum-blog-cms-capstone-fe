import {IAccount} from "./IAccount";

export interface IComment {
  id?: number,
  author: IAccount,
  postId: number,
  createDate: Date,
  updateDate?: Date,
  comment: string
}


export interface ICommentNew {
  id?: number,
  postId: number,
  author: IAccount,
  createDate: Date,
  updateDate?: Date,
  comment: string
}

