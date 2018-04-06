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

function createDOMList(arr) {
  return `
  <li>${arr[0].name}</li>
  <li>${arr[1].name}</li>
  <li>${arr[2].name}</li>
  <li>${arr[3].name}</li>
  `;
}
function renderShoppingList(){
  // shopping list should be rendered to the page
  console.log('`renderShoppingList` ran like a charm.');
  const DOMList = createDOMList(STORE);
  $('.js-shopping-list').html(DOMList);
}

function addItem(){
  // an item provided by user should be added to shopping list
  console.log('`addItem` ran like a charm.');
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
  addItem();
  checkItem();
  deleteItem();
}

$(handleShoppingList);