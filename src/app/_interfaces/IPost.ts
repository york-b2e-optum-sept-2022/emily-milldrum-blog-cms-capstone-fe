import {IAccount} from "./IAccount";

class IComment {
}

export interface IPost {
  id?: number,
  author: IAccount,
  createDate: Date,
  updateDate?: Date,
  title: string,
  body: string,
  commentList?: IComment[]
}
