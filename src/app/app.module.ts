import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PostListComponent } from './post-list/post-list.component';
import { PostComponent } from './post/post.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PostDetailsComponent } from './post-details/post-details.component';
import { PostInputComponent } from './post-input/post-input.component';
import { CommentInputComponent } from './comment-input/comment-input.component';
import { CommentComponent } from './comment/comment.component';
import { PmListComponent } from './pm-list/pm-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    PostListComponent,
    PostComponent,
    NavbarComponent,
    PostDetailsComponent,
    PostInputComponent,
    CommentInputComponent,
    CommentComponent,
    PmListComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
