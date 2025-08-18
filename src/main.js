import "./fonts/ys-display/fonts.css";
import "./style.css";

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

// Инициализация API с кэшированием данных
const api = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
  const state = processFormData(new FormData(sampleTable.container));
  const rowsPerPage = parseInt(state.rowsPerPage);
  const page = parseInt(state.page ?? 1);

  return {
    ...state,
    rowsPerPage,
    page,
  };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
async function render(action) {
  let state = collectState();
  let query = {};

  // Применяем поиск, фильтры, сортировку и пагинацию
  query = applySearching(query, state, action);
  query = applyFiltering(query, state, action);
  query = applySorting(query, state, action);
  query = applyPagination(query, state, action);

  // Получаем данные с сервера
  const { total, items } = await api.getRecords(query);

  // Обновляем пагинацию и рендерим таблицу
  updatePagination(total, query);
  sampleTable.render(items);
}

// Инициализация таблицы с шаблонами и коллбэком на изменения
const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ["search", "header", "filter"],
    after: ["pagination"],
  },
  render
);

// Инициализация поиска
const applySearching = initSearching("search");

// Инициализация фильтров и обновление индексов
const { applyFiltering, updateIndexes } = initFiltering(
  sampleTable.filter.elements
);

// Инициализация сортировки по колонкам
const applySorting = initSorting([
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal,
]);

// Инициализация пагинации
const { applyPagination, updatePagination } = initPagination(
  sampleTable.pagination.elements,
  (el, page, isCurrent) => {
    const input = el.querySelector("input");
    const label = el.querySelector("span");
    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;
    return el;
  }
);

// Добавляем таблицу в корень приложения
const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

// Получение индексов продавцов и обновление фильтра
async function init() {
  const indexes = await api.getIndexes();
  updateIndexes(sampleTable.filter.elements, {
    searchBySeller: indexes.sellers,
  });
}

// Запуск приложения и первичная отрисовка таблицы
init().then(render);
