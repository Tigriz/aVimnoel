const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function h(string) {
  const template = document.createElement('template');
  template.innerHTML = string;
  return template.content.children;
}

function scroll(element) {
  window.scrollTo({ top: element?.getBoundingClientRect().y - document.querySelector('.navbar').clientHeight + window.scrollY });
}

function clamp(value, min = 0, max = Number.MAX_SAFE_INTEGER) {
  return Math.min(Math.max(value, min), max);
}

function setCursor(entries, index = 0, scrollTo = false) {
  if (index < 0) index = 0;
  $$('.vim-selection').forEach((el) => el.classList.remove('vim-selection'));
  index = entries.length > index ? index : entries.length - 1;
  const target = entries[index];
  target.classList.add('vim-selection');
  if (scrollTo) scroll(target);
  return index;
}

export { $, $$, h, scroll, setCursor, clamp };
