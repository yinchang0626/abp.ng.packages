import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'abp-paginator',
  templateUrl: 'paginator.component.html',
})
export class PaginatorComponent implements OnInit {
  private _value = 1;
  @Input()
  get value(): number {
    return this._value;
  }
  set value(newValue: number) {
    if (newValue < 1) return;
    else if (newValue > this.totalPages) return;

    this._value = newValue;
    this.valueChange.emit(newValue);
  }

  @Output()
  readonly valueChange = new EventEmitter<number>();

  @Input()
  totalPages = 0;

  get pageArray(): number[] {
    const count = this.totalPages < 5 ? this.totalPages : 5;

    if (this.value === 1 || this.value === 2) {
      return Array.from(new Array(count)).map((_, index) => index + 1);
    } else if (this.value === this.totalPages || this.value === this.totalPages - 1) {
      return Array.from(new Array(count)).map((_, index) => this.totalPages - count + 1 + index);
    } else {
      return [this.value - 2, this.value - 1, this.value, this.value + 1, this.value + 2];
    }
  }

  ngOnInit() {
    if (!this.value || this.value < 1 || this.value > this.totalPages) {
      this.value = 1;
    }
  }

  changePage(page: number) {
    if (page < 1) return;
    else if (page > this.totalPages) return;

    this.value = page;
  }
}
