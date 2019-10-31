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

    id++;

    modalFormTitle.value = '';
    modalFormDescription.value = '';
    modalFormPriority.value = 'high';

    if (todoListEmpty) {
      todoListEmpty.style.display = 'none';
    }

    closeModal();

    localStorage.setItem('TODO', JSON.stringify(LIST));

  }

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
  } else if (nameClass.contains('todo-menu__item_delete')) {
    removeTodo(elem);
  } else if (nameClass.contains('todo-menu__item_edit')) {
    getTodoValue(elem);
    openModal();
    // editTodo(elem);
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

// function editTodo(elem) {
// console.log(101);

//   saveButton.addEventListener('click', () => {
//     // LIST[elem.id].title = modalFormTitle.value;



//     closeModal();
//   });


// }
