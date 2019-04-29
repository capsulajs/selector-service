

Scenario: Call setItemsStream with stream of items and get items at subscription after one emission
    Given Selector Service with setItemsStream method
    And   user calls setItemsStream with a stream X
    And   stream X emits [A, B, C]
    When  user subscribes to items$
    Then  user receives [A, B, C]

Scenario: Call setItemsStream with stream of items and get items at subscription after two emissions
    Given Selector Service with setItemsStream method
    And   user calls setItemsStream with a stream X
    And   stream X emits [A, B, C]
    And   stream X emits [D, E, F]
    When  user subscribes to items$
    Then  user receives [D, E, F]

Scenario: Call setItemsStream with stream of items and get items after subscription and two emissions
    Given Selector Service with setItemsStream method
    And   user calls setItemsStream with a stream X
    And   stream X emits [A, B, C]
    And   user subscribes to items$
    And   user receives [A, B, C]
    When  stream X emits [D, E, F]
    Then  user receives [D, E, F]

Scenario: Call successively setItemsStream with two streams of items
    Given  Selector Service with setItemsStream method
    And    user calls setItemsStream with a stream X
    And    stream X emits [A, B, C]
    When   user calls setItemsStream with a stream Y
    And    user subscribes to items$
    And    stream Y emits [D, E, F]
    Then   user receives [D, E, F]

 Scenario: Call successively setItemsStream with two identical streams of items
    Given  Selector Service with setItemsStream method
    And    user calls setItemsStream with a stream X
    And    stream X emits [A, B, C]
    And    user calls setItemsStream with a stream Y
    And    user subscribes to items$
    When   stream Y emits [A, B, C]
    Then   user receives [A, B, C]

Scenario: Call setItemsStream with invalid items stream
   Given Selector Service with setItemsStream method
   And   user calls setItemsStream with an invalid stream of <items>
         |<items>           |
         |null              |
         |undefined         |
         |123               |
         |[]                |
         |true              |
         |{}                |
         |{ test: 'test'}   |
   Then  the promise is rejected with a relevant error

Scenario: selectItem selects one of the stored items in the Selector by key
    Given  Selector Service with selectItem method
    And    user calls setItemsStream with a stream X
    And    stream X emits [{key: A, value: valueA}, {key: B, value: valueB}, {key: C, value: valueC}]
    When   user calls selectItem method with {key: A}
    Then   the item A is selected
    And    subscribing to selectedItem will return the item A

Scenario: Call selectItem with invalid key
     Given Selector Service with selectItem method
     And   user calls selectItem with an invalid <key>
         |<key>             |
         |null              |
         |undefined         |
         |123               |
         |[]                |
         |true              |
         |{}                |
         |{ test: 'test'}   |
     Then the promise is rejected with a relevant error

Scenario: Call selectItem with a non-existent key
    Given  Selector Service with selectItem method
    And    user calls setItemsStream with a stream X
    And    stream X emits [{key: A, value: valueA}, {key: B, value: valueB}, {key: C, value: valueC}]
    When   user calls selectItem method with {key: D}
    Then   the promise is rejected with a relevant error

Scenario: selectedItems$ returns the selected item
    Given Selector Service with selectedItem method
    And    user calls setItemsStream with a stream X
    And    stream X emits [{key: A, value: valueA}, {key: B, value: valueB}, {key: C, value: valueC}]
    And    user subscribes to selectedItem method
    When   <item> is selected
         |<item>    |
         |{key: A}  |
         |{key: B}  |
         |{key: C}  |
    Then  selectedItem subscription emits successively the items A, B and C


