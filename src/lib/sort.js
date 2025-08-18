/**
 * Функция сортировки по возрастанию для указанного поля объекта
 * @param {string} field - имя поля объекта
 * @returns {Function} - функция сравнения для sort/toSorted
 */
const sortUp = (field) => (a, b) => {
  if (a[field] > b[field]) {
    return 1;
  }
  if (a[field] < b[field]) {
    return -1;
  }
  return 0;
};

/**
 * Функция сортировки по убыванию для указанного поля объекта
 * @param {string} field - имя поля объекта
 * @returns {Function} - функция сравнения для sort/toSorted
 */
const sortDown = (field) => (a, b) => {
  if (a[field] < b[field]) {
    return 1;
  }
  if (a[field] > b[field]) {
    return -1;
  }
  return 0;
};

/**
 * Объект, хранящий функции сортировки для удобного доступа по имени
 */
const sortFn = {
  up: sortUp,
  down: sortDown,
};

/**
 * Карта переключения состояний сортировки
 */
export const sortMap = {
  none: "up", // Из "без сортировки" переходим в "по возрастанию"
  up: "down", // Из "по возрастанию" переходим в "по убыванию"
  down: "none", // Из "по убыванию" переходим в "без сортировки"
};

/**
 * Функция для сортировки массива объектов по указанному полю и направлению
 * @param {Array} arr - массив объектов
 * @param {string | null} field - поле для сортировки
 * @param {string | null} order - направление: 'none', 'up' или 'down'
 * @returns {Array} - новый массив или исходный, если сортировка не нужна
 */
export function sortCollection(arr, field, order) {
  if (field && order !== "none" && sortMap[order])
    return arr.toSorted(sortFn[order](field));
  else return arr;
}
