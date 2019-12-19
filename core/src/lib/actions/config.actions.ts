import { ABP } from '../models';

export class PatchRouteByName {
  static readonly type = '[Config] Patch Route By Name';
  constructor(public name: string, public newValue: Partial<ABP.Route>) {}
}

export class GetAppConfiguration {
  static readonly type = '[Config] Get App Configuration';
}

export class AddRoute {
  static readonly type = '[Config] Add Route';
  constructor(public payload: Omit<ABP.Route, 'children'>) {}
}
