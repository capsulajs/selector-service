import { ItemsRequest, SelectedItemRequest, SelectItemRequest, SelectorInterface, SetItemsRequest } from './api';
import { BehaviorSubject, Observable } from 'rxjs';

export class Selector<Item extends Key, Key> implements SelectorInterface<Item, Key> {
  private readonly data$: BehaviorSubject<Item[]>;
  private readonly selected$: BehaviorSubject<Item>;

  constructor() {
    this.data$ = new BehaviorSubject<Item[]>([]);
    this.selected$ = new BehaviorSubject<Item>({} as Item);
  }

  public setItems(setItemsRequest: SetItemsRequest<Item>): Promise<void> {
    return new Promise((resolve, reject) => {});
  }

  public items$(itemsRequest: ItemsRequest): Observable<Item[]> {
    return this.data$;
  }

  public selectItem(selectItemRequest: SelectItemRequest<Key>): Promise<void> {
    return new Promise((resolve, reject) => {});
  }

  public selectedItem$(selectedItemRequest: SelectedItemRequest): Observable<Item> {
    return this.selected$;
  }
}
