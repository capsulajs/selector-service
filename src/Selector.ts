import { ItemsRequest, SelectedItemRequest, SelectItemRequest, SelectorInterface, SetItemsRequest } from './api';
import { BehaviorSubject, Observable } from 'rxjs';
import { validationMessages, errorMessages } from './helpers/messages';
import { isValidSelectRequest, isValidSetItemsRequest } from './helpers/validators';
import { map, take } from 'rxjs/operators';
import isMatch from 'lodash/isMatch';
import isEmpty from 'lodash/isEmpty';

export class Selector<Item extends Key, Key> implements SelectorInterface<Item, Key> {
  private readonly data$: BehaviorSubject<Item[]>;
  private readonly selected$: BehaviorSubject<Item>;

  constructor() {
    this.data$ = new BehaviorSubject<Item[]>([]);
    this.selected$ = new BehaviorSubject<Item>({} as Item);
  }

  public setItems(setItemsRequest: SetItemsRequest<Item>): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!isValidSetItemsRequest(setItemsRequest)) {
        return reject(new Error(validationMessages.invalidSetItemsRequest));
      }
      this.resetSelected(setItemsRequest.items);
      this.data$.next(setItemsRequest.items);
      return resolve();
    });
  }

  public items$(itemsRequest: ItemsRequest): Observable<Item[]> {
    return this.data$;
  }

  public selectItem(selectItemRequest: SelectItemRequest<Key>): Promise<void> {
    return new Promise((resolve, reject) => {
      // Reject case: no data has been set in Selector
      if (this.data$.getValue().length === 0) {
        return reject(new Error(errorMessages.noData));
      }
      // Reject case: selectItemRequest is not valid
      if (!isValidSelectRequest(selectItemRequest)) {
        return reject(new Error(validationMessages.invalidSelectItemRequest));
      }
      // Reject case: Item is already selected
      if (isMatch(this.selected$.getValue() as any, selectItemRequest.key as any)) {
        return reject(new Error(errorMessages.itemAlreadySelected));
      }

      this.data$
        .pipe(
          take(1),
          map((items) =>
            items.find((item: Item) => {
              return isMatch(item as any, selectItemRequest.key as any);
            })
          )
        )
        .subscribe((item: any) => {
          if (!item) {
            // Rejection case: wanted Item not found
            return reject(new Error(errorMessages.itemNotFound));
          }
          this.selected$.next(item);
          return resolve();
        });
    });
  }

  public selectedItem$(selectedItemRequest: SelectedItemRequest): Observable<Item> {
    return this.selected$;
  }

  private resetSelected(items: Item[]): void {
    const selected = this.selected$.getValue();
    if (!isEmpty(selected)) {
      const shouldKeepSelection = items.some((item) => isMatch(item as any, selected as any));
      if (!shouldKeepSelection) {
        this.selected$.next({} as Item);
      }
    }
  }
}
