// ==UserScript==
// @name         a𝑽𝒊𝒎noel
// @version      0.4.0
// @description  Add vim shortcuts to avenoel
// @author       Tigriz
// @source       https://github.com/Tigriz
// @license      CECILL-2.1; http://www.cecill.info/licences/Licence_CeCILL_V2.1-en.txt
// @match        https://avenoel.org/*
// @icon         https://raw.githubusercontent.com/Tigriz/aVimnoel/main/img/avimnoel.png
// @run-at       document-body
// @grant        none
// ==/UserScript==

const PATH = location.pathname || window.location.pathname;
const INSERT_NODES = ['TEXTAREA', 'INPUT'];
const TOP_ROW = ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal'];
const PROMPT_HINTS = [
  { code: ':h', description: 'Help' },
  { code: ':q', description: 'Quit' },
  { code: ':w', description: 'Save' },
  { code: ':wq', description: 'Save and quit' },
];
const UI = h(`
<input id="vim-prompt" list="vim-hints" name="vim-prompt" type="text" placeholder=":h" disabled>
<datalist id="vim-hints">
  ${PROMPT_HINTS.map((hint) => `<option value="${hint.code}"></option>`).join('')}
</datalist>
<pre id="vim-help" style="display: none">
- \`r\` or \`F5\` refreshes
  - if in a topic, also scrolls to bottom
- \`i\` scrolls to and focuses message form
- \`h\` goes to first page of a topic
- \`H\` goes to top of current page
- \`j\` goes to previous page
- \`k\` goes to next page
- \`l\` goes to last page of a topic
- \`L\` goes to bottom of current page
- top keyboard row (numbers and chars) navigates from first to 13th topic/message, \`Shift\` to go from 14th to 26th (it does not exist but who cares, it doesn't crash the script)
  - \`Ctrl\` goes to the bottom of the last page of a topic
- \`Alt\` shows hints
- \`:\` opens vim prompt; can be exited using \`Escape\`
${PROMPT_HINTS.map((hint) => `  - ${hint.code} ${hint.description}`).join('\n')}
- \`Backspace\` navigates to previous page
</pre>
`);
const PROMPT = UI[0];

const path = (section) => PATH.startsWith('/' + section);
let cursor = 0;

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

function ui() {
  PROMPT.onkeydown = (e) => {
    if (e.key === 'Enter') {
      try {
        switch (PROMPT.value) {
          case ':wq':
            $(".form-group:has(input[name='_token']) button[type='submit']").click();
            if (path('topic')) navigation.navigate('/forum');
            break;
          case ':w':
            $(".form-group:has(input[name='_token']) button[type='submit']").click();
            break;
          case ':q':
            if (path('topic')) navigation.navigate('/forum');
            break;
          case ':h':
            $('#vim-help').style.display = $('#vim-help').style.display === 'block' ? 'none' : 'block';
        }
        if (+PROMPT.value.slice(1) !== NaN) {
          document.activeElement.blur();
          if (path('forum')) $$('.topics-title a')[+PROMPT.value.slice(1)].click();
          if (path('topic')) scroll($$('.topic-message')[+PROMPT.value.slice(1)]);
        }
      } finally {
        PROMPT.value = '';
        PROMPT.disabled = true;
      }
    }
  };
  document.body.append(...UI);
}

function css() {
  const style = document.createElement('style');
  style.innerText = `
  #vim-prompt {
    position: fixed;
    bottom: 0;
    width: 100vw;
    background: #0004;
    color: #fff;
    z-index: 1000;
    font-family: monospace;
    padding: 4px;
    border: none;
    outline: none;
    pointer-events: none;
  }
  #vim-prompt:focus {
    background: #0008;
  }
  #vim-help{
    position: fixed;
    bottom: 0;
    right:0;
    margin: 0;
    max-width: 400px;
    background: #000b;
    color: #fff;
    z-index: 1000;
    white-space: break-spaces;
  }
  kbd {
    background-color: var(--popup-background);
    border-radius: 3px;
    color: var(--popup-color);
    display: inline-block;
    font-weight: 700;
    line-height: 1;
    padding: 2px 4px;
    white-space: nowrap;
  }
  .vim-hint {
    position: absolute;
    opacity: 0.9;
    transform: translate(-100%, -100%);
  }
  .vim-selection,
  .topic-message.vim-selection,
  tr.vim-selection {
    background-color: #fff3 !important;
  }
  `;
  document.body.append(style);
}

