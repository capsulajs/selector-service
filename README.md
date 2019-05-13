## Selector service

Selector service for the [CapsulaHub](https://github.com/capsulajs/capsula-hub).

The purpose of this service is to provide a utility tool that allows user to select a specific data 
inside a collection of data.

### Install

`npm i @capsula-hub/selector-service` or `yarn add @capsula-hub/selector-service`

### API

| method          | description                                                      |
| --------------- | ---------------------------------------------------------------- |
| `setItems`      | set array of Items in the Selector instance                      |
| `items$`        | get Observable of Items array currently in the Selector instance |
| `selectItem`    | define an Item from items$ as selected Item                      |
| `selectedItem$` | get Observable of currently selected Item                        |

### Example

This service takes two typed elements (`Item` and `Key`).

```typescript
import { Selector } from '@capsula-hub/selector-service';

interface Item {
  name: string;
  age: number;
  role: string;
}

interface Key {
  name: string;
}

const data = [
  { name: 'Pim', age: 22, role: 'first' },
  { name: 'Pam', age: 42, role: 'second' },
  { name: 'Pom', age: 32, role: 'third' },
];
// Init selector with typed elements
const selector = new Selector<Item, Key>();
// Fill the selector with data
selector.setItems({ items: data })
  .then(() => console.log(`setItems completed`));
// Subscribe to selector's data
selector.items$({}).subscribe(console.log);
// Output 
// [ { name: 'Pim', age: 22, role: 'first' },
//   { name: 'Pam', age: 42, role: 'second' },
//   { name: 'Pom', age: 32, role: 'third' } ]

// Select an Item
selector.selectItem({ key: { name: 'Pim' }})
  .then(() => console.log(`Item selected`));
// Subscribe to selector selected item
selector.selectedItem$({}).subscribe(console.log);
// Output
// { name: 'Pim', age: 22, role: 'first' }
```

### Test

`npm run test` or `yarn test`

### Contribute

Fork this repo and open a PR.

### Licence

[CapsulaHub](https://github.com/capsulajs/capsula-hub) and related services are released under MIT Licence.
