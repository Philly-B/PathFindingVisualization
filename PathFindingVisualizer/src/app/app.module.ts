import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PathFinderModule } from 'src/app/path-finder/path-finder.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    PathFinderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
