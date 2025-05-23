import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MarkdownModule } from 'ngx-markdown';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { AppComponent } from './app.component';
import { tokenInterceptorProvider } from './interceptors/token.interceptor';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MarkdownModule.forRoot(),
    RouterModule.forRoot(routes),
    AppComponent
  ],
  providers: [tokenInterceptorProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }
