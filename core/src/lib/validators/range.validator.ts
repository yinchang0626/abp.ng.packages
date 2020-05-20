import { AbstractControl, ValidatorFn } from '@angular/forms';

export interface RangeError {
  max: number;
  min: number;
}

export interface RangeOptions {
  maximum?: number;
  minimum?: number;
}

export function validateRange({ maximum = Infinity, minimum = 0 }: RangeOptions = {}): ValidatorFn {
  return (control: AbstractControl): RangeError | null => {
    if (control.pristine) return null;

    if (['', null, undefined].indexOf(control.value) > -1) return { min: minimum, max: maximum };

    const value = Number(control.value);
    return getMinError(value, minimum, maximum) || getMaxError(value, maximum, minimum);
  };
}

function getMaxError(value: number, max: number, min: number): RangeError {
  return value > max ? { max, min } : null;
}

function getMinError(value: number, min: number, max: number): RangeError {
  return value < min ? { min, max } : null;
}
