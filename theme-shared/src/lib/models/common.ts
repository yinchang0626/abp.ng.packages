import { Type } from '@angular/core';

export interface RootParams {
  httpErrorConfig: HttpErrorConfig;
}

export type ErrorScreenErrorCodes = 401 | 403 | 404 | 500;

export interface HttpErrorConfig {
  skipHandledErrorCodes?: ErrorScreenErrorCodes[];
  errorScreen?: {
    component: Type<any>;
    forWhichErrors?: ErrorScreenErrorCodes[];
    hideCloseIcon?: boolean;
  };
}
