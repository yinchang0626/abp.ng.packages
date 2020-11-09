import { HttpRequest } from '@angular/common/http';
import { SpyObject } from '@ngneat/spectator';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Store } from '@ngxs/store';
import { OAuthService } from 'angular-oauth2-oidc';
import { Subject, timer } from 'rxjs';
import { StartLoader, StopLoader } from '../actions';
import { ApiInterceptor } from '../interceptors';
import { SessionStateService } from '../services';

describe('ApiInterceptor', () => {
  let spectator: SpectatorService<ApiInterceptor>;
  let interceptor: ApiInterceptor;
  let store: SpyObject<Store>;
  let oauthService: SpyObject<OAuthService>;
  let sessionState: SpyObject<SessionStateService>;

  const createService = createServiceFactory({
    service: ApiInterceptor,
    mocks: [OAuthService, Store, SessionStateService],
  });

  beforeEach(() => {
    spectator = createService();
    interceptor = spectator.service;
    store = spectator.inject(Store);
    sessionState = spectator.inject(SessionStateService);
    oauthService = spectator.inject(OAuthService);
  });

  it('should add headers to http request', done => {
    oauthService.getAccessToken.andReturn('ey892mkwa8^2jk');
    sessionState.getLanguage.andReturn('tr');
    sessionState.getTenant.andReturn({ id: 'Volosoft', name: 'Volosoft' });

    const request = new HttpRequest('GET', 'https://abp.io');
    const handleRes$ = new Subject();

    const handler = {
      handle: (req: HttpRequest<any>) => {
        expect(req.headers.get('Authorization')).toEqual('Bearer ey892mkwa8^2jk');
        expect(req.headers.get('Accept-Language')).toEqual('tr');
        expect(req.headers.get('__tenant')).toEqual('Volosoft');
        done();
        return handleRes$;
      },
    };

    interceptor.intercept(request, handler as any);

    handleRes$.next();
    handleRes$.complete();
  });

  it('should dispatch the loader', done => {
    const spy = jest.spyOn(store, 'dispatch');

    const request = new HttpRequest('GET', 'https://abp.io');
    const handleRes$ = new Subject();

    const handler = {
      handle: (req: HttpRequest<any>) => {
        return handleRes$;
      },
    };

    interceptor.intercept(request, handler as any).subscribe();

    handleRes$.next();
    handleRes$.complete();

    timer(0).subscribe(() => {
      expect(spy.mock.calls[0][0] instanceof StartLoader).toBeTruthy();
      expect(spy.mock.calls[1][0] instanceof StopLoader).toBeTruthy();
      done();
    });
  });
});
