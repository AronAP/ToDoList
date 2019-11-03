'use strict';

// Track page reload.
sessionStorage.setItem('is_reloaded', true);

const todoForm = document.querySelector('.todo-form');
const inputSearch = document.querySelector('.form__search');
const selectState = document.querySelector('#form__state');
const selectPriority = document.querySelector('#form__priority');
const createButton = document.querySelector('.form__button');
const modal = document.querySelector('.modal');
const modalOverlay = document.querySelector('.modal__overlay');
const cancelButton = document.querySelector('#modal-form__cancel');
const saveButton = document.querySelector('#modal-form__save');
const modalForm = document.querySelector('#modal-form');
const modalFormTitle = modalForm.querySelector('#modal-form__title');
const modalFormDescription = modalForm.querySelector('#modal-form__descr');
const modalFormPriority = modalForm.querySelector('#modal-form__priority');
const todoList = document.querySelector('.todo__list');
const todoListEmpty = document.querySelector('.todo__list_empty');
const headerName = document.querySelector('.header__name');
const titleError = document.querySelector('#modal-form__error');

let returnEditButtonID;
let LIST, id;
let data = localStorage.getItem('TODO');

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
  array.forEach(item => {
    addTodoList(item.id, item.done, item.trash, item.title, item.description, item.priority);
  });
}

// Reset localStorage when you click on the table of contents.
headerName.addEventListener('click', () => {
  localStorage.clear();
  location.reload();
});

/**
 * Counts the number of task cards.
 *
 * @returns {number} item - number of cards.
 */
