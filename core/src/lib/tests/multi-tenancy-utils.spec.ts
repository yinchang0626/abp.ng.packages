import { Component, Injector } from '@angular/core';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { Store } from '@ngxs/store';
import { MultiTenancyService } from '../services/multi-tenancy.service';
import { parseTenantFromUrl, getCurrentTenancyNameOrNull } from '../utils';
import * as multiTenancyUtils from '../utils/multi-tenancy-utils';
import { of, Subject, BehaviorSubject } from 'rxjs';
import { FindTenantResultDto } from '../models/find-tenant-result-dto';
import clone from 'just-clone';

const environment = {
  production: false,
  hmr: false,
  application: {
    baseUrl: 'https://{TENANCY_NAME}.volosoft.com',
    name: 'MyProjectName',
    logoUrl: '',
  },
  oAuthConfig: {
    issuer: 'https://{TENANCY_NAME}.api.volosoft.com',
    clientId: 'MyProjectName_App',
    dummyClientSecret: '1q2w3e*',
    scope: 'MyProjectName',
    oidc: false,
    requireHttps: true,
  },
  apis: {
    default: {
      url: 'https://{TENANCY_NAME}.api.volosoft.com',
    },
    abp: {
      url: 'https://api.volosoft.com/{TENANCY_NAME}',
    },
  },
};

const setHref = url => {
  global.window = Object.create(window);
  delete window.location;
  Object.defineProperty(window, 'location', {
    value: {
      href: url,
    },
  });
};

@Component({
  selector: 'abp-dummy',
  template: '',
})
export class DummyComponent {}

describe('MultiTenancyUtils', () => {
  let spectator: Spectator<DummyComponent>;
  const createComponent = createComponentFactory({
    component: DummyComponent,
    mocks: [Store, MultiTenancyService],
  });

  beforeEach(() => (spectator = createComponent()));

  describe('#getCurrentTenancyNameOrNull', () => {
    test('should get tenancy name from href', async () => {
      setHref('https://abp.volosoft.com/');
      expect(getCurrentTenancyNameOrNull('https://{TENANCY_NAME}.volosoft.com')).toBe('abp');

      setHref('https://volosoft.com/');
      expect(getCurrentTenancyNameOrNull('https://{TENANCY_NAME}.com')).toBe('volosoft');

      setHref('https://volosoft.com/abp/');
      expect(getCurrentTenancyNameOrNull('https://volosoft.com/{TENANCY_NAME}')).toBe('abp');
    });
  });

  describe('#parseTenantFromUrl', () => {
    test('should get the tenancyName, set replaced environment and call the findTenantByName method of MultiTenancyService', async () => {
      const injector = spectator.inject(Injector);
      const injectorSpy = jest.spyOn(injector, 'get');
      const store = spectator.inject(Store);
      const selectSnapshotSpy = jest.spyOn(store, 'selectSnapshot');
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      const multiTenancyService = spectator.inject(MultiTenancyService);
      const findTenantByNameSpy = jest.spyOn(multiTenancyService, 'findTenantByName');

      injectorSpy.mockReturnValueOnce(spectator.inject(Store));
      injectorSpy.mockReturnValueOnce(multiTenancyService);
      selectSnapshotSpy.mockReturnValue(clone(environment));

      setHref('https://abp.volosoft.com/');

      dispatchSpy.mockReturnValue(new BehaviorSubject(true));
      findTenantByNameSpy.mockReturnValue(
        new BehaviorSubject({ name: 'abp', tenantId: '1', success: true } as FindTenantResultDto),
      );

      parseTenantFromUrl(injector);

      const replacedEnv = {
        ...environment,
        application: { ...environment.application, baseUrl: 'https://abp.volosoft.com' },
        oAuthConfig: { ...environment.oAuthConfig, issuer: 'https://abp.api.volosoft.com' },
        apis: {
          default: {
            url: 'https://abp.api.volosoft.com',
          },
          abp: {
            url: 'https://api.volosoft.com/abp',
          },
        },
      };

      expect(dispatchSpy).toHaveBeenCalledWith({ environment: replacedEnv });
      expect(findTenantByNameSpy).toHaveBeenCalledWith('abp', { __tenant: '' });
      expect(multiTenancyService.domainTenant).toEqual({ id: '1', name: 'abp' });
    });
  });
});
