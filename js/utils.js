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

const actions = {
  send: {
    forum: () => $(".form-group:has(input[name='_token']) button[type='submit']").click(),
    topic: () => $(".form-group:has(input[name='_token']) button[type='submit']").click(),
  },
  return: {
    topic: () => navigation.navigate('/forum'),
    mp: () => navigation.navigate('/messagerie'),
  },
  returnAndSend: {
    topic: () => {
      $(".form-group:has(input[name='_token']) button[type='submit']").click();
      navigation.navigate('/forum');
    },
    mp: () => {
      $(".form-group:has(input[name='_token']) button[type='submit']").click();
      navigation.navigate('/messagerie');
    },
  },
  navigate: {
    forum: (index) => {
      document.activeElement.blur();
      $$('.topics-title a')[index].click();
    },
    topic: (index) => {
      document.activeElement.blur();
      scroll($$('.topic-message')[index]);
    },
    mps: (index) => {},
    mp: (index) => {},
  },
};

export { $, $$, h, scroll, actions };
