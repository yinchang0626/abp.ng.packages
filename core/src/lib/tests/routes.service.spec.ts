import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { GetAppConfiguration } from '../actions';
import { RoutesService } from '../services';

describe('Routes Service', () => {
  let service: RoutesService;
  const routes = [
    { path: '/foo', name: 'foo' },
    { path: '/foo/bar', name: 'bar', parentName: 'foo', invisible: true, order: 2 },
    { path: '/foo/bar/baz', name: 'baz', parentName: 'bar', order: 1 },
    { path: '/foo/x', name: 'x', parentName: 'foo', order: 1 },
  ];

  const mockActions = new Subject();
  const mockStore = ({
    selectSnapshot() {
      return true;
    },
  } as unknown) as Store;

  beforeEach(() => {
    service = new RoutesService(mockActions, mockStore);
  });

  describe('#add', () => {
    it('should add given routes as flat$, tree$, and visible$', async () => {
      service.add(routes);

      const flat = await service.flat$.pipe(take(1)).toPromise();
      const tree = await service.tree$.pipe(take(1)).toPromise();
      const visible = await service.visible$.pipe(take(1)).toPromise();

      expect(flat.length).toBe(4);
      expect(flat[0].name).toBe('foo');
      expect(flat[1].name).toBe('baz');
      expect(flat[2].name).toBe('x');
      expect(flat[3].name).toBe('bar');

      expect(tree.length).toBe(1);
      expect(tree[0].name).toBe('foo');
      expect(tree[0].children.length).toBe(2);
      expect(tree[0].children[0].name).toBe('x');
      expect(tree[0].children[1].name).toBe('bar');
      expect(tree[0].children[1].children[0].name).toBe('baz');

      expect(visible.length).toBe(1);
      expect(visible[0].name).toBe('foo');
      expect(visible[0].children.length).toBe(1);
      expect(visible[0].children[0].name).toBe('x');
    });
  });

  describe('#remove', () => {
    it('should remove routes based on given routeNames', () => {
      service.add(routes);
      service.remove(['bar']);

      const flat = service.flat;
      const tree = service.tree;
      const visible = service.visible;

      expect(flat.length).toBe(2);
      expect(flat[0].name).toBe('foo');
      expect(flat[1].name).toBe('x');

      expect(tree.length).toBe(1);
      expect(tree[0].name).toBe('foo');
      expect(tree[0].children.length).toBe(1);
      expect(tree[0].children[0].name).toBe('x');

      expect(visible.length).toBe(1);
      expect(visible[0].name).toBe('foo');
      expect(visible[0].children.length).toBe(1);
      expect(visible[0].children[0].name).toBe('x');
    });
  });

  describe('#patch', () => {
    it('should patch propeties of routes based on given routeNames', () => {
      service['isGranted'] = jest.fn(route => route.requiredPolicy !== 'X');
      service.add(routes);
      service.patch('x', { requiredPolicy: 'X' });

      const flat = service.flat;
      const tree = service.tree;
      const visible = service.visible;

      expect(flat.length).toBe(4);
      expect(flat[0].name).toBe('foo');
      expect(flat[1].name).toBe('baz');
      expect(flat[2].name).toBe('x');
      expect(flat[3].name).toBe('bar');

      expect(tree.length).toBe(1);
      expect(tree[0].name).toBe('foo');
      expect(tree[0].children.length).toBe(2);
      expect(tree[0].children[0].name).toBe('x');
      expect(tree[0].children[1].name).toBe('bar');
      expect(tree[0].children[1].children[0].name).toBe('baz');

      expect(visible.length).toBe(1);
      expect(visible[0].name).toBe('foo');
      expect(visible[0].children.length).toBe(0);
    });

    it('should return false when route name is not found', () => {
      service.add(routes);
      const result = service.patch('A man has no name.', { invisible: true });
      expect(result).toBe(false);
    });
  });

  describe('#refresh', () => {
    it('should call add once with empty array', () => {
      const add = jest.spyOn(service, 'add');
      service.refresh();
      expect(add).toHaveBeenCalledTimes(1);
      expect(add).toHaveBeenCalledWith([]);
    });

    it('should be called upon successful GetAppConfiguration action', () => {
      const refresh = jest.spyOn(service, 'refresh');
      mockActions.next({ action: new GetAppConfiguration(), status: 'SUCCESSFUL' });
      expect(refresh).toHaveBeenCalledTimes(1);
    });
  });

  describe('#search', () => {
    it('should return node found based on query', () => {
      service.add(routes);
      const result = service.search({ invisible: true });
      expect(result.name).toBe('bar');
      expect(result.children.length).toBe(1);
      expect(result.children[0].name).toBe('baz');
    });

    it('should return null when query is not found', () => {
      service.add(routes);
      const result = service.search({ requiredPolicy: 'X' });
      expect(result).toBe(null);
    });
  });
});
