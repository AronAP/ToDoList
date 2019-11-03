'use strict';

// Track page reload.

sessionStorage.setItem('is_reloaded', true);

var todoForm = document.querySelector('.todo-form');
var inputSearch = document.querySelector('.form__search');
var selectState = document.querySelector('#form__state');
var selectPriority = document.querySelector('#form__priority');
var createButton = document.querySelector('.form__button');
var modal = document.querySelector('.modal');
var modalOverlay = document.querySelector('.modal__overlay');
var cancelButton = document.querySelector('#modal-form__cancel');
var saveButton = document.querySelector('#modal-form__save');
var modalForm = document.querySelector('#modal-form');
var modalFormTitle = modalForm.querySelector('#modal-form__title');
var modalFormDescription = modalForm.querySelector('#modal-form__descr');
var modalFormPriority = modalForm.querySelector('#modal-form__priority');
var todoList = document.querySelector('.todo__list');
var todoListEmpty = document.querySelector('.todo__list_empty');
var headerName = document.querySelector('.header__name');
var titleError = document.querySelector('#modal-form__error');

var returnEditButtonID = void 0;
var LIST = void 0,
    id = void 0;
var data = localStorage.getItem('TODO');

// Checks if there is data in localeStorage.
if (data) {
  LIST = JSON.parse(data);
  id = LIST.length;
  loadList(LIST);
} else {
  LIST = [];
  id = 0;
}

// The inscription when there are no cards.
if (getListLength() == 0) {
  todoListEmpty.style.display = 'block';
} else {
  todoListEmpty.style.display = 'none';
}

/**
 * Download card from localeStorage.
 *
 * @param {Array} array - an array with objects in the form of card data.
 */
function loadList(array) {
  array.forEach(function (item) {
    addTodoList(item.id, item.done, item.trash, item.title, item.description, item.priority);
  });
}

// Reset localStorage when you click on the table of contents.
headerName.addEventListener('click', function () {
  localStorage.clear();
  location.reload();
});

/**
 * Counts the number of task cards.
 *
 * @returns {number} item - number of cards.
 */
function getListLength() {
  var item = todoList.querySelectorAll('.todo__item');

  return item.length;
}

/**
 * Opens a modal window.
 *
 */
function openModal() {
  modal.style.display = 'block';
}

/**
 * Closes a modal window.
 *
 */
function closeModal() {
  modal.style.display = 'none';
}

/**
 * Deletes a input notification about an error.
 *
 */
function removeInputError() {
  modalFormTitle.style.borderColor = '#000';
  titleError.style.display = 'none';
}

// Clicking the Create button opens a modal window.
createButton.addEventListener('click', function () {
  openModal();
});

// Clicking the Cancel button closes a modal window and resets the input data.
cancelButton.addEventListener('click', function () {
  closeModal();
  removeModalValue();
  removeInputError();
});

// Clicking the modal overlay closes a modal window and resets the input data.
modalOverlay.addEventListener('click', function () {
  closeModal();
  removeModalValue();
  removeInputError();
});

/**
 * Opens a submenu with three dots.
 *
 * @param elem - Clicked item.
 */
function openMore(elem) {
  elem = elem.nextSibling.nextSibling;
  elem.style.display = 'block';
}

/**
 * Closes a submenu with three dots.
 *
 * @param elem - Clicked item.
 */
function closeMore(elem) {
  elem = elem.parentNode;
  elem.style.display = 'none';
}

/**
 * Listens to a click on a button with three dots.
 *
 */
function listenDotsButton() {
  var dotsButton = document.querySelectorAll('.todo-menu__dots');

  dotsButton.forEach(function (btn) {

    btn.addEventListener('click', function (e) {

      var button = e.target.closest('div');

      if (!button) return;
      if (!btn.contains(button)) return;

      openMore(btn);

      // Hides the menu after 2 seconds.
      setTimeout(function () {
        btn.nextSibling.nextSibling.style.display = 'none';
      }, 2000);
    });
  });
}

listenDotsButton();

