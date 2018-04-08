'use strict';
// USER STORY 1: RENDER SHOPPING LIST TO DOM
// Creates a database to store shopping list and 
// methods to call on the shopping list.
const STORE = {
  stateOfStore: [
    {name: 'unsortedShoppingList', state: false},
    {name: 'filterChecked', state: false},
    {name: 'filterAlpha', state: false},
    {name: 'editChecked', state: false},
    {name: 'advancedDisplayed', state: false}
  ],
  // Stores an start-up shopping list of items, 
  // each with a item name and whether or not this item has been checked.
  // New items added in the DOM are stored in this list. 
  shoppingList: [
    {name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false}],
  // Stores a list of shopping list items deleted in the DOM,
  // starting with an empty list.
  deletedItemsList: [],
  filterDeleted: () => {},
  // Filters items in the shopping list 
  // by whether or not this item has been checked.
  filterChecked: function(){return this.shoppingList.filter(item => !item.checked);},
  // Filters items in the shopping list by making a copy,
  // sorting that copy in place, and returning the sorted copy.
  filterAlpha: function(){return this.shoppingList.slice().sort((a,b) => a.name>b.name);},
  // Filters items in the shopping list by a search item,
  // passed as the `name` parameter.
  filterByName: function(name){return this.shoppingList.filter(item => item.name.includes(name));},
  searchName: ''
};
// Creates an li element with item's name, buttons, classes, and attributes dubbed DOMItem.
const createDOMItem = (item, index) => `
  <li class="js-item-index-element" data-item-index="${index}">
    <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
    <div class="shopping-item-controls">    
      <button class="shopping-item-toggle js-item-toggle">
        <span class="button-label">check</span>
      </button>
      <button class="shopping-item-delete js-item-delete">
        <span class="button-label">delete</span>
      </button>
      <button class="shopping-item-edit js-item-edit">
        <span class="button-label">edit</span>
      </button>
    </div>
  </li>`;
// Creates an input form for editing, buttons, classes, and attributes dubbed DOMEditItem.
const createDOMEditItem = () => `
  <span class="shopping-item js-shopping-item">
    <form id="js-shopping-list-form">
      <input type="text" name="edit-list-entry" class="js-edit-list-entry" placeholder="you meant to type...">
    </form>
  </span>
  <div class="shopping-item-controls">
    <button class="shopping-item-toggle js-item-toggle">
      <span class="button-label">check</span>
    </button>
    <button class="shopping-item-delete js-item-delete">
      <span class="button-label">delete</span>
    </button>
    <button class="shopping-item-edited js-item-edited">
      <span class="button-label">submit change</span>
    </button>
  </div>`;
// Maps through the a given array (such as the shopping list) and creates a DOMItem for each item.
const createDOMList = arr => arr.map((item, index) => createDOMItem(item, index)).join('');
// Renders an array (such as the shopping list) to the DOM using `createDOMList`.
const renderShoppingList= arr => { $('.js-shopping-list').html(createDOMList(arr));};

// USER STORY 2: ADD NEW SHOPPING LIST ITEM
// Returns the value at a given location in the DOM
const getNewItem = (itemLoc) => $(itemLoc).val().toLowerCase();
// Empties the value at a given location in the DOM.
const clearValue = (itemLoc) => { $(itemLoc).val('');};
// Gets value of `getNewItem` and adds it to a given database with
// a 'checked' key initialized to false.
const addItemToShoppingList = database => { database.push({name: getNewItem('.js-shopping-list-entry'), checked: false}); };
// When clicking submit, an item provided by user is added to the shopping list,
// rendered to the DOM, then cleared from the 'add new item' field.
const handleAddingItems = () => {
  $('#js-shopping-list-form').submit( (event) => {
    event.preventDefault();
    addItemToShoppingList(STORE.shoppingList);
    renderShoppingList(STORE.shoppingList);
    clearValue('.js-shopping-list-entry');
  });
};

