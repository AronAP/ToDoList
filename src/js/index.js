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
    addTodoList(item.title, item.description, item.priority, item.id, item.done, item.trash);
  });
}

function getListLength() {
  const item = todoList.querySelectorAll('.todo__item');

  return item.length;
}

function openModal() {
  modal.style.display = 'block';
  document.body.style.overflowY = 'hidden';
}

function closeModal() {
  modal.style.display = 'none';
  document.body.style.overflowY = '';
}

createButton.addEventListener('click', () => {
  openModal();
});

cancelButton.addEventListener('click', () => {
  closeModal();
});

modalOverlay.addEventListener('click', () => {
  closeModal();
});

function addTodoList(title, description, priority, id, done, trash) {

  if (trash) {
    return;
  }

  const item = `<div class="todo__item" data-done="${done}">
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
  const titleValue = modalFormTitle.value;
  const DescriptionValue = modalFormDescription.value;
  const PriorityValue = modalFormPriority.value;

  return {
    title: titleValue,
    description: DescriptionValue,
    priority: PriorityValue
  };
}

saveButton.addEventListener('click', () => {

  if (saveButton.dataset.isedit == 'false') {

    const modalValue = getModalValue();

    if (modalValue.title && modalValue.priority) {

      addTodoList(modalValue.title, modalValue.description, modalValue.priority, id, false, false);

      LIST.push({
        title: modalValue.title,
        description: modalValue.description,
        priority: modalValue.priority,
        id,
        done: false,
        trash: false
      });

      id += 1;

      modalFormTitle.value = '';
      modalFormDescription.value = '';
      modalFormPriority.value = 'high';
      // говнокод
      if (todoListEmpty) {
        todoListEmpty.style.display = 'none';
      }

      closeModal();

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

    closeModal();
  }

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
    completeTodo(elem);

    if (getSelectedOption('#form__state') == 'done') {
      filterState('false');
    } else if (getSelectedOption('#form__state') == 'open') {
      filterState('true');
    }

  } else if (nameClass.contains('todo-menu__item_delete')) {
    removeTodo(elem);
  } else if (nameClass.contains('todo-menu__item_edit')) {
    getTodoValue(elem);
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

// Search bt TITLE (only the first occurrence)
function highlightingSearch(str, pos, len) {
  return `${str.slice(0, pos)}<mark>${str.slice(pos, pos + len)}</mark>${str.slice(pos + len)}`;
}

inputSearch.addEventListener('focus', () => {
  inputSearch.select();
});

inputSearch.addEventListener('input', () => {

  const titleTodo = todoList.querySelectorAll('.todo__title');

  let valInput = inputSearch.value.trim();

  if (valInput != '') {

    titleTodo.forEach(title => {
      let titleText = title.textContent;
      let search = titleText.search(valInput);

      if (search == -1) {
        title.parentNode.style.display = 'none';
        title.innerHTML = title.innerText;
      } else {
        title.parentNode.style.display = 'block';

        let str = title.innerText;

        title.innerHTML = highlightingSearch(str, search, valInput.length);
      }
    });

  } else {

    titleTodo.forEach(title => {
      title.parentNode.style.display = 'block';
      title.innerHTML = title.innerText;
    });

  }
});

// function filterEmpty() {
// }

const itemTodo = todoList.querySelectorAll('.todo__item');

function filterTodoAll() {

  itemTodo.forEach(item => {

    item.style.display = 'block';

  });

}

function filterState(stateBool) {

  itemTodo.forEach(item => {

    item.style.display = 'block';

    if (item.dataset.done == stateBool) {
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

  let option = getSelectedOption('#form__state');

  if (option == 'open') {
    filterState('true');
  } else if (option == 'done') {
    filterState('false');
  } else {
    filterTodoAll();
  }

});

function filterPriority(priorityText) {

  itemTodo.forEach(item => {

    item.style.display = 'block';

    const priorityElemText = item.querySelector('.todo__priority').textContent;

    if (priorityElemText != priorityText) {
      item.style.display = 'none';
    }

  });

}

selectPriority.addEventListener('change', () => {

  let option = getSelectedOption('#form__priority');

  if (option == 'high') {
    filterPriority('high');
  } else if (option == 'normal') {
    filterPriority('normal');
  } else if (option == 'low') {
    filterPriority('low');
  } else {
    filterTodoAll();
  }

});

// reset select for FireFox
if (sessionStorage.getItem('is_reloaded')) {

  const selectAll = todoForm.querySelectorAll('select');

  for (let i = 0; i < selectAll.length; i += 1) {
    let select = selectAll[i];

    select.value = 'all';
  }
}
