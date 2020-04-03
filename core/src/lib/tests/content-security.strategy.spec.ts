import {
  CONTENT_SECURITY_STRATEGY,
  LooseContentSecurityStrategy,
  StrictContentSecurityStrategy,
} from '../strategies';
import { uuid } from '../utils';

describe('LooseContentSecurityStrategy', () => {
  describe('#applyCSP', () => {
    it('should set nonce attribute', () => {
      const nonce = uuid();
      const strategy = new LooseContentSecurityStrategy(nonce);
      const element = document.createElement('link');
      strategy.applyCSP(element);

      expect(element.getAttribute('nonce')).toBe(nonce);
    });
  });
});

describe('StrictContentSecurityStrategy', () => {
  describe('#applyCSP', () => {
    it('should not set nonce attribute', () => {
      const strategy = new StrictContentSecurityStrategy();
      const element = document.createElement('link');
      strategy.applyCSP(element);

      expect(element.getAttribute('nonce')).toBeNull();
    });
  });
});

describe('CONTENT_SECURITY_STRATEGY', () => {
  test.each`
    name        | Strategy                         | nonce
    ${'Loose'}  | ${LooseContentSecurityStrategy}  | ${uuid()}
    ${'Strict'} | ${StrictContentSecurityStrategy} | ${undefined}
  `('should successfully map $name to $Strategy.name', ({ name, Strategy, nonce }) => {
    expect(CONTENT_SECURITY_STRATEGY[name](nonce)).toEqual(new Strategy(nonce));
  });
});
