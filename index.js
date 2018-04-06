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
      callbackFn(STORE.shoppingList, findIndexOfItem(event));
      renderShoppingList(STORE.shoppingList);
    } else { renderShoppingList(STORE.shoppingList); }
  });
};
// If user clicks check button, item is striked or unstriked.
const handleCheckingItems = () => checkWhichButton('.js-shopping-list', '.js-item-toggle', STORE.shoppingList, (database, index) => 
  database[index].checked = !database[index].checked);
// If user clicks delete button, delete the item.
const handleDeletingItems = () => checkWhichButton('.js-shopping-list', '.js-item-delete', STORE.shoppingList, (database, index) => 
  database.splice(index, 1));

// USER STORY 5: User can press a switch/checkbox to toggle between displaying all items or unchecked items
// makes a filtered shopping list

const handleFilteringUncheckedItems= () => {
  console.log('`handleFilteringUncheckedItems` working');
  console.log(createDOMList( STORE.filterChecked() ));
  $('.js-buttons').on('click', '.js-filter-unchecked', (event) => { 
    console.log('`handleFilteringUncheckedItems` items button works!');
    renderShoppingList(STORE.filterChecked());
  });
};

const handleAdvanceSorting = () => {
  $('.js-buttons').on('click', '.js-advanced-sort', (event) => { 
    console.log('`handleAdvanceSorting` items button works!');
  });
}

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