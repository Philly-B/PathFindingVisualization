import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { PathFinderModule } from 'src/app/path-finder/path-finder.module';
import { graphReducer } from './store/graph.reducer';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, PathFinderModule, StoreModule.forRoot({ graph: graphReducer })],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
