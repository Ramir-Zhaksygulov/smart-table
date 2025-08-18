// Инициализация фильтров: возвращаем методы для обновления опций и применения фильтрации
export function initFiltering(elements) {
  // Обновляем опции фильтров на основе переданных индексов
  const updateIndexes = (elements, indexes) => {
    Object.keys(indexes).forEach((elementName) => {
      elements[elementName].append(
        ...Object.values(indexes[elementName]).map((name) => {
          const el = document.createElement("option");
          el.textContent = name; // отображаемое имя
          el.value = name; // значение для запроса
          return el;
        })
      );
    });
  };

  // Применяем выбранные значения фильтров и возвращаем объект запроса
  // Параметры state и action передаются для унификации сигнатур с другими функциями
  const applyFiltering = (query, state, action) => {
    const filter = {};
    Object.keys(elements).forEach((key) => {
      if (elements[key]) {
        if (
          ["INPUT", "SELECT"].includes(elements[key].tagName) &&
          elements[key].value
        ) {
          filter[`filter[${elements[key].name}]`] = elements[key].value;
        }
      }
    });

    // Если есть активные фильтры, объединяем их с текущим объектом запроса
    return Object.keys(filter).length
      ? Object.assign({}, query, filter)
      : query; 
  };

  return {
    updateIndexes,
    applyFiltering,
  };
}
