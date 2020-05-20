import { Validators } from '@angular/forms';
import { validateCreditCard } from './credit-card.validator';
import { validateRange } from './range.validator';
import { validateRequired } from './required.validator';
import { validateStringLength } from './string-length.validator';
export * from './credit-card.validator';
export * from './range.validator';
export * from './required.validator';
export * from './string-length.validator';

export const AbpValidators = {
  creditCard: validateCreditCard,
  email: () => Validators.email,
  range: validateRange,
  required: validateRequired,
  stringLength: validateStringLength,
};
