'use strict';
const STORE = [
  {name: 'apples', checked: false},
  {name: 'oranges', checked: false},
  {name: 'milk', checked: true},
  {name: 'bread', checked: false}
];

function check$(){
  console.log('jQuery, the notorious $, is available for use.');
}

function createDOMItem(item, index){
  // creates an li element with item's name, buttons, classes, and attributes dubbed DOMItem
  return `
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
  </li>
  `;
}

function createDOMList(arr) {
  // maps through the array and creates a DOMItem for each item
  return arr.map((item, index) => createDOMItem(item, index)).join('');
}
function renderShoppingList(){
  // shopping list will be rendered to the page
  console.log('`renderShoppingList` ran like a charm.');
  const DOMList = createDOMList(STORE);
  $('.js-shopping-list').html(DOMList);
}
function getNewItem() {
  return $('.js-shopping-list-entry').val();
}
function emptyForm(){
  $('.js-shopping-list-entry').val(''); 
}
function addItem(){
  console.log('`addItem` ran like a charm.');
  STORE.push({name: getNewItem(), checked: false});
  renderShoppingList();
  emptyForm();
}

function handleAddingItems(){
  // an item provided by user should be added to shopping list
  console.log('`handleAddingItems` ran like a charm.');
  $('#js-shopping-list-form').submit(function(event){
    event.preventDefault();
    addItem();
  });
}

function checkItem(){
  // an item (with button, 'check') should be able to be checked
  console.log('`checkItem` ran like a charm');
}

function deleteItem(){
  // an item (with button, 'delete') should be able to be deleted
  console.log('`deleteItem` ran like a charm');
}

function handleShoppingList(){
  check$();
  renderShoppingList();
  handleAddingItems();
  checkItem();
  deleteItem();
}

$(handleShoppingList);