/**
 * Adds a card to the page.
 *
 * @param {Number} id - идентификатор карточки
 * @param {Boolean} done - true if the card is completed; default - false.
 * @param {Boolean} trash - true if the card is deleted; default - false.
 * @param {String} title - table of contents of the card.
 * @param {String} description - card description.
 * @param {String} priority - priority card execution(high/normal/low).
 * @returns - discarded if trash is true.
 */
function addTodoList(id, done, trash, title, description, priority) {

  if (trash) {
    return;
  }

  var item = '<div class="todo__item" data-done="' + done + '" data-filtered="false" data-search="false" data-search-now="true" style="display: flex;">\n                  <div class="todo__title">' + title + '</div>\n                  <div class="todo__descr">' + description + '</div>\n                  <div class="todo__tags">\n                    <div class="todo__priority">' + priority + '</div>\n                    <div class="todo__menu todo-menu">\n                      <div class="todo-menu__dots"><span>...</span></div>\n                      <ul class="todo-menu__items">\n                        <li class="todo-menu__item todo-menu__item_done" id="' + id + '">done</li>\n                        <li class="todo-menu__item todo-menu__item_edit" id="' + id + '">edit</li>\n                        <li class="todo-menu__item todo-menu__item_delete" id="' + id + '">delete</li>\n                      </ul>\n                    </div>\n                  </div>\n                </div>\n                    ';

  todoList.insertAdjacentHTML('afterbegin', item);
}

/**
 * Returns the values ​​from the fields of a modal window.
 *
 * @returns {Object} - title, description, priority
 */
function getModalValue() {
  var titleValue = modalFormTitle.value.toLowerCase();
  var descriptionValue = modalFormDescription.value.toLowerCase();
  var PriorityValue = modalFormPriority.value;

  return {
    title: titleValue,
    description: descriptionValue,
    priority: PriorityValue
  };
}

/**
 * Cleans the shape of the modal window.
 *
 */
function removeModalValue() {
  modalFormTitle.value = '';
  modalFormDescription.value = '';
  modalFormPriority.value = 'high';
}

// Clicking the Save button saves a new or edited card.
saveButton.addEventListener('click', function () {

  if (saveButton.dataset.isedit == 'false') {

    removeInputError();

    var modalValue = getModalValue();

    // check for entered values.
    if (modalValue.title && modalValue.priority) {

      addTodoList(id, false, false, modalValue.title, modalValue.description, modalValue.priority);

      LIST.push({
        id: id,
        done: false,
        trash: false,
        title: modalValue.title,
        description: modalValue.description,
        priority: modalValue.priority
      });

      id += 1;

      // check for selected state of card.
      if (getSelectedOption('#form__state') == 'done') {
        filterState('false');
      } else if (getSelectedOption('#form__state') == 'open') {
        filterState('true');
      }

      // check for selected priority of card.
      if (getSelectedOption('#form__priority') == 'high') {
        filterPriority('high');
      } else if (getSelectedOption('#form__priority') == 'normal') {
        filterPriority('normal');
      } else if (getSelectedOption('#form__priority') == 'low') {
        filterPriority('low');
      }

      removeModalValue();

      // Deletes an inscription.
      if (todoListEmpty) {
        todoListEmpty.style.display = 'none';
      }

      closeModal();
    } else {
      modalFormTitle.style.borderColor = '#e74c3c';
      titleError.style.display = 'block';
    }
  } else {
    // If the card is being edited
    var elem = returnEditButtonID();

    editTodo(elem);

    // check for selected priority of card.
    if (getSelectedOption('#form__priority') == 'high') {
      filterPriority('high');
    } else if (getSelectedOption('#form__priority') == 'normal') {
      filterPriority('normal');
    } else if (getSelectedOption('#form__priority') == 'low') {
      filterPriority('low');
    }

    saveButton.setAttribute('data-isedit', 'false');

    removeModalValue();
    closeModal();
  }

  listenDotsButton();

  localStorage.setItem('TODO', JSON.stringify(LIST));
});

