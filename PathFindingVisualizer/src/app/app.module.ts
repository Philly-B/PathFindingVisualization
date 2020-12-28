import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { PathFinderModule } from 'src/app/modules/path-finder/path-finder.module';
import { EffectsModule } from '@ngrx/effects';
import { GraphEffects } from './store/graph-store/graph.effects';
import { AlgorithmModule } from './modules/algorithm/algorithm.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppReducers } from './store/app.reducer';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    PathFinderModule,
    AlgorithmModule,
    StoreModule.forRoot(AppReducers),
    EffectsModule.forRoot([]),
    EffectsModule.forFeature([GraphEffects]),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
