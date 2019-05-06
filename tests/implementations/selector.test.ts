import { Selector as SelectorInterface } from '../../src/api/Selector';
import { avengers, beatles, Character, SimpleCharacterKey } from '../mocks/items';
import { Selector } from '../../src';
import { errorMessages, validationMessages } from '../../src/helpers/messages';

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

  const invalidItems = [null, undefined, 123, true, {}, { test: 'test' }];

  it.each(invalidItems)('Call setItems with invalid items: %j', async (items) => {
    expect.assertions(1);
    // @ts-ignore
    return expect(selector.setItems({ items })).rejects.toEqual(new Error(validationMessages.invalidSetItemsRequest));
  });

  it('selectItem selects one of the stored items in the Selector by key', async (done) => {
    expect.assertions(1);
    await selector.setItems({ items: beatles });
    await selector.selectItem({ key: { name: 'Paul' } });
    selector.selectedItem$({}).subscribe((item: any) => {
      expect(item).toEqual(beatles[1]);
      done();
    });
  });

  const invalidSelectItemRequestKey = [null, undefined, 123, [], true, {}, { test: 'test' }];

  it.each(invalidSelectItemRequestKey)('Call selectItem with invalid key: %j', async (key) => {
    expect.assertions(1);
    await selector.setItems({ items: beatles });
    // @ts-ignore
    await expect(selector.selectItem({ key })).rejects.toEqual(new Error(validationMessages.invalidSelectItemRequest));
  });

  it('Call selectItem with a non-existent key', async () => {
    expect.assertions(1);
    await selector.setItems({ items: beatles });
    await expect(selector.selectItem({ key: { name: 'Freddy' } })).rejects.toEqual(
      new Error(errorMessages.itemNotFound)
    );
  });

  it('selectedItems$ returns the selected item', async (done) => {
    expect.assertions(4);
    await selector.setItems({ items: beatles });
    let count = 0;
    selector.selectedItem$({}).subscribe((item) => {
      switch (count) {
        case 0:
          expect(item).toEqual({});
          break;
        case 1:
          expect(item).toEqual(beatles[0]);
          break;
        case 2:
          expect(item).toEqual(beatles[1]);
          break;
        case 3:
          expect(item).toEqual(beatles[2]);
          done();
      }
      count = count + 1;
    });
    await selector.selectItem({ key: { name: 'John' } });
    await selector.selectItem({ key: { name: 'Paul' } });
    await selector.selectItem({ key: { name: 'George' } });
  });

  it('Call selectItem with currently selected item', async () => {
    expect.assertions(1);
    await selector.setItems({ items: beatles });
    await selector.selectItem({ key: { name: 'Ringo' } });
    await expect(selector.selectItem({ key: { name: 'Ringo' } })).rejects.toEqual(
      new Error(errorMessages.itemAlreadySelected)
    );
  });

  it('Call selectItem when no data in selector', () => {
    expect.assertions(1);
    return expect(selector.selectItem({ key: { name: 'Ringo' } })).rejects.toEqual(new Error(errorMessages.noData));
  });
});
