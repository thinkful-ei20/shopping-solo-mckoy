'use strict';
function check$(){
  console.log('jQuery, the notorious $, is available for use.');
}
function renderShoppingList(){
  // shopping list should be rendered to the page
  console.log('`renderShoppingList` ran like a charm.');
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