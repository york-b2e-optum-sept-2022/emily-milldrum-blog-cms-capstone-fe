import {IAccount} from "./IAccount";

export interface IPost {
  id?: number,
  post: IPost,
  author: IAccount,
  createDate: Date,
  updateDate?: Date,
  body: string
}