/**
 * Marks a completed/uncompleted card
 *
 * @param elem - Done card button
 */
function completeTodo(elem) {

  var parent = elem.parentNode.parentNode.parentNode.parentNode;

  if (parent.dataset.done == 'false') {
    parent.setAttribute('data-done', 'true');
  } else {
    parent.setAttribute('data-done', 'false');
  }

  LIST[elem.id].done = LIST[elem.id].done ? false : true;
}

/**
 * Deletes a card.
 *
 * @param elem - Delete card button.
 */
function removeTodo(elem) {
  elem.parentNode.parentNode.parentNode.parentNode.remove();

  LIST[elem.id].trash = true;

  if (getListLength() == 0) {
    todoListEmpty.style.display = 'block';
  }
}

/**
 * Changes the data in the card.
 *
 * @param elem - card to be changed.
 */
function editTodo(elem) {

  var titleModal = modalFormTitle.value;
  var descriptionModal = modalFormDescription.value;
  var priorityModal = modalFormPriority.value;

  LIST[elem.id].title = titleModal;
  LIST[elem.id].description = descriptionModal;
  LIST[elem.id].priority = priorityModal;

  var editTitle = elem.parentNode.parentNode.parentNode.parentNode.querySelector('.todo__title');
  var editDescription = elem.parentNode.parentNode.parentNode.parentNode.querySelector('.todo__descr');
  var editPriority = elem.parentNode.parentNode.parentNode.parentNode.querySelector('.todo__priority');

  editTitle.textContent = LIST[elem.id].title;
  editDescription.textContent = LIST[elem.id].description;
  editPriority.textContent = LIST[elem.id].priority;

  localStorage.setItem('TODO', JSON.stringify(LIST));
}

/**
 * Takes the field values ​​for the form from the card.
 *
 * @param elem - card to be changed.
 */
function getTodoValue(elem) {
  var titleElem = LIST[elem.id].title;
  var descriptionElem = LIST[elem.id].description;
  var priorityElem = LIST[elem.id].priority;

  modalFormTitle.value = titleElem;
  modalFormDescription.value = descriptionElem;
  modalFormPriority.value = priorityElem;
}

// Tracks the click on the buttons from the menu.
todoList.addEventListener('click', function (e) {

  var elem = e.target;
  var nameClass = elem.classList;

  // if it is a Done button.
  if (nameClass.contains('todo-menu__item_done')) {
    closeMore(elem);
    completeTodo(elem);

    if (getSelectedOption('#form__state') == 'done') {
      filterState('false');
    } else if (getSelectedOption('#form__state') == 'open') {
      filterState('true');
    }

    // if it is a Delete button.
  } else if (nameClass.contains('todo-menu__item_delete')) {
    closeMore(elem);
    removeTodo(elem);

    // if it is a Edit button.
  } else if (nameClass.contains('todo-menu__item_edit')) {
    getTodoValue(elem);
    closeMore(elem);
    openModal();

    modalFormTitle.select();

    saveButton.setAttribute('data-isedit', 'true');

    // returns the identifier of the element.
    returnEditButtonID = function returnEditButtonID() {
      var elemEdit = elem;

      return elemEdit;
    };
  }

  // Updates localeStorage
  localStorage.setItem('TODO', JSON.stringify(LIST));
});

/**
 * Checks cards for visibility on the page.
 *
 */
function isDisplayNone() {
  var itemTodo = todoList.querySelectorAll('.todo__item');

  itemTodo.forEach(function (item) {
    if (item.style.display == 'none') {
      item.setAttribute('data-filtered', 'false');
    }
  });
}

/**
 * Shows all cards on the page.
 *
 */
function filterTodoAll() {
  var itemTodo = todoList.querySelectorAll('.todo__item');

  itemTodo.forEach(function (item) {

    if (item.getAttribute('data-search-now') == 'true') {

      item.style.display = 'flex';
      item.setAttribute('data-filtered', 'false');
    } else {
      item.style.display = 'none';
    }
  });
}

