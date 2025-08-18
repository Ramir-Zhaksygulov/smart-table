// Инициализация поиска: возвращаем функцию для применения фильтра поиска
export function initSearching(searchField) {
  // Возвращаемая функция добавляет параметр `search` в объект запроса,
  // если поле состояния таблицы содержит значение
  return (query, state) => {
    return state[searchField]
      ? Object.assign({}, query, {
          search: state[searchField],
        })
      : query; // если значение пустое — возвращаем исходный объект без изменений
  };
}
