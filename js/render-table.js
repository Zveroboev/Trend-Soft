'use strict';

(function () {
// Отрисовываем таблицу в браузере
  window.renderTable = function (quantity, callback) {
    var fragment = document.createDocumentFragment();

    quantity = quantity < tasks.length ? quantity : tasks.length;
    TABLE.innerHTML = '';
    TABLE.appendChild(TABLE_HEAD);

    for (var i = 0; i < quantity; i++) {
      fragment.appendChild(renderTableStructure(tasks[i]));
    }
    TABLE.appendChild(fragment);
    callback(tasks.length, quantity);
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
})();