/**
 * Filters cards on done/open.
 *
 * @param {String} stateBool - true for done; false for open.
 */
function filterState(stateBool) {
  var itemTodo = todoList.querySelectorAll('.todo__item');

  itemTodo.forEach(function (item) {

    if (item.getAttribute('data-search-now') == 'true') {

      if (item.dataset.done == stateBool) {
        item.style.display = 'none';
      } else {
        item.setAttribute('data-filtered', 'true');
      }
    } else {
      item.style.display = 'none';
    }
  });
}

/**
 * Filters cards by priority.
 *
 * @param {String} priorityText - high, normal or low.
 */
function filterPriority(priorityText) {
  var itemTodo = todoList.querySelectorAll('.todo__item');

  itemTodo.forEach(function (item) {

    if (item.getAttribute('data-search-now') == 'true') {

      var priorityElemText = item.querySelector('.todo__priority').textContent;

      if (priorityElemText != priorityText) {
        item.style.display = 'none';
      } else {
        item.setAttribute('data-filtered', 'true');
      }
    } else {
      item.style.display = 'none';
    }
  });
}

/**
 * Returns the selected options from select.
 *
 * @param {String} selectElem -  item id or item class.
 * @returns
 */
function getSelectedOption(selectElem) {

  var sel = document.querySelector(selectElem).selectedIndex;
  var options = document.querySelector(selectElem).options;

  return options[sel].value;
}

// Listens to changes on select State.
selectState.addEventListener('change', function () {

  var optionState = getSelectedOption('#form__state');
  var optionPriority = getSelectedOption('#form__priority');

  if (optionState == 'open') {
    filterTodoAll();
    filterState('true');

    if (optionPriority == 'high') {
      filterPriority('high');
    } else if (optionPriority == 'normal') {
      filterPriority('normal');
    } else if (optionPriority == 'low') {
      filterPriority('low');
    }
  } else if (optionState == 'done') {
    filterTodoAll();
    filterState('false');

    if (optionPriority == 'high') {
      filterPriority('high');
    } else if (optionPriority == 'normal') {
      filterPriority('normal');
    } else if (optionPriority == 'low') {
      filterPriority('low');
    }
  } else {
    filterTodoAll();

    if (optionPriority == 'high') {
      filterPriority('high');
    } else if (optionPriority == 'normal') {
      filterPriority('normal');
    } else if (optionPriority == 'low') {
      filterPriority('low');
    }
  }

  isDisplayNone();
});

// Listens to changes on select Priority.
selectPriority.addEventListener('change', function () {

  var optionPriority = getSelectedOption('#form__priority');
  var optionState = getSelectedOption('#form__state');

  if (optionPriority == 'high') {
    filterTodoAll();
    filterPriority('high');

    if (optionState == 'done') {
      filterState('false');
    } else if (optionState == 'open') {
      filterState('true');
    }
  } else if (optionPriority == 'normal') {
    filterTodoAll();
    filterPriority('normal');

    if (optionState == 'done') {
      filterState('false');
    } else if (optionState == 'open') {
      filterState('true');
    }
  } else if (optionPriority == 'low') {
    filterTodoAll();
    filterPriority('low');

    if (optionState == 'done') {
      filterState('false');
    } else if (optionState == 'open') {
      filterState('true');
    }
  } else {
    filterTodoAll();

    if (optionState == 'done') {
      filterState('false');
    } else if (optionState == 'open') {
      filterState('true');
    }
  }

  isDisplayNone();
});

// reset select for FireFox
if (sessionStorage.getItem('is_reloaded')) {

  var selectAll = todoForm.querySelectorAll('select');

  for (var i = 0; i < selectAll.length; i += 1) {
    var select = selectAll[i];

    select.value = 'all';
  }

  var inputAll = todoForm.querySelectorAll('input');

  for (var _i = 0; _i < inputAll.length; _i += 1) {
    var _select = inputAll[_i];

    _select.value = '';
  }
}

/**
 * Checks for focus off input search.
 *
 */
