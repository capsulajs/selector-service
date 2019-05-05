import { BehaviorSubject, from } from 'rxjs';
import { Selector as SelectorInterface } from '../../src/api/Selector';
import { avengers, beatles, Character, SimpleCharacterKey } from '../mocks/items';
import { Selector } from '../../src';

describe('Selector service test suite', () => {
  let selector: SelectorInterface<Character, SimpleCharacterKey>;

  beforeEach(() => {
    selector = new Selector<Character, SimpleCharacterKey>();
  });

  it('Call setItems with items and get items at subscription after one emission', async (done) => {
    expect.assertions(1);
    await selector.setItems({ items: beatles });
    selector.items$({}).subscribe((items: any) => {
      expect(items).toEqual(beatles);
      done();
    });
  });

  it('Call setItems with items successively and get items after subscription', async (done) => {
    expect.assertions(2);
    await selector.setItems({ items: beatles });

    let count = 0;

    selector.items$({}).subscribe((items: any) => {
      switch (count) {
        case 0:
          expect(items).toEqual(beatles);
          break;
        case 1:
          expect(items).toEqual(avengers);
          done();
      }
      count = count + 1;
    });

    await selector.setItems({ items: avengers });
  });

  it('Call setItems with invalid items', async () => {
    expect.assertions(7);
    const invalidItemsStreams = [null, undefined, 123, [], true, {}, { test: 'test' }];
    invalidItemsStreams.forEach(async (stream: any) => {
      const items$ = from(stream);
      await expect(selector.setItems({ items$ })).rejects.toEqual(invalidSetItemsStreamRequest);
    });
  });

  it('selectItem selects one of the stored items in the Selector by key', async (done) => {
    expect.assertions(1);
    await selector.setItems({ items$: from(mockedItems1234) });
    selector.selectedItem$.subscribe((item) => {
      expect(item).toEqual(mockedItems1234[0][0]);
      done();
    });
    await selector.selectItem({ key: { itemKey: 'item1' } });
  });

  it('Call selectItem with invalid key', async () => {
    expect.assertions(7);
    const invalidSelectItemRequestKey = [null, undefined, 123, [], true, {}, { test: 'test' }];
    invalidSelectItemRequestKey.forEach(async (key: any) => {
      const request = { key };
      await expect(selector.selectItem({ request })).rejects.toEqual(invalidSelectItemRequest);
    });
  });

  it('Call selectItem with a non-existent key', async () => {
    expect.assertions(1);
    await selector.setItems({ items$: from(mockedItems1234) });
    await expect(selector.selectItem({ key: { itemKey: 'item5' } })).rejects.toEqual(itemNotFound);
  });

  it('selectedItems$ returns the selected item', async (done) => {
    expect.assertions(3);
    await selector.setItems({ items$: from(mockedItems1234) });
    let count = 0;
    selector.selectedItem$.subscribe((item) => {
      switch (count) {
        case 0:
          expect(item).toEqual(mockedItems1234[0][0]);
          break;
        case 1:
          expect(item).toEqual(mockedItems1234[0][1]);
          break;
        case 2:
          expect(item).toEqual(mockedItems1234[0][2]);
          done();
      }
      count = count + 1;
    });
    await selector.selectItem({ key: { itemKey: 'item1' } });
    await selector.selectItem({ key: { itemKey: 'item2' } });
    await selector.selectItem({ key: { itemKey: 'item3' } });
  });
});
