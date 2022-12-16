import {IAccount} from "./IAccount";
import {IComment} from "./IComment";


export interface IPost {
  id?: number,
  author: IAccount,
  createDate: Date,
  updateDate?: Date,
  title: string,
  body: string,
  comment?: IComment[],
  views: number[]
}
