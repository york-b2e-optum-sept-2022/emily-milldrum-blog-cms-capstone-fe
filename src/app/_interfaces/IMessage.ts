import {IAccount} from "./IAccount";

export interface IMessage {
  id?: number,
  createDate?: Date,
  sender: IAccount,
  receiver: IAccount,
  message?: string
}
