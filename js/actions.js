import { $, $$, scroll, setCursor } from './utils.js';
import { config } from './config.js';

export const actions = {
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
    forum: () => setCursor($$('tbody tr'), config.cursor - 1),
    topic: () => setCursor($$('.topic-message'), config.cursor - 1, true),
    mps: () => setCursor(config.cursor - 1),
    mp: () => setCursor(config.cursor - 1),
  },
  nextHighlight: {
    description: 'Highlight next entry',
    forum: () => setCursor($$('tbody tr'), config.cursor + 1),
    topic: () => setCursor($$('.topic-message'), config.cursor + 1, true),
    mps: () => setCursor(config.cursor + 1),
    mp: () => setCursor(config.cursor + 1),
  },
  select: {
    description: 'Select entry',
    forum: (index = config.cursor) => {
      document.activeElement.blur();
      $$('.topics-title a')[index].click();
    },
    topic: (index = config.cursor) => {
      $('#vim-prompt').value = '-- VISUAL --';
      document.activeElement.blur();
      scroll($$('.topic-message')[index]);
    },
  },
  quote: {
    description: 'Quote entry',
    topic: (index = config.cursor) => $$('.topic-message .message-quote')[index].click(),
  },
  edit: {
    description: 'Edit entry',
    topic: (index = config.cursor) => $(`.topic-message:nth-child(${index + 1}) .message-edit`).click(),
  },
  delete: {
    description: 'Delete entry',
    topic: (index = config.cursor) => $(`.topic-message:nth-child(${index + 1}) .message-delete`).click(),
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

export function exec(action, parameters) {
  if (config.INSERT_NODES.includes(document.activeElement.nodeName) && !actions[action].bypass) return;
  if (typeof actions[action][config.PATH] !== 'undefined') actions[action][config.PATH](parameters);
  actions[action].default?.(parameters);
}
