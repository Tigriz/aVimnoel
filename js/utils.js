const PATH = location.pathname.split('/')[1];
const INSERT_NODES = ['TEXTAREA', 'INPUT', 'BUTTON'];

let cursor = 0;

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
  cursor = index;
}

const actions = {
  reset: {
    description: 'Reset all configs - useful on breaking updates',
    bypass: true,
    default: () => {
      localStorage.removeItem('vim_prompts');
      localStorage.removeItem('vim_keys');
    },
  },
  send: {
    description: 'Send message',
    bypass: true,
    default: () => $(".form-group:has(input[name='_token']) button[type='submit']").click(),
  },
  return: {
    description: 'Return to relative menu',
    bypass: true,
    topic: () => navigation.navigate('/forum'),
    mp: () => navigation.navigate('/messagerie'),
  },
  sendAndReturn: {
    description: 'Send message and return to relative menu',
    bypass: true,
    topic: () => {
      $(".form-group:has(input[name='_token']) button[type='submit']").click();
      navigation.navigate('/forum');
    },
    mp: () => {
      $(".form-group:has(input[name='_token']) button[type='submit']").click();
      navigation.navigate('/messagerie');
    },
  },
  help: {
    description: 'Show help',
    bypass: true,
    default: () => {
      $('#vim-help').style.display = $('#vim-help').style.display === 'block' ? 'none' : 'block';
      $('#vim-help').focus();
    },
  },
  autoEnd: {
    description: 'Set auto-end mode',
  },
  highlight: {
    description: 'Highlight entry',
    forum: (index) => setCursor($$('tbody tr'), index),
    topic: (index) => setCursor($$('.topic-message'), index, true),
    mps: (index) => setCursor(index),
    mp: (index) => setCursor(index),
  },
  previousHighlight: {
    description: 'Highlight previous entry',
    forum: () => setCursor($$('tbody tr'), cursor - 1),
    topic: () => setCursor($$('.topic-message'), cursor - 1, true),
    mps: () => setCursor(cursor - 1),
    mp: () => setCursor(cursor - 1),
  },
  nextHighlight: {
    description: 'Highlight next entry',
    forum: () => setCursor($$('tbody tr'), cursor + 1),
    topic: () => setCursor($$('.topic-message'), cursor + 1, true),
    mps: () => setCursor(cursor + 1),
    mp: () => setCursor(cursor + 1),
  },
  select: {
    description: 'Select entry',
    forum: (index = cursor) => {
      document.activeElement.blur();
      $$('.topics-title a')[index].click();
    },
    topic: (index = cursor) => {
      $('#vim-prompt').value = '-- VISUAL --';
      document.activeElement.blur();
      scroll($$('.topic-message')[index]);
    },
  },
  quote: {
    description: 'Quote entry',
    topic: (index = cursor) => $$('.topic-message .message-quote')[index].click(),
  },
  edit: {
    description: 'Edit entry',
    topic: (index = cursor) => $(`.topic-message:nth-child(${index + 1}) .message-edit`).click(),
  },
  delete: {
    description: 'Delete entry',
    topic: (index = cursor) => $(`.topic-message:nth-child(${index + 1}) .message-delete`).click(),
  },
  page: {
    description: 'Go to page',
    forum: (page) => {
      navigation.navigate(`/forum/${Math.max(1, page)}`);
    },
    topic: (page) => {
      navigation.navigate(
        location.pathname.replace(
          /\/(\d+)-(\d+)/g,
          (_, topic) => `/${topic}-${clamp(page, 1, +$('.pagination-topic li:nth-last-child(2) a').innerText)}`
        )
      );
    },
  },
  previousPage: {
    description: 'Go to previous page',
    forum: () => navigation.navigate(location.pathname.replace(/(\d+)/g, (_, page) => `${Math.max(1, +page - 1)}`)),
    topic: () => navigation.navigate(location.pathname.replace(/\/(\d+)-(\d+)/g, (_, topic, page) => `/${topic}-${Math.max(1, +page - 1)}`)),
  },
  nextPage: {
    description: 'Go to next page',
    forum: () => navigation.navigate(`/forum/${/\d+/g.exec(location.pathname)?.[0] ? +/\d+/g.exec(location.pathname)?.[0] + 1 : 2}`),
    topic: () =>
      navigation.navigate(
        location.pathname.replace(
          /\/(\d+)-(\d+)/g,
          (_, topic, page) => `/${topic}-${Math.min(+page + 1, +$('.pagination-topic li:nth-last-child(2) a').innerText)}`
        )
      ),
  },
  back: {
    description: 'Go back',
    default: () => history.back(),
  },
  prompt: {
    description: 'Open prompt',
    default: (prompt = $('#vim-prompt')) => {
      prompt.disabled = false;
      prompt.value = '';
      prompt.focus();
    },
  },
  showHints: {
    description: 'Show hints',
    forum: () =>
      $$('tbody tr .topic-icon').forEach((el, index) => {
        el.append(
          ...h(
            `<div class="vim-hint"><kbd>${
              JSON.parse(localStorage.vim_keys).find((keybind) => keybind.action === 'highlight' && keybind.parameter === index).key
            }</kbd> <kbd>${index}</kbd></div>`
          )
        );
      }),
    topic: () =>
      $$('.topic-message').forEach((el, index) => {
        el.append(
          ...h(
            `<div class="vim-hint"><kbd>${
              JSON.parse(localStorage.vim_keys).find((keybind) => keybind.action === 'highlight' && keybind.parameter === index).key
            }</kbd> <kbd>${index}</kbd></div>`
          )
        );
      }),
  },
  hideHints: {
    description: 'Hide hints',
    default: () => $$('.vim-hint').forEach((el) => el.remove()),
  },
  refresh: {
    description: 'Refresh page',
    forum: () => navigation.reload(),
    topic: () => {
      location.hash = '#form';
      location.reload();
    },
  },
  insert: {
    description: 'Switch to insert mode',
    forum: () => {
      const target = $('input[name="title"]');
      scroll(target);
      target.focus();
      $('#vim-prompt').value = '-- INSERT --';
    },
    topic: () => {
      const target = $('#form textarea');
      scroll(target);
      target.focus();
      $('#vim-prompt').value = '-- INSERT --';
    },
  },
  escape: {
    description: 'Exit all modes',
    bypass: true,
    default: () => {
      document.activeElement.blur();
      $('#vim-prompt').value = '';
    },
  },
};

function exec(action, parameters) {
  if (INSERT_NODES.includes(document.activeElement.nodeName) && !actions[action].bypass) return;
  if (typeof actions[action][PATH] !== 'undefined') actions[action][PATH](parameters);
  actions[action].default?.(parameters);
}

export { $, $$, h, scroll, actions, exec };
