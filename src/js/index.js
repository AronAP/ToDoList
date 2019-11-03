'use strict';

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

if (data) {
  LIST = JSON.parse(data);
  id = LIST.length;
  loadList(LIST);
} else {
  LIST = [];
  id = 0;
}

if (getListLength() == 0) {
  todoListEmpty.style.display = 'block';
} else {
  todoListEmpty.style.display = 'none';
}

function loadList(array) {
  array.forEach(item => {
    addTodoList(item.id, item.done, item.trash, item.title, item.description, item.priority);
  });
}

headerName.addEventListener('click', () => {
  localStorage.clear();
  location.reload();
});

function getListLength() {
  const item = todoList.querySelectorAll('.todo__item');

  return item.length;
}

function openModal() {
  modal.style.display = 'block';
}

function closeModal() {
  modal.style.display = 'none';
}

function removeInputError() {
  modalFormTitle.style.borderColor = '#000';
  titleError.style.display = 'none';
}

createButton.addEventListener('click', () => {
  openModal();
});

cancelButton.addEventListener('click', () => {
  closeModal();
  removeModalValue();
  removeInputError();
});

modalOverlay.addEventListener('click', () => {
  closeModal();
  removeModalValue();
  removeInputError();
});

function openMore(elem) {
  elem = elem.nextSibling.nextSibling;
  elem.style.display = 'block';
}

function closeMore(elem) {
  elem = elem.parentNode;
  elem.style.display = 'none';
}

function listenDotsButton() {
  const dotsButton = document.querySelectorAll('.todo-menu__dots');

  dotsButton.forEach(btn => {

    btn.addEventListener('click', e => {

      let button = e.target.closest('div');

      if (!button) return;
      if (!btn.contains(button)) return console.log(2);

      openMore(btn);

      setTimeout(() => {
        btn.nextSibling.nextSibling.style.display = 'none';
      }, 2000);

    });

  });
}

listenDotsButton();

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

function removeModalValue() {
  modalFormTitle.value = '';
  modalFormDescription.value = '';
  modalFormPriority.value = 'high';
}

saveButton.addEventListener('click', () => {

  if (saveButton.dataset.isedit == 'false') {

    removeInputError();

    const modalValue = getModalValue();

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

      removeModalValue();

      // говнокод
      if (todoListEmpty) {
        todoListEmpty.style.display = 'none';
      }

      closeModal();

    } else {
      modalFormTitle.style.borderColor = '#e74c3c';
      titleError.style.display = 'block';
    }

  } else {

    let elem = returnEditButtonID();

    editTodo(elem);

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

function completeTodo(elem) {

  const parent = elem.parentNode.parentNode.parentNode.parentNode;

  if (parent.dataset.done == 'false') {
    parent.setAttribute('data-done', 'true');
  } else {
    parent.setAttribute('data-done', 'false');
  }

  LIST[elem.id].done = LIST[elem.id].done ? false : true;
}

function removeTodo(elem) {
  elem.parentNode.parentNode.parentNode.parentNode.remove();

  LIST[elem.id].trash = true;

  if (getListLength() == 0) {
    todoListEmpty.style.display = 'block';
  }
}

todoList.addEventListener('click', e => {

  let elem = e.target;
  let nameClass = elem.classList;

  if (nameClass.contains('todo-menu__item_done')) {
    closeMore(elem);
    completeTodo(elem);

    if (getSelectedOption('#form__state') == 'done') {
      filterState('false');
    } else if (getSelectedOption('#form__state') == 'open') {
      filterState('true');
    }

  } else if (nameClass.contains('todo-menu__item_delete')) {
    closeMore(elem);
    removeTodo(elem);
  } else if (nameClass.contains('todo-menu__item_edit')) {
    getTodoValue(elem);
    closeMore(elem);
    openModal();

    modalFormTitle.select();

    saveButton.setAttribute('data-isedit', 'true');

    returnEditButtonID = () => {
      let elemEdit = elem;

      return elemEdit;
    };

  }

  localStorage.setItem('TODO', JSON.stringify(LIST));

});

function getTodoValue(elem) {
  let titleElem = LIST[elem.id].title;
  let descriptionElem = LIST[elem.id].description;
  let priorityElem = LIST[elem.id].priority;

  modalFormTitle.value = titleElem;
  modalFormDescription.value = descriptionElem;
  modalFormPriority.value = priorityElem;
}

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

function isDisplayNone() {
  const itemTodo = todoList.querySelectorAll('.todo__item');

  itemTodo.forEach(item => {
    if (item.style.display == 'none') {
      item.setAttribute('data-filtered', 'false');
    }
  });
}

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

function getSelectedOption(selectElem) {

  let sel = document.querySelector(selectElem).selectedIndex;
  let options = document.querySelector(selectElem).options;

  return options[sel].value;

}

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

// Search by TITLE

function onBlur() {
  const titleTodo = todoList.querySelectorAll('.todo__title');

  titleTodo.forEach(title => {
    title.parentNode.setAttribute('data-search', 'false');
  });
}
onBlur();

function highlightingSearch(str, pos, len) {
  return `${str.slice(0, pos)}<mark>${str.slice(pos, pos + len)}</mark>${str.slice(pos + len)}`;
}

inputSearch.addEventListener('focus', () => {
  inputSearch.select();

  const titleTodo = todoList.querySelectorAll('.todo__title');

  titleTodo.forEach(title => {

    if (title.parentNode.style.display == 'flex') {
      title.parentNode.setAttribute('data-search', 'true');
      title.parentNode.setAttribute('data-search-now', 'true');
    } else {
      title.parentNode.setAttribute('data-search', 'false');
      title.parentNode.setAttribute('data-search-now', 'false');
    }

  });
});

inputSearch.addEventListener('input', () => {

  const titleTodo = todoList.querySelectorAll('.todo__title');

  let valInput = inputSearch.value.trim();

  if (valInput != '') {

    titleTodo.forEach(title => {
      let titleText = title.textContent;
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
        console.log('filtered');

        title.parentNode.style.display = 'flex';
      }

      if (title.parentNode.style.display == 'none') {
        console.log(1901);

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
