
Scenario: Call setItems with items and get items at subscription after one emission
    Given Selector Service with setItems method
    And   user calls setItems with [A, B, C]
    When  user subscribes to items$
    Then  user receives [A, B, C]

Scenario: Call setItems with items successively and get items after subscription
    Given Selector Service with setItems method
    And   user calls setItems with [A, B, C]
    And   user subscribes to items$
    And   user receives [A, B, C]
    When  user calls setItems with [D, E, F]
    Then  user receives [D, E, F]

Scenario: Call setItems with invalid items
   Given Selector Service with setItems method
   And   user calls setItems with an invalid <items>
         |<items>           |
         |null              |
         |undefined         |
         |123               |
         |true              |
         |{}                |
         |{ test: 'test'}   |
   Then  the promise is rejected with a relevant error

Scenario: selectItem selects one of the stored items in the Selector by key
    Given  Selector Service with selectItem method
    And    user calls setItems with [{key: A, value: valueA}, {key: B, value: valueB}, {key: C, value: valueC}]
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
    And    user calls setItems with [{key: A, value: valueA}, {key: B, value: valueB}, {key: C, value: valueC}]
    When   user calls selectItem method with {key: D}
    Then   the promise is rejected with a relevant error

Scenario: selectedItems$ returns the selected item
    Given Selector Service with selectedItem method
    And    user calls setItems with [{key: A, value: valueA}, {key: B, value: valueB}, {key: C, value: valueC}]
    And    user subscribes to selectedItem method
    When   <item> is selected
         |<item>    |
         |{key: A}  |
         |{key: B}  |
         |{key: C}  |
    Then  selectedItem subscription emits successively the items A, B and C


