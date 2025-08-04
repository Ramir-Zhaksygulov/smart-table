import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchField) {
  // @todo: #5.1 — настроить компаратор
  const customRules = [
    rules.searchMultipleFields(
      searchField,
      ["date", "customer", "seller"],
      false
    ),
  ];

  const compare = (source, target) => {
    const baseCompare = createComparison(
      ["skipEmptyTargetValues"],
      customRules
    );
    return baseCompare(source, target);
  };

  return (data, state) => {
    // @todo: #5.2 — применить компаратор
    const query = state[searchField]?.trim();
    if (!query) return data; // если строка пуста — не фильтруем

    return data.filter((item) => compare(item, state));
  };
}
