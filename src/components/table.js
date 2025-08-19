import { cloneTemplate } from "../lib/utils.js";

/**
 * Инициализируем таблицу и вызываем коллбэк при любых изменениях и нажатиях на кнопки
 * @param {Object} settings - настройки таблицы
 * @param {(action: HTMLButtonElement | undefined) => void} onAction - коллбэк на изменения/действия
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
  const { tableTemplate, rowTemplate, before, after } = settings;
  const root = cloneTemplate(tableTemplate);

  // Вставляем дополнительные шаблоны до таблицы
  before
    .slice()
    .reverse()
    .forEach((subName) => {
      root[subName] = cloneTemplate(subName);
      root.container.prepend(root[subName].container);
    });

  // Вставляем дополнительные шаблоны после таблицы
  after.forEach((subName) => {
    root[subName] = cloneTemplate(subName);
    root.container.append(root[subName].container);
  });

  // Обработчики событий: change, reset, submit
  root.container.addEventListener("change", onAction);

  root.container.addEventListener("reset", () => {
    setTimeout(onAction);
  });

  root.container.addEventListener("submit", (e) => {
    e.preventDefault();
    onAction(e.submitter);
  });

  /**
   * Рендерит данные в таблицу
   * @param {Array<Object>} data - массив объектов с данными для таблицы
   */
  const render = (data) => {
    const nextRows = [];
    data.forEach((item) => {
      const row = cloneTemplate(rowTemplate);

      Object.keys(item).forEach((key) => {
        const el = row.elements[key];
        if (el) {
          if (el.tagName === "INPUT" || el.tagName === "SELECT") {
            el.value = item[key];
          } else {
            el.textContent = item[key];
          }
        }
      });

      nextRows.push(row.container);
    });
    root.elements.rows.replaceChildren(...nextRows);
  };

  return { ...root, render };
}
