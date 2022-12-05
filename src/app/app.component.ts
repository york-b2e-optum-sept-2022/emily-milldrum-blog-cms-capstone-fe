import { Component } from '@angular/core';
import {MainService} from "./_services/main.service";
import {Subject, takeUntil} from "rxjs";
import {STATE} from "./_enums/STATE";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Social City';
  state: STATE = STATE.login;
  destroy$ = new Subject();
  stateEnum = STATE;

  constructor(private main: MainService) {
    this.main.$state.pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.state = state
      })
  }
  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
