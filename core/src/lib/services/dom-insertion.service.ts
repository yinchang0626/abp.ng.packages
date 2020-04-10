import { Injectable, Injector } from '@angular/core';
import { ContentStrategy } from '../strategies/content.strategy';
import { generateHash } from '../utils';

@Injectable({ providedIn: 'root' })
export class DomInsertionService {
  readonly inserted = new Set<number>();

  constructor(private injector: Injector) {}

  insertContent(contentStrategy: ContentStrategy) {
    const hash = generateHash(contentStrategy.content);

    if (this.inserted.has(hash)) return;

    contentStrategy.insertElement();
    this.inserted.add(hash);
  }
}
