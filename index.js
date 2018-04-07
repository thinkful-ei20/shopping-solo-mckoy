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
  },
  filterAlpha: function(){
    return this.shoppingList.slice().sort((a,b) => a.name>b.name);
  },
  filterDeleted: () => {}
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
      <button type="submit">Search</button>
    </form>  
  </div>
`;

// Handles 'Show advanced options'/'Clear advanced options' button
const handleAdvancedOptionsButton = () => {
  const buttonText = $('.js-advanced-unchecked').find('.button-label').text();
  // If user clicks on the 'Show advanced options', a list of advanced options to the DOM and the button will now say 'Clear advanced options'
  $('.js-buttons').on('click', '.js-advanced-unchecked', (event) => {
    if (buttonText==='Show advanced options') {
      $(event.target).closest('.shopping-item-controls').append(createAdvancedDOMForm);
      $('.js-advanced-unchecked').find('.button-label').text('Clear advanced options');
      $('.js-advanced-unchecked').removeClass('js-advanced-unchecked').addClass('js-advanced-checked');
    }
  });
  // If user clicks on the 'Clear advanced options', the list of advanced options disappears and the button will now say 'Show advanced options'
  $('.js-buttons').on('click', '.js-advanced-checked', () => { 
    $('.js-advanced-forms').remove();
    $('.js-advanced-checked').find('.button-label').text('Show advanced options');
    $('.js-advanced-checked').removeClass('js-advanced-checked').addClass('js-advanced-unchecked');
  });
};

// Handles 'Show items alphabetically'/'Show deleted items' radio buttons
const handleSortRadioButtons = () => {
  console.log('`handleSortRadioButtons` works like a charm');
  // If user clicks on the 'Show items alphabetically', a shopping list sorted alphabetically renders to the DOM and the button will now say 'Clear advanced options'
  $('.js-buttons').on('click', '.js-alpha-checked', (event) => { 
    renderShoppingList(STORE.filterAlpha());
    replaceClassAndText('.js-filter-unchecked', 'js-filter-checked', 'Show items in original order');
  });
  $('.js-buttons').on('click', '.js-sort-checked', (event) => { 
    console.log('`Show deleted items` button works like a charm');
  });
  // change 'Show unchecked items' to 'Show all items' (and classes)
};


// Handles all USER STORIES.
const handleShoppingList = () => {
  renderShoppingList(STORE.shoppingList);
  handleAddingItems();
  handleFilteringUncheckedItems();
  handleAdvancedOptionsButton();
  handleSortRadioButtons();
  handleCheckingItems();
  handleDeletingItems();
};

// call handler when the DOM is ready
$(handleShoppingList);