'use strict';
// USER STORY 1: RENDER SHOPPING LIST TO DOM
// creates a startup shopping list
const STORE = [
  {name: 'apples', checked: false},
  {name: 'oranges', checked: false},
  {name: 'milk', checked: true},
  {name: 'bread', checked: false}
];
// creates an li element with item's name, buttons, classes, and attributes dubbed DOMItem
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
// maps through the array and creates a DOMItem for each item using `createDOMItem`
const createDOMList = arr => arr.map((item, index) => createDOMItem(item, index)).join('');
// renders shoppingList to the DOM using `createDOMList`
const renderShoppingList= () => { $('.js-shopping-list').html(createDOMList(STORE));};

// USER STORY 2: ADD NEW SHOPPING LIST ITEM
// gets new shoppingList submitted by user
const getNewItem = () => $('.js-shopping-list-entry').val();
// empties the submit form
const emptyForm = () => { $('.js-shopping-list-entry').val('');};
// add new item to store
const addItemToShoppingList = () => { STORE.push({name: getNewItem(), checked: false}); };
// on clicking submit, an item provided by user is added to shopping list and rendered to the DOM
const handleAddingItems = () => {
  $('#js-shopping-list-form').submit( (event) => {
    event.preventDefault();
    addItemToShoppingList();
    renderShoppingList();
    emptyForm();
  });
};

// USER STORY 3 & 4: CHECK OR DELETE ITEMS
// returns the index of a clicked item
const findIndexOfItem = (event) => $(event.target).closest('.js-item-index-element').data('item-index');
// deletes or checks and item from the list based on button clicked and parameters given then re-renders the list
const checkOrDeleteItem = (typeOfButton, callbackFn) => {
  $('.js-shopping-list').on('click', typeOfButton, (event) => { 
    callbackFn(findIndexOfItem(event));
    renderShoppingList();
  });
};
// if check button clicked, cross out the item
const handleCheckingItems = () => checkOrDeleteItem('.js-item-toggle', index => STORE[index].checked = !STORE[index].checked);
// if delete button clicked, delete the item
const handleDeletingItems = () => checkOrDeleteItem('.js-item-delete', index => STORE.splice(index, 1));

// handles all four USER STORIES
const handleShoppingList = () => {
  renderShoppingList();
  handleAddingItems();
  handleCheckingItems();
  handleDeletingItems();
};

// call handler when the DOM is ready
$(handleShoppingList);