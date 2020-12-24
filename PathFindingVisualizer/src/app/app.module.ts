import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { PathFinderModule } from 'src/app/path-finder/path-finder.module';
import { graphReducer } from './store/graph.reducer';
import { EffectsModule } from '@ngrx/effects';
import { GraphEffects } from './store/graph.effects';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    PathFinderModule,
    StoreModule.forRoot({ graph: graphReducer }),
    EffectsModule.forRoot([]),
    EffectsModule.forFeature([GraphEffects]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
