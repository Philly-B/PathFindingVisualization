import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatColorFormats, MAT_COLOR_FORMATS } from '@angular-material-components/color-picker';

const CUSTOM_MAT_COLOR_FORMATS: MatColorFormats = {
  display: {
    colorInput: 'hex6',
  },
};
@NgModule({
  exports: [MatSelectModule, MatInputModule, MatSliderModule, MatSlideToggleModule, MatToolbarModule, MatIconModule],
  providers: [{ provide: MAT_COLOR_FORMATS, useValue: CUSTOM_MAT_COLOR_FORMATS }],
})
export class MaterialWrapperModule {}
