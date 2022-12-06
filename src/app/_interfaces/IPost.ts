import {IAccount} from "./IAccount";

export interface IPost {
  id?: number,
  author: IAccount,
  createDate: Date,
  updateDate?: Date,
  title: string,
  body: string,
  //todo
// comments?: IComments[]
}
