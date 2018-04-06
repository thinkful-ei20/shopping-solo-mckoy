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
const renderShoppingList= () => { $('.js-shopping-list').html(createDOMList(STORE.shoppingList));};

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
    renderShoppingList();
    emptyForm();
  });
};

// USER STORY 3 & 4: CHECK OR DELETE ITEMS
// Returns the index of a clicked item
const findIndexOfItem = event => $(event.target).closest('.js-item-index-element').data('itemIndex');
// Listen for clicks on check or delete button then re-renders the shopping list to the DOM
const checkOrDeleteItem = (typeOfButton, callbackFn) => {
  $('.js-shopping-list').on('click', typeOfButton, (event) => { 
    callbackFn(STORE.shoppingList, findIndexOfItem(event));
    renderShoppingList();
  });
};
// If user clicks check button, item is striked or unstriked.
const handleCheckingItems = () => checkOrDeleteItem('.js-item-toggle', (database, index) => 
  database[index].checked = !database[index].checked);
// If user clicks delete button, delete the item.
const handleDeletingItems = () => checkOrDeleteItem('.js-item-delete', (database, index) => 
  database.splice(index, 1));

// USER STORY 5: User can press a switch/checkbox to toggle between displaying all items or unchecked items
// makes a filtered shopping list
//const filteredByUnchecked = () => ;

const handleFilteringUncheckedItems= () => {
  console.log('`handleFilteringUncheckedItems` working');
};

  // Handles all four USER STORIES.
const handleShoppingList = () => {
  renderShoppingList();
  handleAddingItems();
  handleCheckingItems();
  handleDeletingItems();
  handleFilteringUncheckedItems();
};

// call handler when the DOM is ready
$(handleShoppingList);