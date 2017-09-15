'use strict';

(function () {
  var URL = {
    ALL: 'js/JSON/data.json',
    DEC: 'js/JSON/december-tasks.json',
    NOV: 'js/JSON/november-tasks.json'
  };

  var SUM_TASKS = document.querySelector('.tasks-table__sum-tasks');
  var ITEMS_ON_PAGE = 20; // Количество ячеек на странице по умолчанию
  var FIRST_ELEMENT = 0; // Первый элемент массива с данными

  var TABLE = document.querySelector('#table');
  var TABLE_HEAD = TABLE.querySelector('tr');
  var TASKS_IN_TABLE = document.querySelector('.pagination__sum-list');
  var PAGINATION = document.querySelector('.pagination__pages-list-wrapper');
  var SELECT = document.querySelector('.tasks-table__filter-date');

  var tasks = [];

  // Обработчик данных после загрузки
  function onLoad(data) {
    SUM_TASKS.textContent = data.length; // Указываем общее число загруженных данных
    tasks = data;
    window.renderTable(FIRST_ELEMENT, ITEMS_ON_PAGE, window.renderPagination);
  }

  // Отрисовываем таблицу на странице
  window.renderTable = function (firstElement, lastElement, callback) {
    var fragment = document.createDocumentFragment();
    // Если число отрисованных элементов больше длины массива, то выбираем длину массива
    lastElement = lastElement < tasks.length ? lastElement : tasks.length;
    // Очищаем таблицу и вставляем шапку
    TABLE.innerHTML = '';
    TABLE.appendChild(TABLE_HEAD);
    // Добавляем в фрагмент строки таблицы. Пушим фрагмент в таблицу
    for (var i = firstElement; i < lastElement; i++) {
      fragment.appendChild(renderTableStructure(tasks[i]));
    }
    TABLE.appendChild(fragment);
    //Строим пагинацию если надо
    if (callback) {
      callback(tasks.length, lastElement);
    }
  };

  // Генерируем структуру строки таблицы
  function renderTableStructure(element) {
    var row = document.querySelector('#table-template').content.cloneNode(true);

    row.querySelector('.table__data--1').textContent = '';
    row.querySelector('.table__data--2').textContent = element.tiket;
    row.querySelector('.table__data--3').textContent = element.name;
    row.querySelector('.table__data--4').textContent = '';
    row.querySelector('.table__data--5').textContent = element.status;
    row.querySelector('.table__data--6').textContent = element.result;
    row.querySelector('.table__data--7').textContent = element.created;
    row.querySelector('.table__data--8').textContent = element.update;
    row.querySelector('.table__data--9').textContent = element.deadline;
    row.querySelector('.table__data--10').textContent = '';

    return row;
  }

  // Запускаем загрузку данных при открытии страницы
  window.loadData(onLoad, console.log, URL.ALL);

  // Следим за изменениеми
  SELECT.addEventListener('change', onSelectChange);
  TASKS_IN_TABLE.addEventListener('click', onPageSelectionClick);
  PAGINATION.addEventListener('click', onPaginationClick);
})();
