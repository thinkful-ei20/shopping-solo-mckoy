'use strict';
// USER STORY 1: RENDER SHOPPING LIST TO DOM
// creates a startup shopping list
const STORE = {
  testKey: [{name: 'Button (or whatever) works', checked: false}],
  shoppingList: [
    {name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false}],
  deletedItemsList: [],
  filterChecked: function(){
    return this.shoppingList.filter(item => !item.checked);
  },
  filterAlpha: function(){
    return this.shoppingList.slice().sort((a,b) => a.name>b.name);
  },
  filterDeleted: () => {},
  filterByName: function(name){
    return this.shoppingList.filter(item => item.name.includes(name));
  } 
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
// Maps through the shopping list and creates a DOMItem for each item.
const createDOMList = arr => arr.map((item, index) => createDOMItem(item, index)).join('');
/*
const createEditDOMList = arr => arr.map((item, index) => 
  (index===0) ? createDOMEditItem(item, index) : createDOMItem(item, index));
*/
// Renders shopping list to the DOM using `createDOMList`.
const renderShoppingList= arr => { $('.js-shopping-list').html(createDOMList(arr));};

// USER STORY 2: ADD NEW SHOPPING LIST ITEM
// Gets new shopping list item submitted by user.
const getNewItem = (itemLoc) => $(itemLoc).val();
// Empties the submit form.
const emptyForm = () => { $('.js-shopping-list-entry').val('');};
// Adds new item to shopping list.
const addItemToShoppingList = database => { database.push({name: getNewItem('.js-shopping-list-entry'), checked: false}); };
// When clicking submit, an item provided by user is added to the shopping list and rendered to the DOM.
const handleAddingItems = () => {
  $('#js-shopping-list-form').submit( (event) => {
    event.preventDefault();
    addItemToShoppingList(STORE.shoppingList);
    renderShoppingList(STORE.shoppingList);
    emptyForm();
  });
};
const getEditItem = () => $('.js-edit-list-entry').val();


// USER STORY 3 & 4: CHECK OR DELETE ITEMS
// Returns the index of a clicked item
const findIndexOfItem = eventLoc => $(eventLoc).closest('.js-item-index-element').data('itemIndex');
// Listen for clicks on check or delete button then re-renders the shopping list to the DOM
const checkWhichButton = (buttonLoc, typeOfButton, listToRender, callbackFn) => {
  $(buttonLoc).on('click', typeOfButton, (event) => { 
    if(callbackFn){
      callbackFn(listToRender, findIndexOfItem(event.target));
      renderShoppingList(listToRender);
    } else { renderShoppingList(listToRender); }
  });
};
// If user clicks check button, item is striked or unstriked.
const handleCheckingItems = () => checkWhichButton('.js-shopping-list', '.js-item-toggle', STORE.shoppingList, (database, index) => 
  database[index].checked = !database[index].checked);
// If user clicks delete button, delete the item.
const handleDeletingItems = () => checkWhichButton('.js-shopping-list', '.js-item-delete', STORE.shoppingList, (database, index) => {
  STORE.deletedItemsList.push(database.slice().splice(index, 1)[0]);
  return database.splice(index, 1);
});

// USER STORY 5: FILTER BUTTONS
// Replaces current given class (in dot form) which a new given class (no dot) and a new text message.
const replaceClassAndText = (currDotClass, newNoDotClass, text) => {
  $(currDotClass).text(text);
  $(currDotClass).removeClass().addClass(newNoDotClass);
};

// Handles 'Show unchecked items'/'Show all items' button
const handleFilteringUncheckedItems= () => {
  const buttonText = $('.js-filter-unchecked').find('.button-label').text();
  $('.js-buttons').on('click', '.js-filter-unchecked', () => {
    // If user clicks on the 'Show unchecked items', a shopping list filtered by unchecked renders to the DOM and the button will now say 'Show all items' 
    if (buttonText==='Show unchecked items') {
      renderShoppingList(STORE.filterChecked());
      replaceClassAndText('.js-filter-unchecked', 'js-filter-checked', 'Show all items');
    } else {
      // If user clicks on the 'Show items in original order', the original shopping list renders to the DOM and the button will now say 'Show unchecked items'
      renderShoppingList(STORE.shoppingList);
    }
  });
  // If user clicks on the 'Show all items', the entire shopping list renders to the DOM and the button will now say 'Show all items'
  $('.js-buttons').on('click', '.js-filter-checked', () => { 
    $('.js-advanced-forms').remove();
    renderShoppingList(STORE.shoppingList);
    replaceClassAndText('.js-filter-checked', 'js-filter-unchecked', 'Show unchecked items');
  });
};

// Creates two radio buttons and an input box for submitting searches
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
  $('.js-buttons').on('keyup', '.js-item-search-entry', event => {
    renderShoppingList(STORE.filterByName($(event.target).val()));
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

const handleSearchingItems = () => {

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
  handleSearchingItems();
};

// call handler when the DOM is ready
$(handleShoppingList);