// USER STORY 3 & 4: CHECK OR DELETE ITEMS
// Returns the index of a item given its location.
const findIndexOfItem = location => $(location).closest('.js-item-index-element').data('itemIndex');
// Listens for clicks on given button in a given location,
// and if there is a given callback function, passes the given list to render and
// and an item index, then renders a shopping list according to the given list to render.
// If there is no callback function, renders a shopping list according to the given list to render. 
const checkWhichButton = (buttonLoc, typeOfButton, listToRender, callbackFn) => {
  $(buttonLoc).on('click', typeOfButton, (event) => { 
    if(callbackFn){
      callbackFn(listToRender);
    } else { renderShoppingList(listToRender); }
  });
};
// When clicking `check` button, the corresponding shopping list item is striked/unstriked.
const handleCheckingItems = () => checkWhichButton('.js-shopping-list', '.js-item-toggle', STORE.shoppingList, (database) => {
  database[findIndexOfItem(event.target)].checked = !database[findIndexOfItem(event.target)].checked;
  renderShoppingList(database);
});
// When clicking `delete` button, the corresponding shopping list item is deleted and
// added to the deleted items list in the database.
const handleDeletingItems = () => checkWhichButton('.js-shopping-list', '.js-item-delete', STORE.shoppingList, (database) => {
  STORE.deletedItemsList.push(database.slice().splice(findIndexOfItem(event.target), 1)[0]);
  database.splice(findIndexOfItem(event.target), 1);
  renderShoppingList(database);
});

// USER STORY 5: FILTER BUTTONS
// Replaces current given class (in dot form) with a new given class (no dot) and a new text message.
const replaceClassAndText = (currDotClass, newNoDotClass, text) => {
  $(currDotClass).text(text);
  $(currDotClass).removeClass().addClass(newNoDotClass);
};

/*
// REFACTOR TO USE `checkWhichButton` FUNCTION FOR HANDLING FILTERING UNCHECKED ITEMS
const handleFilteringUncheckedItems = () => {
  const buttonText = $('.js-filter-unchecked').find('.button-label').text();
  checkWhichButton('.js-buttons', '.js-filter-unchecked', STORE.filterChecked(), (database) => {
    if (buttonText==='Show unchecked items') {
      console.log(database);
      renderShoppingList(database);
      replaceClassAndText('.js-filter-unchecked', 'js-filter-checked', 'Show all items');
    } else {
      renderShoppingList(STORE.shoppingList);
    }
  });
  checkWhichButton('.js-buttons', '.js-filter-checked', STORE.shoppingList, database => {
    $('.js-advanced-forms').remove();
    renderShoppingList(database);
    replaceClassAndText('.js-filter-checked', 'js-filter-unchecked', 'Show unchecked items');
  });
};
*/

// Handles 'Show unchecked items'/'Show all items' button.
const handleFilteringUncheckedItems= () => {
  const buttonText = $('.js-filter-unchecked').find('.button-label').text();
  $('.js-buttons').on('click', '.js-filter-unchecked', () => {
    // If user clicks on the 'Show unchecked items', a shopping list filtered by unchecked 
    // renders to the DOM and the button will now say 'Show all items'.
    if (buttonText==='Show unchecked items') {
      renderShoppingList(STORE.filterChecked());
      replaceClassAndText('.js-filter-unchecked', 'js-filter-checked', 'Show all items');
    } else {
      // If user clicks on the 'Show items in original order', the original shopping list renders to the DOM 
      // and the button will now say 'Show unchecked items'.
      renderShoppingList(STORE.shoppingList);
    }
  });
  // If user clicks on the 'Show all items', 
  // the entire shopping list renders to the DOM and 
  // the button will now say 'Show all items'
  $('.js-buttons').on('click', '.js-filter-checked', () => { 
    $('.js-advanced-forms').remove();
    renderShoppingList(STORE.shoppingList);
    replaceClassAndText('.js-filter-checked', 'js-filter-unchecked', 'Show unchecked items');
  });
};

