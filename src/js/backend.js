'use strict';

(function () {
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
  window.loadData = function (onLoad, onError, URL) {
    var xhr = new XMLHttpRequest();
    var method = 'GET';

    xhr.responseType = 'json';
    xhr.timeout = 10000;
    xhr.open(method, URL);
    addXHREvents(xhr, onLoad, onError);
    xhr.send();
  };
})();
