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
  modifiableColors: string[] = [];
  fieldNameToLabelMap = {};
  modifiableSettings: ModifiableSettings;
  resetButtonDisabled = { all: true };

  @ViewChildren(NgxMatColorPickerInput) pickerInputs: QueryList<NgxMatColorPickerInput>;

  constructor(
    public dialogRef: MatDialogRef<ModalSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) modifiableSettings: ModifiableSettings
  ) {
    this.modifiableSettings = JSON.parse(JSON.stringify(modifiableSettings));

    for (const colorField in modifiableSettings.colorSettings) {
      if (Object.prototype.hasOwnProperty.call(modifiableSettings.colorSettings, colorField)) {
        const labelText = getSettingLabelForField(colorField);
        if (labelText) {
          this.fieldNameToLabelMap[colorField] = labelText;
          this.modifiableColors.push(colorField);
        }
      }
    }

    this.modifiableColors.sort();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    for (const ngxColorPicker of this.pickerInputs) {
      const fieldOfInput = ngxColorPicker.getConnectedOverlayOrigin().nativeElement.name;
      const finalColor = ngxColorPicker.value.toHexString();
      this.modifiableSettings.colorSettings[fieldOfInput] = finalColor;
    }
    this.dialogRef.close(this.modifiableSettings);
  }

  resetColor(colorFieldToReset: string): void {
    for (const ngxColorPicker of this.pickerInputs) {
      const fieldOfInput = ngxColorPicker.getConnectedOverlayOrigin().nativeElement.name;
      if (fieldOfInput !== colorFieldToReset) continue;
      const currentColor = this.hexToRgb(ColorSettings.initialSettings[fieldOfInput]);
      ngxColorPicker.value = new Color(currentColor.r, currentColor.g, currentColor.b);
      this.resetButtonDisabled[fieldOfInput] = true;
      break;
    }
    this.updateResetAllButtonDisabled();
  }


  resetAllColors(): void {
    for (const ngxColorPicker of this.pickerInputs) {
      const fieldOfInput = ngxColorPicker.getConnectedOverlayOrigin().nativeElement.name;
      const currentColor = this.hexToRgb(ColorSettings.initialSettings[fieldOfInput]);
      ngxColorPicker.value = new Color(currentColor.r, currentColor.g, currentColor.b);

      this.resetButtonDisabled[fieldOfInput] = true;
    }
    this.updateResetAllButtonDisabled();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      for (const ngxColorPicker of this.pickerInputs) {
        const fieldOfInput = ngxColorPicker.getConnectedOverlayOrigin().nativeElement.name;
        const currentColor = this.hexToRgb(this.modifiableSettings.colorSettings[fieldOfInput]);
        ngxColorPicker.value = new Color(currentColor.r, currentColor.g, currentColor.b);

        this.resetButtonDisabled[fieldOfInput] = this.isSameColor(ngxColorPicker, fieldOfInput);
      }
      this.updateResetAllButtonDisabled();
    });
  }

  colorChanged = (colorField) => {
    for (const ngxColorPicker of this.pickerInputs) {
      const fieldOfInput = ngxColorPicker.getConnectedOverlayOrigin().nativeElement.name;
      if (fieldOfInput !== colorField) continue;
      this.resetButtonDisabled[fieldOfInput] = this.isSameColor(ngxColorPicker, colorField);
      break;
    }
    this.updateResetAllButtonDisabled();
  }

  private updateResetAllButtonDisabled = (): void => {

    for (const ngxColorPicker of this.pickerInputs) {
      const fieldOfInput = ngxColorPicker.getConnectedOverlayOrigin().nativeElement.name;
      if (!this.resetButtonDisabled[fieldOfInput]) {
        this.resetButtonDisabled.all = false;
        return;
      }
    }
    this.resetButtonDisabled.all = true;
  }
  private isSameColor = (ngxColorPicker: NgxMatColorPickerInput, colorField): boolean => {
    return '#' + ngxColorPicker.value.hex === ColorSettings.initialSettings[colorField];
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

export class ModifiableSettings implements ModifiableSettings {
  constructor(public colorSettings: ColorSettings) { }
}