// Creates two radio buttons and an input box for submitting searches.
const createAdvancedDOMForm = () => `
  <div class="js-advanced-forms">
    <form id="js-item-sort-form">
      <input type="radio" name="sort" value="alpha" class="js-alpha-checked"> Show items alphabetically
      <input type="radio" name="sort" value="deleted" class="js-sort-checked"> Show deleted items
    </form>
    <form id="js-item-search-form">
      <label for="shopping-list-entry">Search for an item</label>
      <input type="text" name="shopping-list-entry" class="js-item-search-entry" placeholder="e.g., milk">
    </form>  
  </div>
`;

// Handles 'Show advanced options'/'Clear advanced options' button
const handleAdvancedOptionsButton = () => {
  const buttonText = $('.js-advanced-unchecked').find('.button-label').text();
  // If user clicks on the 'Show advanced options', a list of advanced options is rendered to the DOM 
  // and the button will now say 'Clear advanced options'
  $('.js-buttons').on('click', '.js-advanced-unchecked', (event) => {
    if (buttonText==='Show advanced options') {
      $(event.target).closest('.shopping-item-controls').append(createAdvancedDOMForm);
      $('.js-advanced-unchecked').find('.button-label').text('Clear advanced options');
      $('.js-advanced-unchecked').removeClass('js-advanced-unchecked').addClass('js-advanced-checked');
    }
  });
  // If user clicks on the 'Clear advanced options', the list of advanced options disappears 
  // and the button will now say 'Show advanced options'
  $('.js-buttons').on('click', '.js-advanced-checked', () => { 
    $('.js-advanced-forms').remove();
    $('.js-advanced-checked').find('.button-label').text('Show advanced options');
    $('.js-advanced-checked').removeClass('js-advanced-checked').addClass('js-advanced-unchecked');
  });
};

// Handles 'Show items alphabetically'/'Show deleted items' radio buttons
const handleSortAlphaDeletedAndSearch = () => {
  // If user clicks on the 'Show items alphabetically', 
  // the current shopping list is sorted alphabetically, rendered to the DOM and 
  // the button will now say 'Clear advanced options'
  $('.js-buttons').on('click', '.js-alpha-checked', (event) => { 
    renderShoppingList(STORE.filterAlpha());
    replaceClassAndText('.js-filter-unchecked', 'js-filter-checked', 'Show items in original order');
    $('.js-advanced-forms').remove();
    $('.js-advanced-checked').find('.button-label').text('Show advanced options');
    $('.js-advanced-checked').removeClass('js-advanced-checked').addClass('js-advanced-unchecked');
  });
  // If user clicks on the 'Show items alphabetically', 
  // a shopping list sorted alphabetically renders to the DOM and 
  // the button will now say 'Clear advanced options'
  $('.js-buttons').on('click', '.js-sort-checked', (event) => { 
    renderShoppingList(STORE.deletedItemsList);
    replaceClassAndText('.js-filter-unchecked', 'js-filter-checked', 'Show items in original order');
    $('.js-advanced-forms').remove();
    $('.js-advanced-checked').find('.button-label').text('Show advanced options');
    $('.js-advanced-checked').removeClass('js-advanced-checked').addClass('js-advanced-unchecked');
  });
  // When user types into the search field
  $('.js-buttons').on('keyup', '.js-item-search-entry', event => {
    renderShoppingList(STORE.filterByName($(event.target).val().toLowerCase()));
  });
};

const handleEditingItems = () => {
  $('.js-shopping-list').on('click', '.js-item-edit', event => {
    $(event.target).closest('li').html(createDOMEditItem());
  });
  $('.js-shopping-list').on('click', '.js-item-edited', () => {
    STORE.shoppingList.splice(findIndexOfItem('.js-item-edited'), 1, {name: getNewItem('.js-edit-list-entry'), checked: false});
    renderShoppingList(STORE.shoppingList);
  });
};

// Handles all USER STORIES.
const handleShoppingList = () => {
  renderShoppingList(STORE.shoppingList);
  handleAddingItems();
  handleFilteringUncheckedItems();
  handleAdvancedOptionsButton();
  handleSortAlphaDeletedAndSearch();
  handleCheckingItems();
  handleDeletingItems();
  handleEditingItems();
};
// call handler when the DOM is ready
$(handleShoppingList);