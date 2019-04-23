

Scenario: Call setItemsStream with stream of items when Selector instance is empty
   Given Selector Service with setItemsStream method
   When  user calls setItemsStream with a stream of items
   Then  all items are being loaded in the Selector instance
   And   subscribing to items method returns the stored items

Scenario: Call setItemsStream with a stream of new items when Selector instance is not empty
   Given  Selector Service with setItemsStream method
   And    several items are stored in the Selector instance
   When   user calls setItemsStream with a stream of items that do not exist in the Selector instance
   Then   the old items are replaced with the new items
   And    subscribing to items method returns only the new stored ones

 Scenario: Call setItemsStream with a stream of items already stored in the Selector instance
   Given  Selector Service with setItemsStream method
   And    several items are stored in the Selector instance
   When   user calls setItemsStream with a stream containing the same items
   Then   the old items are replaced with the new items
   And    subscribing to items method returns only the new stored ones

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
   Then the call is rejected with a relevant error

Scenario: items$ returns all items stored in the Selector Service
    Given  Selector Service with items method
	And    several items are stored in the Selector instance
	When   user subscribes to items method with a valid request
	Then   the subscription will emit all stored items
	And    if new items are loaded meanwhile, the subscription will emit them as well

Scenario: selectItem selects one of the stored items in the Selector by key
     Given Selector Service with selectItem method
	 And   several items are stored in the Selector instance
	 When  user calls selectItem method with the key of one of the stored items
	 Then  the relevant item is selected
	 And   subscribing to selectItem will return the selected item

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
     Then the call is rejected with a relevant error

Scenario: Call selectItem with a non-existent key
     Given Selector Service with selectItem method
	 And   several items are stored in the Selector instance
	 When  user calls selectItem method with the key of an item that doesn't exist in the Selector instance
	 Then  the call is rejected with a relevant error

Scenario: selectedItems$ returns the selected item
     Given Selector Service with selectedItem method
	 And   item1 and item2 are stored in the Selector instance
	 When  user subscribes to selectedItem method
	 And   <item> is selected
	        |<item>|
			|none  |
			|item1 |
			|item2 |
	 Then  selectedItem subscription emits the result according to the selection