function getListLength() {
  const item = todoList.querySelectorAll('.todo__item');

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
createButton.addEventListener('click', () => {
  openModal();
});

// Clicking the Cancel button closes a modal window and resets the input data.
cancelButton.addEventListener('click', () => {
  closeModal();
  removeModalValue();
  removeInputError();
});

// Clicking the modal overlay closes a modal window and resets the input data.
modalOverlay.addEventListener('click', () => {
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
  const dotsButton = document.querySelectorAll('.todo-menu__dots');

  dotsButton.forEach(btn => {

    btn.addEventListener('click', e => {

      let button = e.target.closest('div');

      if (!button) return;
      if (!btn.contains(button)) return;

      openMore(btn);

      // Hides the menu after 2 seconds.
      setTimeout(() => {
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

  const item = `<div class="todo__item" data-done="${done}" data-filtered="false" data-search="false" data-search-now="true" style="display: flex;">
                  <div class="todo__title">${title}</div>
                  <div class="todo__descr">${description}</div>
                  <div class="todo__tags">
                    <div class="todo__priority">${priority}</div>
                    <div class="todo__menu todo-menu">
                      <div class="todo-menu__dots"><span>...</span></div>
                      <ul class="todo-menu__items">
                        <li class="todo-menu__item todo-menu__item_done" id="${id}">done</li>
                        <li class="todo-menu__item todo-menu__item_edit" id="${id}">edit</li>
                        <li class="todo-menu__item todo-menu__item_delete" id="${id}">delete</li>
                      </ul>
                    </div>
                  </div>
                </div>
                    `;

  todoList.insertAdjacentHTML('afterbegin', item);

}

/**
 * Returns the values ​​from the fields of a modal window.
 *
 * @returns {Object} - title, description, priority
 */
function getModalValue() {
  const titleValue = modalFormTitle.value.toLowerCase();
  const descriptionValue = modalFormDescription.value.toLowerCase();
  const PriorityValue = modalFormPriority.value;

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
saveButton.addEventListener('click', () => {

  if (saveButton.dataset.isedit == 'false') {

    removeInputError();

    const modalValue = getModalValue();

    // check for entered values.
    if (modalValue.title && modalValue.priority) {

      addTodoList(id, false, false, modalValue.title, modalValue.description, modalValue.priority);

      LIST.push({
        id,
        done: false,
        trash: false,
        title: modalValue.title,
        description: modalValue.description,
        priority: modalValue.priority,
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
    let elem = returnEditButtonID();

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

  const parent = elem.parentNode.parentNode.parentNode.parentNode;

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

  let titleModal = modalFormTitle.value;
  let descriptionModal = modalFormDescription.value;
  let priorityModal = modalFormPriority.value;

  LIST[elem.id].title = titleModal;
  LIST[elem.id].description = descriptionModal;
  LIST[elem.id].priority = priorityModal;

  let editTitle = elem.parentNode.parentNode.parentNode.parentNode.querySelector('.todo__title');
  let editDescription = elem.parentNode.parentNode.parentNode.parentNode.querySelector('.todo__descr');
  let editPriority = elem.parentNode.parentNode.parentNode.parentNode.querySelector('.todo__priority');

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
  let titleElem = LIST[elem.id].title;
  let descriptionElem = LIST[elem.id].description;
  let priorityElem = LIST[elem.id].priority;

  modalFormTitle.value = titleElem;
  modalFormDescription.value = descriptionElem;
  modalFormPriority.value = priorityElem;
}

// Tracks the click on the buttons from the menu.
todoList.addEventListener('click', e => {

  let elem = e.target;
  let nameClass = elem.classList;

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
    returnEditButtonID = () => {
      let elemEdit = elem;

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
  const itemTodo = todoList.querySelectorAll('.todo__item');

  itemTodo.forEach(item => {
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
  const itemTodo = todoList.querySelectorAll('.todo__item');

  itemTodo.forEach(item => {

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
  const itemTodo = todoList.querySelectorAll('.todo__item');

  itemTodo.forEach(item => {

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
  const itemTodo = todoList.querySelectorAll('.todo__item');

  itemTodo.forEach(item => {

    if (item.getAttribute('data-search-now') == 'true') {

      const priorityElemText = item.querySelector('.todo__priority').textContent;

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

  let sel = document.querySelector(selectElem).selectedIndex;
  let options = document.querySelector(selectElem).options;

  return options[sel].value;

}

// Listens to changes on select State.
selectState.addEventListener('change', () => {

  let optionState = getSelectedOption('#form__state');
  let optionPriority = getSelectedOption('#form__priority');


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
selectPriority.addEventListener('change', () => {

  let optionPriority = getSelectedOption('#form__priority');
  let optionState = getSelectedOption('#form__state');

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

  const selectAll = todoForm.querySelectorAll('select');

  for (let i = 0; i < selectAll.length; i += 1) {
    let select = selectAll[i];

    select.value = 'all';
  }

  const inputAll = todoForm.querySelectorAll('input');

  for (let i = 0; i < inputAll.length; i += 1) {
    let select = inputAll[i];

    select.value = '';
  }
}

/**
 * Checks for focus off input search.
 *
 */
function onBlur() {
  const titleTodo = todoList.querySelectorAll('.todo__title');

  titleTodo.forEach(title => {
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
  return `${str.slice(0, pos)}<mark>${str.slice(pos, pos + len)}</mark>${str.slice(pos + len)}`;
}

// Listens for a focus event on input search
inputSearch.addEventListener('focus', () => {
  inputSearch.select();

  const titleTodo = todoList.querySelectorAll('.todo__title');

  titleTodo.forEach(title => {

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
inputSearch.addEventListener('input', () => {

  const titleTodo = todoList.querySelectorAll('.todo__title');

  let valInput = inputSearch.value.trim();

  if (valInput != '') {

    titleTodo.forEach(title => {
      let titleText = title.textContent;

      // if there are no matches, then returns -1.
      let search = titleText.search(valInput);

      if (search == -1) {
        title.parentNode.setAttribute('data-search-now', 'false');
        title.parentNode.style.display = 'none';
        title.innerHTML = title.innerText;
      } else {

        if (title.parentNode.dataset.search == 'true') {
          let str = title.innerText;

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
    titleTodo.forEach(title => {

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
const buttons = document.querySelectorAll('.button');

buttons.forEach(button => {
  button.addEventListener('click', function (e) {

    let x = e.clientX;
    let y = e.clientY;

    let buttonTop = e.target.offsetTop;
    let buttonLeft = e.target.offsetLeft;

    let xInside = x - buttonLeft;
    let yInside = y - buttonTop;

    let circle = document.createElement('span');

    circle.classList.add('circle');
    circle.style.top = yInside + 'px';
    circle.style.left = xInside + 'px';

    this.appendChild(circle);

    setTimeout(() => {
      circle.remove();
    }, 500);
  });
});
