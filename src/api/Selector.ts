import { Observable } from 'rxjs';

/**
 * Selector service provides a solution to input data, get it, select a part of it and get this selected part.
 * It takes two typed args: Key and Item.
 * Item is the type of the used object and Key is a subset of Item used to select a specific Item.
 */
export interface Selector<Item extends Key, Key> {
  /**
   * @typeparam SetItemsRequest
   *
   * The provided stream must be an array of items to be able to perform the selection later.
   *
   * @return A Promise that resolves without specific information.
   * Can be rejected in case of invalid argument is passed.
   */
  setItems(setItemsRequest: SetItemsRequest<Item>): Promise<void>;
  /**
   * @typeparam ItemRequest
   * @return An Observable sequence that describes updates of the stored items.
   */
  items$(itemsRequest: ItemsRequest): Observable<Item[]>;
  /**
   * @typeparam SelectItemRequest
   * @return A Promise that resolves without specific information.
   * Can be rejected in case of invalid argument is passed.
   * Can be rejected in case of the item you try to select is not in the stored items.
   * Can be rejected in case of the provided key is not included in the item model.
   */
  selectItem(selectItemRequest: SelectItemRequest<Key>): Promise<void>;
  /**
   * @typeparam SelectedItemRequest
   * @return An Observable sequence that describes updates of the selected item.
   */
  selectedItem$(selectedItemRequest: SelectedItemRequest): Observable<Item>;
}

export interface SetItemsRequest<Item> {
  items$: Observable<Item[]>;
}

export interface ItemsRequest {}

export interface SelectItemRequest<Key> {
  /** Must be at least part of the item model */
  key: Key;
}

export interface SelectedItemRequest {}