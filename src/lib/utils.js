/**
 * Клонирует шаблон и собирает все элементы с атрибутом data-name
 * @param {string} templateId - ID шаблона в документе
 * @returns {{container: Node, elements: unknown}} - контейнер и именованные элементы
 */
export function cloneTemplate(templateId) {
    const template = document.getElementById(templateId);
    const clone = template.content.firstElementChild.cloneNode(true);

    const elements = Array.from(clone.querySelectorAll('[data-name]')).reduce((acc, el) => {
        acc[el.dataset.name] = el;
        return acc;
    }, {});

    return {
        container: clone,
        elements: elements
    };
}

/**
 * Преобразует объект FormData в обычный объект
 * @param {FormData} formData - данные формы
 * @returns {Object} - объект с ключами и значениями полей
 */
export function processFormData(formData) {
    return Array.from(formData.entries()).reduce((result, [key, value]) => {
        result[key] = value;
        return result;
    }, {});
}

/**
 * Преобразует коллекцию в объект-индекс по уникальному полю
 * @param {Array} arr - массив объектов
 * @param {string} field - уникальное поле объекта
 * @param {(Object) => any} val - функция преобразования значения
 * @returns {Object} - объект, индексированный по полю
 */
export const makeIndex = (arr, field, val) => arr.reduce((acc, cur) => ({
    ...acc,  
    [cur[field]]: val(cur) 
}), {});

/**
 * Возвращает массив номеров страниц для пагинации
 * @param {number} currentPage - текущая страница
 * @param {number} maxPage - максимальная страница
 * @param {number} limit - количество отображаемых страниц
 * @returns {number[]} - массив номеров страниц
 */
export function getPages(currentPage, maxPage, limit) {
    currentPage = Math.max(1, Math.min(maxPage, currentPage));  
    limit = Math.min(maxPage, limit);  

    let start = Math.max(1, currentPage - Math.floor(limit / 2));  
    let end = start + limit - 1;  

    if (end > maxPage) {
        end = maxPage;  
        start = Math.max(1, end - limit + 1);  
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    return pages;
}