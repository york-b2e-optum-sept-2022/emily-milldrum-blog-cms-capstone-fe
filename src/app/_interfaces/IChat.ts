import {IMessage} from "./IMessage";

export interface IChat {
  id: number,
  accountList: number[], //IAccount[],
  // recipientId: number,
  // senderId: number,
  messageList: IMessage[]
}

export interface IChatNew {
  accountList:  number[],// IAccount[],
  messageList: IMessage[]
}
