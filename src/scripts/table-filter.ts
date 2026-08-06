/**
 * Progressive table filter (no heavyscript) — hides rows below `[data-filter-row]`
 * that don't match the query in `[data-table-filter]`. Zero dependencies.
 */
export {};

const input = document.querySelector<HTMLInputElement>('[data-table-filter]');
const rows: HTMLTableRowElement[] = Array.from(document.querySelectorAll<HTMLTableRowElement>('[data-filter-row]'));
const empty = document.querySelector<HTMLElement>('[data-filter-empty]');

if (input && rows.length > 0) {
  const apply = () => {
    const q = input.value.trim().toLowerCase();
    let visible = 0;
    rows.forEach((row) => {
      const hit = row.textContent?.toLowerCase().includes(q) ?? false;
      row.style.display = q.length > 0 && !hit ? 'none' : '';
      if (hit) visible += 1;
    });
    if (empty) {
      empty.style.display = q.length > 0 && visible === 0 ? 'block' : 'none';
    }
  };
  input.addEventListener('input', apply);
  apply();
}