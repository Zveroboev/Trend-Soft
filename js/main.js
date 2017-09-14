'use strict';

(function () {
  var URL_LOAD = 'js/data.json';
  var TABLE = document.querySelector('#table');
  var TABLE_HEAD = TABLE.querySelector('tr');
  var PAGINATION = document.querySelector('.pagination__pages-list-wrapper');
  var ALL_TASKS = document.querySelector('.tasks-table__sum-tasks');
  var ITEMS_ON_PAGE = 20; // Количество ячеек на странице по умолчанию

  // Обработчики ответов сервера
  function addXHREvents(xhr, onLoad, onError) {
    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case 200:
          onLoad(xhr.response);
          break;
        case 400:
          onError('Неверный запрос');
          break;
        case 401:
          onError('Пользователь не авторизован');
          break;
        case 404:
          onError('Ничего не найдено');
          break;
        default:
          onError('Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
  }

  // Получим данные в формате json для занесения в таблицу
  function loadTableData(onLoad, onError) {
    var xhr = new XMLHttpRequest();
    var method = 'GET';

    xhr.responseType = 'json';
    xhr.timeout = 10000;
    xhr.open(method, URL_LOAD);
    addXHREvents(xhr, onLoad, onError);
    xhr.send();
  }

  //Генерируем структуру пагинации
  function renderPagination(all, number) {
    number = number || ITEMS_ON_PAGE;
    all = all || window.allTasks.length;
    // Находим количество страниц пагинации
    var pages = Math.ceil(all / number);

    var paginationList = document.createElement('ul');
    var paginationItem = document.createElement('li');
    var paginationLink = document.createElement('a');

    paginationList.classList.add('pagination__pages-list');
    paginationItem.classList.add('pagination__pages-item');
    paginationLink.classList.add('pagination__pages-item-link');

    for (var i = 0; i < pages; i++) {
      var linkElement = paginationLink.cloneNode();
      var itemElement = paginationItem.cloneNode();

      linkElement.textContent = i + 1;
      itemElement.appendChild(linkElement);
      paginationList.appendChild(itemElement);
    }
    PAGINATION.innerHTML = '';
    PAGINATION.appendChild(paginationList);
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

  // Отрисовываем таблицу в браузере
  function renderTable(data, quantity) {
    var fragment = document.createDocumentFragment();

    quantity = quantity || data.length;
    TABLE.innerHTML = '';
    TABLE.appendChild(TABLE_HEAD);

    for (var i = 0; i < quantity; i++) {
      fragment.appendChild(renderTableStructure(data[i]));
    }
    TABLE.appendChild(fragment);
    ALL_TASKS.textContent = data.length;

    renderPagination(data.length, quantity);
  }

  // Обработчик загрузки данных
  function onLoad(data) {
    window.allTasks = data;
    ALL_TASKS.textContent = data.length;
    renderTable(data, ITEMS_ON_PAGE);
  }

  loadTableData(onLoad);

  // Получаем обертку элементов с выбором отображаемого кол-ва задач
  var pagesInTable = document.querySelector('.pagination__sum-list');

  // Обработчик клика по элементу с количеством отображаемых задач
  function onPageSelectionClick(evt) {
    evt.preventDefault();

    if (evt.target.classList.contains('pagination__sum-item-link')) {
      var option = evt.target.textContent;

      // Удаляем класс активного элемента и вешаем его на новый
      evt.currentTarget.querySelector('.pagination__sum-item--current').classList.remove('pagination__sum-item--current');
      evt.target.classList.add('pagination__sum-item--current');

      // Проверяем на число
      if (isNaN(option)) {
        renderTable(window.allTasks);
      } else {
        renderTable(window.allTasks, option);
      }
    }
  }

  // Вешаем обработчик события с помощью делегирования
  pagesInTable.addEventListener('click', onPageSelectionClick);


})();
