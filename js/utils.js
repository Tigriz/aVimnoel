const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function h(string) {
  const template = document.createElement('template');
  template.innerHTML = string;
  return template.content.children;
}

function scroll(element) {
  window.scrollTo({ top: element.getBoundingClientRect().y - document.querySelector('.navbar').clientHeight + window.scrollY });
}

export { $, $$, h, scroll };
