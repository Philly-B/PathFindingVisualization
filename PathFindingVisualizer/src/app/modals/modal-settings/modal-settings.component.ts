import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColorSettings } from 'src/app/model/ColorSettings';
import { getSettingLabelForField } from 'src/app/utils/ColorMappingUtils';

@Component({
  selector: 'app-modal-settings',
  templateUrl: './modal-settings.component.html',
  styleUrls: ['./modal-settings.component.scss'],
})
export class ModalSettingsComponent implements OnInit {
  modiefieableColors: string[] = [];
  fieldNameToLabelMap = {};

  color: ThemePalette = 'primary';
  colorCtr: AbstractControl = new FormControl(null, [Validators.nullValidator]);

  constructor(
    public dialogRef: MatDialogRef<ModalSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public modifieableSettings: ModifieableSettings
  ) {
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

  ngOnInit(): void {}
}

export class ModifieableSettings implements ModifieableSettings {
  constructor(public colorSettings: ColorSettings) {}
}
