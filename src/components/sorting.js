import { sortMap } from "../lib/sort.js";

// Инициализация сортировки: возвращаем функцию для применения сортировки по колонкам
export function initSorting(columns) {
  // Возвращаемая функция обновляет объект запроса на основе выбранной колонки и направления сортировки
  return (query, state, action) => {
    let field = null;
    let order = null;

    if (action && action.name === "sort") {
      // Меняем состояние сортировки выбранной колонки
      action.dataset.value = sortMap[action.dataset.value];
      field = action.dataset.field;
      order = action.dataset.value;

      // Сбрасываем сортировку у остальных колонок
      columns.forEach((column) => {
        if (column.dataset.field !== action.dataset.field) {
          column.dataset.value = "none";
        }
      });
    } else {
      // Если нет действия, ищем активную сортировку среди колонок
      columns.forEach((column) => {
        if (column.dataset.value !== "none") {
          field = column.dataset.field;
          order = column.dataset.value;
        }
      });
    }

    // Формируем строку сортировки "field:order" или null, если сортировка не применена
    const sort = field && order !== "none" ? `${field}:${order}` : null;

    return sort ? Object.assign({}, query, { sort }) : query;
  };
}
