'use strict';

(function () {
  var pagination = document.querySelector('.pagination__pages-list-wrapper');

  //Генерируем структуру пагинации
  window.renderPagination = function (allTasks, tasksOnPage) {
    // Находим количество страниц пагинации
    var pages = Math.ceil(allTasks / tasksOnPage);
    // Если страница одна, то пагинацию не строим
    if (pages <= 1) {
      pagination.innerHTML = '';
      return;
    }
    // Создаем элементы пагинации
    var paginationList = document.createElement('ul');
    var paginationItem = document.createElement('li');
    var paginationLink = document.createElement('a');
    // Добавляем элементов классы со стилизацией
    paginationList.classList.add('pagination__pages-list');
    paginationItem.classList.add('pagination__pages-item');
    paginationLink.classList.add('pagination__pages-item-link');
    // Создаем список элементов пагинации
    for (var i = 0; i < pages; i++) {
      var linkElement = paginationLink.cloneNode();
      var itemElement = paginationItem.cloneNode();

      linkElement.textContent = (i + 1).toString();
      itemElement.appendChild(linkElement);
      paginationList.appendChild(itemElement);
    }
    // Очищаем таблицу и вставляем новый список
    pagination.innerHTML = '';
    pagination.appendChild(paginationList);
    // Задаем первому элементу пагинации активный класс
    if (pages > 1) {
      var firstElement = pagination.querySelectorAll('.pagination__pages-item')[0];

      firstElement.classList.add('pagination__pages-item--current');
    }
  }
})();
