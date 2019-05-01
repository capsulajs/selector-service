import { BehaviorSubject, from, Subject } from 'rxjs';

describe('Selector service test suite', () => {
  let selector: SelectorService;

  beforeEach(() => {
    selector = new SelectorService();
  });

  const mockedItems1234 = [
    [
      { itemKey: 'item1', itemValue: 'some value of item1' },
      { itemKey: 'item2', itemValue: 'some value of item2' },
      { itemKey: 'item3', itemValue: 'some value of item3' },
      { itemKey: 'item4', itemValue: 'some value of item4' },
    ],
  ];

  const mockedItems5678 = [
    [
      { itemKey: 'item5', itemValue: 'some value of item5' },
      { itemKey: 'item6', itemValue: 'some value of item6' },
      { itemKey: 'item7', itemValue: 'some value of item7' },
      { itemKey: 'item8', itemValue: 'some value of item8' },
    ],
  ];

  const mockedItemsCombined = [
    [
      { itemKey: 'item1', itemValue: 'some value of item1' },
      { itemKey: 'item2', itemValue: 'some value of item2' },
      { itemKey: 'item3', itemValue: 'some value of item3' },
      { itemKey: 'item4', itemValue: 'some value of item4' },
    ],
    [
      { itemKey: 'item5', itemValue: 'some value of item5' },
      { itemKey: 'item6', itemValue: 'some value of item6' },
      { itemKey: 'item7', itemValue: 'some value of item7' },
      { itemKey: 'item8', itemValue: 'some value of item8' },
    ],
  ];

  it('Call setItemsStream with stream of items and get items at subscription after one emission', async (done) => {
    expect.assertions(1);
    const mockedStream = from(mockedItems1234);
    await selector.setItemsStream({ items$: mockedStream });
    selector.items$({}).subscribe((items: any) => {
      expect(items).toEqual(mockedItems1234);
      done();
    });
  });

  it('Call setItemsStream with stream of items and get items at subscription after two emissions', async (done) => {
    expect.assertions(1);
    const stream = new BehaviorSubject({});
    selector.setItemsStream({ items$: stream });
    stream.next(mockedItems1234);
    stream.next(mockedItems5678);

    selector.items({}).subscribe((items: any) => {
      expect(items).toEqual(mockedItems5678);
      done();
    });
  });

  it('Call setItemsStream with stream of items and get items after subscription and two emissions', async (done) => {
    expect.assertions(2);
    const stream = new BehaviorSubject({});
    selector.setItemsStream({ items$: stream });
    stream.next(mockedItems1234);
    let count = 0;

    selector.items({}).subscribe((items: any) => {
      switch (count) {
        case 0:
          expect(items).toEqual(mockedItems1234);
          break;
        case 1:
          expect(items).toEqual(mockedItems5678);
          done();
      }
      count = count + 1;
    });

    stream.next(mockedItems5678);
  });

  it('Call successively setItemsStream with two streams of items', async () => {
    expect.assertions(1);
    const mockedStream1 = from(mockedItems1234);
    const mockedStream2 = from(mockedItems5678);
    await selector.setItemsStream({ items$: mockedStream1 });
    await selector.setItemsStream({ items$: mockedStream2 });
    selector.items$({}).subscribe((items) => {
      expect(items).toEqual(mockedItems5678);
    });
  });

  it('Call successively setItemsStream with two identical streams of items', async () => {
    expect.assertions(1);
    const mockedStream1 = from(mockedItems1234);
    const mockedStream2 = from(mockedItems1234);
    await selector.setItemsStream({ items$: mockedStream1 });
    await selector.setItemsStream({ items$: mockedStream2 });
    selector.items$({}).subscribe((items) => {
      expect(items).toEqual(mockedItems1234);
    });
  });

  it('Call setItemsStream with invalid items stream', async () => {
    expect.assertions(7);
    const invalidItemsStreams = [null, undefined, 123, [], true, {}, { test: 'test' }];
    invalidItemsStreams.forEach(async (stream: any) => {
      const items$ = from(stream);
      await expect(selector.setItemsStream({ items$ })).rejects.toEqual(invalidSetItemsStreamRequest);
    });
  });

  it('selectItem selects one of the stored items in the Selector by key', async (done) => {
    expect.assertions(1);
    await selector.setItemsStream({ items$: from(mockedItems1234) });
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
    await selector.setItemsStream({ items$: from(mockedItems1234) });
    await expect(selector.selectItem({ key: { itemKey: 'item5' } })).rejects.toEqual(itemNotFound);
  });

  it('selectedItems$ returns the selected item', async (done) => {
    expect.assertions(3);
    await selector.setItemsStream({ items$: from(mockedItems1234) });
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