function setCursor(index) {
  if (index < 0) index = 0;
  $$('.vim-selection').forEach((el) => el.classList.remove('vim-selection'));
  let entries = [];
  if (path('forum')) entries = $$('tbody tr');
  if (path('topic')) entries = $$('.topic-message');
  index = entries.length > index ? index : entries.length - 1;
  const target = entries[index];
  target.classList.add('vim-selection');
  if (path('topic')) scroll(target);
  cursor = index;
}

function keyup(e) {
  console.debug('🔶 a𝑽𝒊𝒎noel: keyup', e);
  switch (e.key) {
    case 'Alt':
    case 'AltGraph':
      $$('.vim-hint').forEach((el) => el.remove());
  }
  if (TOP_ROW.includes(e.code)) {
    if (path('forum')) navigation.navigate($$('.topic-icon a')[TOP_ROW.indexOf(e.code) + (e.shiftKey ? 13 : 0)].href + (e.ctrlKey ? '#form' : ''));
    if (path('topic')) scroll($$('.topic-message')[TOP_ROW.indexOf(e.code) + (e.shiftKey ? 13 : 0)]);
  }
}

function keydown(e) {
  console.debug('🔶 a𝑽𝒊𝒎noel: keydown', e);
  if (INSERT_NODES.includes(document.activeElement.nodeName) && e.code === 'Escape') {
    document.activeElement.blur();
    PROMPT.value = '';
  }
  if (INSERT_NODES.includes(document.activeElement.nodeName)) return;

  switch (e.key) {
    case 'Enter':
      if (path('forum')) navigation.navigate($$('.topic-icon a')[cursor].href + (e.ctrlKey ? '#form' : ''));
      if (path('topic')) scroll($$('.topic-message')[cursor]);
    case 'Alt':
    case 'AltGraph':
      if (path('forum')) {
        $$('tbody tr .topic-icon').forEach((el, index) => {
          el.append(...h(`<div class="vim-hint">${index > 12 ? '<kbd>Shift</kbd> + ' : ''}<kbd>${TOP_ROW[index % 13]}</kbd></div>`));
        });
      }
      break;
    case 'r':
    case 'R':
    case 'F5':
      if (path('forum')) navigation.reload();
      if (path('topic')) {
        location.href += '#form';
        location.reload();
      }
      e.preventDefault();
      break;
    case 'i':
    case 'I':
      if (path('forum')) {
        scroll($('input[name="title"]'));
        scroll($('input[name="title"]'));
      }
      if (path('topic')) {
        scroll($('#form textarea'));
        $('#form textarea').focus();
      }
      PROMPT.value = '-- INSERT --';
      e.preventDefault();
      break;
    case 'h':
    case 'ArrowLeft':
      $('.glyphicon-chevron-left').parentNode.click();
      e.preventDefault();
      break;
    case 'H':
      if (path('forum')) navigation.navigate('/forum');
      if (path('topic')) $('.pagination-topic li:nth-child(2) a').click();
      break;
    case 'j':
    case 'ArrowUp':
      setCursor(cursor - 1);
      e.preventDefault();
      break;
    case 'J':
      if (path('topic')) scroll($('.topic-message:first-child'));
      break;
    case 'k':
    case 'ArrowDown':
      setCursor(cursor + 1);
      e.preventDefault();
      break;
    case 'K':
      if (path('topic')) scroll($('.topic-message:last-child'));
      break;
    case 'l':
    case 'ArrowRight':
      $('.glyphicon-chevron-right').parentNode.click();
      e.preventDefault();
      break;
    case 'L':
      if (path('topic')) $('.pagination-topic li:nth-last-child(2) a').click();
      break;
    case ':':
      PROMPT.disabled = false;
      PROMPT.value = '';
      PROMPT.focus();
      break;
    case 'Backspace':
      navigation.canGoBack && navigation.back();
  }
}

function vim() {
  document.onkeyup = keyup;
  document.onkeydown = keydown;
  css();
  ui();
  console.log('🔶 a𝑽𝒊𝒎noel: ready');
}

vim();
