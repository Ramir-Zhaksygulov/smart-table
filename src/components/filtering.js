import { createComparison, defaultRules } from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
  // @todo: #4.1 — заполнить выпадающие списки опциями
  Object.keys(indexes) // Получаем ключи из объекта
    .forEach((elementName) => {
      // Перебираем по именам
      elements[elementName].append(
        // В каждый элемент добавляем опции
        ...Object.values(indexes[elementName]) // Получаем массив значений
          .map((name) => {
            // Создаём теги <option>
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            return option;
          })
      );
    });

  return (data, state, action) => {
    // @todo: #4.2 — обработать очистку поля
    if (action?.name === "clear") {
      const fieldName = action.dataset.field; // например, "searchBySeller"
      const container = action.closest("div"); // родительский контейнер
      const input = container.querySelector(`[name="${fieldName}"]`);

      if (input) {
        input.value = ""; // сбрасываем выбранное значение
        delete state[fieldName]; // убираем его из состояния
      }
    }

    const filteredState = Object.fromEntries(
      Object.keys(indexes).map((key) => [key, state[key]])
    );

    // @todo: #4.5 — отфильтровать данные используя компаратор
    return data.filter((row) => compare(row, state));
  };
}
