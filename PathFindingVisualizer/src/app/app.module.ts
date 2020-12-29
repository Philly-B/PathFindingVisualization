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
import { ReactiveFormsModule } from '@angular/forms';

import { ToastrModule } from 'ngx-toastr';
import { NOTIFICATION_SETTINGS } from './constants/GeneralConstants';
import { AlgorithmEffects } from './store/algorithm-store/algorithm.effects';
import { ModalSettingsComponent } from './modals/modal-settings/modal-settings.component';
import { MaterialWrapperModule } from './modules/materials-wrapper/material-wrapper.module';

@NgModule({
  declarations: [AppComponent, ModalSettingsComponent],
  imports: [
    BrowserModule,
    PathFinderModule,
    AlgorithmModule,
    ReactiveFormsModule,
    MaterialWrapperModule,
    ToastrModule.forRoot(NOTIFICATION_SETTINGS),
    StoreModule.forRoot(AppReducers),
    EffectsModule.forRoot([]),
    EffectsModule.forFeature([GraphEffects, AlgorithmEffects]),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