function onBlur() {
  var titleTodo = todoList.querySelectorAll('.todo__title');

  titleTodo.forEach(function (title) {
    title.parentNode.setAttribute('data-search', 'false');
  });
}
onBlur();

/**
 * Highlights the text you are looking for.
 *
 * @param {String} str - string in which there are matches.
 * @param {Number} pos - start of selection.
 * @param {Number} len - end of selection.
 * @returns {String} - row with highlighted query.
 */
function highlightingSearch(str, pos, len) {
  return str.slice(0, pos) + '<mark>' + str.slice(pos, pos + len) + '</mark>' + str.slice(pos + len);
}

// Listens for a focus event on input search
inputSearch.addEventListener('focus', function () {
  inputSearch.select();

  var titleTodo = todoList.querySelectorAll('.todo__title');

  titleTodo.forEach(function (title) {

    // Checks visibility and changes attributes.
    if (title.parentNode.style.display == 'flex') {
      title.parentNode.setAttribute('data-search', 'true');
      title.parentNode.setAttribute('data-search-now', 'true');
    } else {
      title.parentNode.setAttribute('data-search', 'false');
      title.parentNode.setAttribute('data-search-now', 'false');
    }
  });
});

//Listens for input changes search.
inputSearch.addEventListener('input', function () {

  var titleTodo = todoList.querySelectorAll('.todo__title');

  var valInput = inputSearch.value.trim();

  if (valInput != '') {

    titleTodo.forEach(function (title) {
      var titleText = title.textContent;

      // if there are no matches, then returns -1.
      var search = titleText.search(valInput);

      if (search == -1) {
        title.parentNode.setAttribute('data-search-now', 'false');
        title.parentNode.style.display = 'none';
        title.innerHTML = title.innerText;
      } else {

        if (title.parentNode.dataset.search == 'true') {
          var str = title.innerText;

          title.innerHTML = highlightingSearch(str, search, valInput.length);
        }

        if (title.parentNode.style.display == 'none' && title.parentNode.dataset.search == 'true') {
          title.parentNode.style.display = 'flex';
          title.parentNode.setAttribute('data-search-now', 'true');
        }
      }
    });
  } else {

    // I wrote this at 6 a.m. and have no idea how it works)
    titleTodo.forEach(function (title) {

      if (getSelectedOption('#form__state') == 'done') {
        filterState('false');
      } else if (getSelectedOption('#form__state') == 'open') {
        filterState('true');
      }

      if (getSelectedOption('#form__priority') == 'high') {
        filterPriority('high');
      } else if (getSelectedOption('#form__priority') == 'normal') {
        filterPriority('normal');
      } else if (getSelectedOption('#form__priority') == 'low') {
        filterPriority('low');
      }

      if (title.parentNode.getAttribute('data-filtered') == 'true') {

        title.parentNode.style.display = 'flex';
      }

      if (title.parentNode.style.display == 'none') {

        title.parentNode.setAttribute('data-search', 'false');
        title.parentNode.style.display = 'flex';
      }

      title.parentNode.setAttribute('data-search', 'false');
      title.parentNode.setAttribute('data-search-now', 'true');

      if (document.activeElement == inputSearch) {
        title.parentNode.setAttribute('data-search', 'true');
        title.parentNode.setAttribute('data-search-now', 'true');
      }

      title.innerHTML = title.innerText;
    });
  }
});

// Button Effect
var buttons = document.querySelectorAll('.button');

buttons.forEach(function (button) {
  button.addEventListener('click', function (e) {

    var x = e.clientX;
    var y = e.clientY;

    var buttonTop = e.target.offsetTop;
    var buttonLeft = e.target.offsetLeft;

    var xInside = x - buttonLeft;
    var yInside = y - buttonTop;

    var circle = document.createElement('span');

    circle.classList.add('circle');
    circle.style.top = yInside + 'px';
    circle.style.left = xInside + 'px';

    this.appendChild(circle);

    setTimeout(function () {
      circle.remove();
    }, 500);
  });
});