# Managing Shopping List Technical Documentation

## Overview
A Vue.js web application with PouchDB/Cloudant synchronization for managing location-aware shopping lists. Features include:
- CRUD operations for lists
- OpenStreetMap integration for location tagging


## Architecture

### Frontend
- **Vue.js** (v2) with Vue Material components
- PouchDB for local data storage
- OpenStreetMap Nominatim API for location search

### Data Models

#### Shopping List (`type: "list"`)
```javascript
{
  "_id": "list:<CUID>",
  "type": "list",
  "version": 1,
  "title": "Groceries",
  "checked": false,
  "place": {
    "title": "Central Market",
    "license": "CC BY-SA 4.0",
    "lat": 40.7128,
    "lon": -74.0060,
    "address": {
      "road": "Broadway",
      "city": "New York",
      // ...other OSM address components
    }
  },
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

### Shopping List Management
**Create List**
```javascript
onClickAddShoppingList: function() {

      // open shopping list form
      this.singleList = JSON.parse(JSON.stringify(sampleShoppingList));
      this.singleList._id = 'list:' + cuid();
      this.singleList.createdAt = new Date().toISOString();
      this.pagetitle = 'New Shopping List';
      this.places = [];
      this.selectedPlace = null;
      this.mode='addlist';
    },
```

When the Add Shopping button is called it sets the mode to 'addlist' to reveal the add shopping list form and resets the form variables.


```html
<main class="main-content">

      <!-- add new shopping list form-->
      <md-card v-if="mode == 'addlist'">
        <md-card-header>Add Shopping List</md-card-header>
        <md-card-content>
          <!-- shopping list name -->
          <md-input-container>
            <label>List name</label>
            <md-input placeholder="e.g. Food" v-model="singleList.title"></md-input>
          </md-input-container>   
          
          <!-- shopping place name -->
          <md-input-container>
            <label>Place name</label>
            <md-input placeholder="e.g. Whole Foods, Reno" v-model="singleList.place.title"></md-input>
            <md-button class="md-raised" v-bind:disabled="singleList.place.title.length==0" v-on:click="onClickLookup">Lookup</md-button>             
          </md-input-container>   

          <!-- shopping place pull-down list -->
          <md-input-container v-if="places.length > 1">
            <label for="movie">Choose address</label>
            <md-select v-bind="selectedPlace" v-on:change="onChangePlace" v-bind:disabled="places.length == 0">
              <md-option v-for="place in places" :key="place.place_id" v-bind:value="place.place_id">{{ place.display_name }}</md-option>
            </md-select>
          </md-input-container>

          <!-- ........ -->

```
In the form you can enter a title for the List and using the OpenStreetMap API you can lookup an adress. 

**Delete List**
```javascript
onClickDelete: function(id) {
  var match = this.findDoc(this.shoppingLists, id);
  db.remove(match.doc).then(() => {
    this.shoppingLists.splice(match.i, 1);
  });
},
```

This function is called when the delete button is pressed next to a shopping list.
The shopping list document is located, removed from PouchDB and removed from Vue's shoppingLists array.

**Edit List**
```javascript
onClickList: function(id, title) {
  this.currentListId = id;
  this.pagetitle = title;
  this.mode = 'itemedit';
},
```
This function is called when the user wants to edit the contents of a shopping list. The mode is set to 'itemedit'. Vue's currentListId is set to this list's id field.

### Test Environment

- ** Jest **
- **Browser**: Chrome
- **Database**: PouchDB (IndexedDB) with Cloudant Sync
- **Network**: Online & Offline mode

## Test Cases

### 1. Creating a New Shopping List

**Objective:** Verify that a user can successfully create a new shopping list and store it in IndexedDB.

```javascript
test('Creates a new shopping list', async () => {
  render(
    <MemoryRouter>
      <NewShoppingListButton />
    </MemoryRouter>
  );

  // Open the "New List" form
  await user.click(screen.getByTestId('new-list-button'));

  // Enter details
  const nameInput = screen.getByLabelText('Name');
  const descriptionInput = screen.getByLabelText('Description');
  await user.type(nameInput, 'New List');
  await user.type(descriptionInput, 'Fresh groceries');

  // Submit form
  await user.click(screen.getByText('Add'));

  // Ensure addList function was called with correct parameters
  await waitFor(() => {
    expect(addList).toHaveBeenCalledWith(
      'New List',
      'Fresh groceries',
      expect.any(Object)
    );
  });
});
```

### Editing an Existing Shopping List
**Objective**: Ensure users can rename lists and modify details.

```javascript
test('Renames a list and modifies details', async () => {
  render(
    <MemoryRouter>
      <ShoppingListButton list={sampleList} />
    </MemoryRouter>
  );

  // Open options dropdown
  await user.click(screen.getByTestId('list-options'));

  // Select "Edit name"
  await user.click(screen.getByText('Edit name'));

  // Update name
  const input = screen.getByRole('textbox');
  await user.clear(input);
  await user.type(input, 'Updated Groceries');

  // Save changes
  await user.click(screen.getByText('Save'));

  // Verify that updateList is called with new data
  await waitFor(() => {
    expect(updateList).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Updated Groceries' })
    );
  });
});
```
✅ Expected Result: The updated name should be visible in the UI and persist after refresh.


### Deleting a Shopping List
**Objective**: Ensure users can delete unwanted lists.

```javascript
test('Deletes a list', async () => {
  render(
    <MemoryRouter>
      <ShoppingListButton list={sampleList} />
    </MemoryRouter>
  );

  // Open options dropdown
  await user.click(screen.getByTestId('list-options'));

  // Click "Delete"
  await user.click(screen.getByText('Delete'));

  // Confirm deletion
  await user.click(screen.getByText('Delete'));

  // Verify that deleteList was called with correct list ID
  await waitFor(() => {
    expect(deleteList).toHaveBeenCalledWith(sampleList._id);
  });
});
```
✅ Expected Result: The list should be removed from the UI and database.

### Switching Between Shopping Lists
**Objective**: Ensure users can navigate between multiple lists without data interference.

```javascript
test('Renders multiple lists for management and navigation', () => {
  const secondList = {
    ...sampleList,
    _id: '2',
    name: 'Hardware Store',
    address: { country: 'AT', city: 'Vienna', street: 'Tool Rd', postcode: '1020' },
  };

  render(
    <MemoryRouter>
      <ShoppingListButton list={sampleList} />
      <ShoppingListButton list={secondList} />
    </MemoryRouter>
  );

  // Check that both lists appear
  expect(screen.getByText('Groceries')).toBeInTheDocument();
  expect(screen.getByText('Hardware Store')).toBeInTheDocument();

  // Verify that each list has a link
  const links = screen.getAllByRole('link');
  expect(links.length).toBe(2);
});
```
✅ Expected Result: Users should see multiple lists and navigate between them seamlessly.
