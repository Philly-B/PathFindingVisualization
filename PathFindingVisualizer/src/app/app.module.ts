import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { PathFinderModule } from 'src/app/modules/path-finder/path-finder.module';
import { EffectsModule } from '@ngrx/effects';
import { GraphEffects } from './store/graph-store/graph.effects';
import { AlgorithmModule } from './modules/algorithm/algorithm.module';
import { AppReducers } from './store/app.reducer';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    PathFinderModule,
    AlgorithmModule,
    MatIconModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    StoreModule.forRoot(AppReducers),
    EffectsModule.forRoot([]),
    EffectsModule.forFeature([GraphEffects]),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
