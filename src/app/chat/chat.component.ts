import { Component } from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {IAccount} from "../_interfaces/IAccount";
import {AccountService} from "../_services/account.service";
import {MainService} from "../_services/main.service";
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

  constructor(private accountService: AccountService, private main: MainService) {
    this.accountService.$loggedInAccount.pipe(takeUntil(this.destroy$)).subscribe(
      dt => {
        this.sender = dt
      }
    )

    this.accountService.$selectedChat.pipe(takeUntil(this.destroy$)).subscribe(
      dt => {
        this.receiver = dt
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
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  sendMessage() {
    console.log('send message')
    let value = this.accountService.sendMessage(this.message, this.sender, this.receiver)
    if(value == true){this.message=""}
  }
}
