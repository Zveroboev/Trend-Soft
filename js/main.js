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
  var SEARCH = document.querySelector('#search');

  var tasks = [];

  // Обработчик данных после загрузки
  function onLoad(data) {
    // Указываем общее число загруженных данных
    SUM_TASKS.textContent = data.length;
    // Из-за невозможности обращаться к серверу и т.к. переменная используется через замыкание
    // для того, что бы не затереть переменную при фильтрации через поиск выношу ее в глобал
    window.tasks = data;
    renderTable(FIRST_ELEMENT, ITEMS_ON_PAGE, true);
  }

  // Отрисовываем таблицу на странице
  function renderTable(firstElement, lastElement, boolean, data) {
    var fragment = document.createDocumentFragment();
    // Если не передали массив с данными, то берем из замыкания
    tasks = data || window.tasks;
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
    if (boolean) {
      window.renderPagination(tasks.length, lastElement);
    }
  }

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

  // Меняем классы выбранных элементов
  function swapCurrentClass(evt, className) {
    evt.currentTarget.querySelector('.' + className).classList.remove(className);
    evt.target.classList.add(className);
  }

  // Проверяем на наличие введенного в поиск текста в каждом объекте массива с данными (строке таблицы)
  function hasValueInObject(item, value) {
    var boolean = false;

    for (var key in item) {
      var objValue = item[key].toString().toLowerCase();

      if (objValue.indexOf(value) !== -1) {
        boolean = true;
        break;
      }
    }
    return boolean;
  }

  // Получаем новые данные при изменении значения select
  function onSelectChange(evt) {
    // Удаляем класс прошлого активного элемента и возвращаем его элементу по умолчанию
    var form = document.querySelector('.pagination__sum-list');
    form.querySelector('.pagination__sum-item--current').classList.remove('pagination__sum-item--current');
    form.querySelector('.pagination__sum-item').classList.add('pagination__sum-item--current');
    // Скачиваем данные в зависимости от выбора сортировки
    switch (evt.target.value) {
      case 'All':
        window.loadData(onLoad, console.log, URL.ALL);
        break;
      case 'December':
        window.loadData(onLoad, console.log, URL.DEC);
        break;
      case 'October':
        window.loadData(onLoad, console.log, URL.NOV);
        break;
    }
  }

  // Обработчик клика по элементу с количеством отображаемых задач
  function onPageSelectionClick(evt) {
    evt.preventDefault();

    if (evt.target.classList.contains('pagination__sum-item-link')) {
      swapCurrentClass(evt, 'pagination__sum-item--current');
      // Берем значение елемента
      var option = parseInt(evt.target.textContent, 10);
      // Если не число, то выводим всю таблицу, иначе выбранное число
      if (isNaN(option)) {
        renderTable(FIRST_ELEMENT, tasks.length, true);
      } else {
        renderTable(FIRST_ELEMENT, option, true);
      }
    }
  }

  // Обработчик клика по пагинации
  function onPaginationClick(evt) {
    evt.preventDefault();

    if (evt.target.classList.contains('pagination__pages-item-link')) {
      swapCurrentClass(evt, 'pagination__pages-item--current');
      // Находим текую страницу и количество задач в таблице
      var elementOnPage = document.querySelector('.pagination__sum-item--current').textContent;
      var currentPage = document.querySelector('.pagination__pages-item--current').textContent;
      // Генерируем таблицу в зависимости от нажатой пагинации
      renderTable(elementOnPage * (currentPage - 1), currentPage * elementOnPage, false)
    }
  }

  //Обработчик ввода текста в поле поиска
  function onSearchInputText(evt) {
    // Берем значение введеное в поле без учета регистра
    var value = evt.target.value.toLowerCase();
    // Возвращаем в новый массив значения в которых совпадает с введенным текстом
    var sortedArray = window.tasks.filter(function (item) {
      // Проверем каждый ключ в массиве объектов
      return hasValueInObject(item, value);
    });

    renderTable(FIRST_ELEMENT, ITEMS_ON_PAGE, true, sortedArray);
  }

  // Следим за изменениеми
  SELECT.addEventListener('change', onSelectChange);
  TASKS_IN_TABLE.addEventListener('click', onPageSelectionClick);
  PAGINATION.addEventListener('click', onPaginationClick);
  SEARCH.addEventListener('keyup', function (evt) {
    window.setDelay(function () {
      onSearchInputText(evt);
    });
  });
})();
