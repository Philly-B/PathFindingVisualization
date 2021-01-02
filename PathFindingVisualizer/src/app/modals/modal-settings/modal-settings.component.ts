import { Color, NgxMatColorPickerInput } from '@angular-material-components/color-picker';
import { AfterViewInit, Component, Inject, QueryList, ViewChildren } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColorSettings } from 'src/app/model/ColorSettings';
import { getSettingLabelForField } from 'src/app/utils/ColorMappingUtils';

@Component({
  selector: 'app-modal-settings',
  templateUrl: './modal-settings.component.html',
  styleUrls: ['./modal-settings.component.scss'],
})
export class ModalSettingsComponent implements AfterViewInit {
  modiefieableColors: string[] = [];
  fieldNameToLabelMap = {};
  modifieableSettings: ModifieableSettings;

  @ViewChildren(NgxMatColorPickerInput) pickerInputs: QueryList<NgxMatColorPickerInput>;

  constructor(
    public dialogRef: MatDialogRef<ModalSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) modifieableSettings: ModifieableSettings
  ) {
    this.modifieableSettings = JSON.parse(JSON.stringify(modifieableSettings));

    for (const colorField in modifieableSettings.colorSettings) {
      if (Object.prototype.hasOwnProperty.call(modifieableSettings.colorSettings, colorField)) {
        const labelText = getSettingLabelForField(colorField);
        if (labelText) {
          this.fieldNameToLabelMap[colorField] = labelText;
          this.modiefieableColors.push(colorField);
        }
      }
    }

    this.modiefieableColors.sort();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    for (const ngxColorPicker of this.pickerInputs) {
      const fieldOfInput = ngxColorPicker.getConnectedOverlayOrigin().nativeElement.name;
      const finalColor = ngxColorPicker.value.toHexString();
      this.modifieableSettings.colorSettings[fieldOfInput] = finalColor;
    }
    this.dialogRef.close(this.modifieableSettings);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      for (const ngxColorPicker of this.pickerInputs) {
        const fieldOfInput = ngxColorPicker.getConnectedOverlayOrigin().nativeElement.name;
        const currentColor = this.hexToRgb(this.modifieableSettings.colorSettings[fieldOfInput]);
        ngxColorPicker.value = new Color(currentColor.r, currentColor.g, currentColor.b);
      }
    });
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => {
      return r + r + g + g + b + b;
    });
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }
}

export class ModifieableSettings implements ModifieableSettings {
  constructor(public colorSettings: ColorSettings) {}
}
