export function initFiltering(elements, onChange) {
  // Обновляем options в select на основе индексов, полученных с сервера
  const updateIndexes = (elements, indexes) => {
    Object.keys(indexes).forEach((elementName) => {
      elements[elementName].append(
        ...Object.values(indexes[elementName]).map((name) => {
          const el = document.createElement("option");
          el.textContent = name;
          el.value = name;
          return el;
        })
      );
    });
  };

  // Навешиваем автоматическое применение фильтров при изменении input/select
  Object.values(elements).forEach((el) => {
    if (!el) return;
    if (el.tagName === "INPUT") el.addEventListener("input", () => onChange());
    if (el.tagName === "SELECT")
      el.addEventListener("change", () => onChange());
  });

  // Применяем фильтры к query для запроса на сервер
  const applyFiltering = (query, state, action) => {
    // --- Сбрасываем все фильтры при нажатии кнопки Reset ---
    if (action && action.dataset.name === "reset") {
      Object.keys(elements).forEach((key) => {
        const el = elements[key];
        if (!el) return;
        if (["INPUT", "SELECT"].includes(el.tagName)) el.value = "";
      });
      state.filter = {};
      return query;
    }

    // --- Сбрасываем конкретное поле при нажатии кнопки Clear ---
    if (action && action.name === "clear" && action.dataset.field) {
      const field = action.dataset.field;
      const el = elements[`searchBy${field[0].toUpperCase()}${field.slice(1)}`];
      if (el) el.value = "";
      if (state.filter) delete state.filter[field];
    }

    // --- Собираем текущие значения фильтров в объект для запроса на сервер ---
    const filter = {};
    Object.keys(elements).forEach((key) => {
      const el = elements[key];
      if (!el) return;
      if (["INPUT", "SELECT"].includes(el.tagName) && el.value) {
        filter[`filter[${el.name}]`] = el.value;
      }
    });

    state.filter = filter;

    // Если фильтры есть, объединяем с query, иначе возвращаем исходный query
    return Object.keys(filter).length ? { ...query, ...filter } : query;
  };

  return { updateIndexes, applyFiltering };
}
