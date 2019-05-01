import { Observable } from 'rxjs';

/**
 * Selector service provides a solution to temporarily store data and select a part of it.
 */
export interface Selector<Item extends Key, Key> {
  /**
   * @typeparam SetItemsStreamRequest
   *
   * The provided stream must be an array of items to be able to perform the selection later.
   *
   * @return A Promise that resolves without specific information.
   * Can be rejected in case of invalid argument is passed.
   */
  setItemsStream(setItemsStreamRequest: SetItemsStreamRequest<Item>): Promise<void>;
  /**
   * @typeparam ItemRequest
   * @return An Observable sequence that describes updates of the stored items.
   */
  items$(itemsRequest: ItemsRequest): Observable<Item[]>;
  /**
   * @typeparam SelectItemRequest
   * @return A Promise that resolves with the selected item.
   * Can be rejected in case of invalid argument is passed.
   * Can be rejected in case of the item you try to select is not in the stored items.
   * Can be rejected in case of the provided key is not included in the item model.
   */
  selectItem(selectItemRequest: SelectItemRequest<Key>): Promise<Item>;
  /**
   * @typeparam SelectedItemRequest
   * @return An Observable sequence that describes updates of the selected item.
   */
  selectedItem$(selectedItemRequest: SelectedItemRequest): Observable<Item>;
}

export interface SetItemsStreamRequest<Item> {
  items$: Observable<Item[]>;
}

export interface ItemsRequest {}

export interface SelectItemRequest<Key> {
  /** Must be at least part of the item model */
  key: Key;
}

export interface SelectedItemRequest {}
