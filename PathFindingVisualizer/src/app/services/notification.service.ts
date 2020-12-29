import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  public notifyError(errorMessage: string) {
    this.toastr.error(errorMessage, 'Error');
  }

  public notifyWarning(warningMessage: string) {
    this.toastr.warning(warningMessage, 'Warning');
  }

  public notifySuccess(successMessage: string) {
    this.toastr.success(successMessage, 'Info');
  }
}
