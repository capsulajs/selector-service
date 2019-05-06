import { ItemsRequest, SelectedItemRequest, SelectItemRequest, SelectorInterface, SetItemsRequest } from './api';
import { BehaviorSubject, Observable } from 'rxjs';
import { validationMessages, errorMessages } from './helpers/messages';
import { isValidSelectRequest, isValidSetItemsRequest } from './helpers/validators';
import { map, take } from 'rxjs/operators';

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

      const requestKeys = Object.keys(selectItemRequest.key);
      // Reject case: Key is not a subset of Item
      if (
        requestKeys.every((requestKey: any) => {
          return (
            Object.keys(this.selected$.getValue()).includes(requestKey) &&
            // @ts-ignore
            this.selected$.getValue()[requestKey] === selectItemRequest.key[requestKey]
          );
        })
      ) {
        return reject(new Error(errorMessages.itemAlreadySelected));
      }

      this.data$
        .pipe(
          take(1),
          map((items) =>
            items.find((item, index) => {
              const itemKeys = Object.keys(item);
              return requestKeys.every((requestKey) => {
                return itemKeys.some(
                  (itemKey) =>
                    itemKey.includes(requestKey) &&
                    // @ts-ignore
                    items[index][itemKey] === selectItemRequest.key[requestKey]
                );
              });
            })
          )
        )
        .subscribe((item: any) => {
          if (!item) {
            // Rejection case: wanted Item not
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
}
