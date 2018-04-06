'use strict';
// USER STORY 1: RENDER SHOPPING LIST TO DOM
// creates a startup shopping list
const STORE = {
  shoppingList: [
    {name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false}
  ],
  filterChecked: function(){
    return this.shoppingList.filter(item => !item.checked);
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
    </div>
  </li>`;
// Maps through the shopping list and creates a DOMItem for each item.
const createDOMList = arr => arr.map((item, index) => createDOMItem(item, index)).join('');
// Renders shopping list to the DOM using `createDOMList`.
const renderShoppingList= arr => { $('.js-shopping-list').html(createDOMList(arr));};

// USER STORY 2: ADD NEW SHOPPING LIST ITEM
// Gets new shopping list item submitted by user.
const getNewItem = () => $('.js-shopping-list-entry').val();
// Empties the submit form.
const emptyForm = () => { $('.js-shopping-list-entry').val('');};
// Adds new item to shopping list.
const addItemToShoppingList = database => { database.push({name: getNewItem(), checked: false}); };
// When clicking submit, an item provided by user is added to the shopping list and rendered to the DOM.
const handleAddingItems = () => {
  $('#js-shopping-list-form').submit( (event) => {
    event.preventDefault();
    addItemToShoppingList(STORE.shoppingList);
    renderShoppingList(STORE.shoppingList);
    emptyForm();
  });
};

// USER STORY 3 & 4: CHECK OR DELETE ITEMS
// Returns the index of a clicked item
const findIndexOfItem = event => $(event.target).closest('.js-item-index-element').data('itemIndex');
// Listen for clicks on check or delete button then re-renders the shopping list to the DOM
const checkWhichButton = (buttonLoc, typeOfButton, listToRender, callbackFn) => {
  $(buttonLoc).on('click', typeOfButton, (event) => { 
    if(callbackFn){
      callbackFn(listToRender, findIndexOfItem(event));
      renderShoppingList(listToRender);
    } else { renderShoppingList(listToRender); }
  });
};
// If user clicks check button, item is striked or unstriked.
const handleCheckingItems = () => checkWhichButton('.js-shopping-list', '.js-item-toggle', STORE.shoppingList, (database, index) => 
  database[index].checked = !database[index].checked);
// If user clicks delete button, delete the item.
const handleDeletingItems = () => checkWhichButton('.js-shopping-list', '.js-item-delete', STORE.shoppingList, (database, index) => 
  database.splice(index, 1));

// USER STORY 5: User can press a switch/checkbox to toggle between displaying all items or unchecked items
const handleFilteringUncheckedItems= () => {
  $('.js-buttons').on('click', '.js-filter-unchecked', () => { 
    renderShoppingList(STORE.filterChecked());
    $('.js-filter-unchecked').text('Show all items');
    $('.js-filter-unchecked').removeClass().addClass('js-filter-checked');
  });
  $('.js-buttons').on('click', '.js-filter-checked', () => { 
    renderShoppingList(STORE.shoppingList);
    $('.js-filter-checked').text('Show unchecked items');
    $('.js-filter-checked').removeClass().addClass('js-filter-unchecked');
  });
};

const createDOMForm = () => `
  <div class="js-advanced-forms">
    <form id="js-item-sort-form">
      <input type="radio" name="sort" value="alpha" class="js-advanced-unchecked"> Show items alphabetically
      <input type="radio" name="sort" value="deleted" class="js-advanced-unchecked"> Show deleted items
    </form>
    <form id="js-item-search-form">
      <label for="shopping-list-entry">Search for an item</label>
      <input type="text" name="shopping-list-entry" class="js-item-search-entry" placeholder="e.g., milk">
      <button type="submit">Search</button>
    </form>  
  </div>
`;

const handleAdvanceSorting = () => {
  $('.js-buttons').on('click', '.js-advanced-unchecked', (event) => { 
    console.log('`handleAdvanceSorting` items button works!');
    $(event.target).closest('.shopping-item-controls').append(createDOMForm);
    $('.js-advanced-unchecked').find('.button-label').text('Clear advanced options');
    $('.js-advanced-unchecked').removeClass().addClass('js-advanced-checked');
  });
  $('.js-buttons').on('click', '.js-advanced-checked', (event) => { 
    console.log('`handleAdvanceSorting` items button works!');
    $('.js-advanced-forms').remove();
    $('.js-advanced-checked').find('.button-label').text('Advanced Options');
    $('.js-advanced-checked').removeClass().addClass('js-advanced-unchecked');
  });
};

// Handles all four USER STORIES.
const handleShoppingList = () => {
  renderShoppingList(STORE.shoppingList);
  handleAddingItems();
  handleCheckingItems();
  handleDeletingItems();
  handleFilteringUncheckedItems();
  handleAdvanceSorting();
};

// call handler when the DOM is ready
$(handleShoppingList);