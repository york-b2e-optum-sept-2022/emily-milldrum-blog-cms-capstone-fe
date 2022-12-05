import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {STATE} from "../_enums/STATE";

@Injectable({
  providedIn: 'root'
})
export class MainService {

  $state = new BehaviorSubject<STATE>(STATE.login)

  constructor() { }


}
