import { Component } from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {IAccount} from "../_interfaces/IAccount";
import {AccountService} from "../_services/account.service";
import {IMessage} from "../_interfaces/IMessage";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {


  errorMessage: string | null = null;
  destroy$ = new Subject();

  sender: IAccount | null = null;
  receiver: IAccount | null = null;
  message: string = "";
  messageList: IMessage[] = [];

  constructor(private accountService: AccountService) {
    this.accountService.$loggedInAccount.pipe(takeUntil(this.destroy$)).subscribe(
      dt => {
        this.sender = dt
        console.log(dt?.id)
      }
    )

    this.accountService.$selectedChat.pipe(takeUntil(this.destroy$)).subscribe(
      dt => {
        this.receiver = dt
        console.log(dt?.id)
      }
    )

    this.accountService.$messageList.pipe(takeUntil(this.destroy$)).subscribe(
      dt => {
        this.messageList = dt
      }
    )
  }


  ngOnInit(): void {
    this.accountService.getAllAccounts();
    //console.log(this.message.sen
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  sendMessage() {
    console.log('send message')
    let value = this.accountService.sendMessage(this.message, this.sender, this.receiver)
    if(value){this.message=""}
  }
}
