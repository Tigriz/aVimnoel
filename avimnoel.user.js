// ==UserScript==
// @name         a𝑽𝒊𝒎noel
// @version      0.3.0
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
const UI = html(`
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

function html(string) {
  const template = document.createElement('template');
  template.innerHTML = string;
  return template.content.children;
}

function ui() {
  PROMPT.onkeydown = (e) => {
    if (e.key === 'Enter') {
      try {
        switch (PROMPT.value) {
          case ':wq':
            document.querySelector(".form-group:has(input[name='_token']) button[type='submit']").click();
            if (PATH.startsWith('/topic')) navigation.navigate('/forum');
            break;
          case ':w':
            document.querySelector(".form-group:has(input[name='_token']) button[type='submit']").click();
            break;
          case ':q':
            if (PATH.startsWith('/topic')) navigation.navigate('/forum');
            break;
          case ':h':
            document.querySelector('#vim-help').style.display = document.querySelector('#vim-help').style.display === 'block' ? 'none' : 'block';
        }
        if (+PROMPT.value.slice(1) !== NaN) {
          document.activeElement.blur();
          if (PATH.startsWith('/forum')) document.querySelectorAll('.topics-title a')[+PROMPT.value.slice(1)].click();
          if (PATH.startsWith('/topic')) document.querySelectorAll('.topic-message')[+PROMPT.value.slice(1)].scrollIntoView({ behavior: 'smooth' });
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
  }
  #vim-prompt:focus {
    background: #0008;
  }
  #vim-help{
    position: fixed;
    bottom: 0;
    right:0;
    margin: 0;
    max-width: 50vw;
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
  `;
  document.body.append(style);
}

function keyup(e) {
  console.debug('🔶 avimnoel: keyup', e);
  switch (e.key) {
    case 'Alt':
    case 'AltGraph':
      document.querySelectorAll('.vim-hint').forEach((el) => el.remove());
  }
}

function keydown(e) {
  console.debug('🔶 avimnoel: keydown', e);
  if (INSERT_NODES.includes(document.activeElement.nodeName) && e.code === 'Escape') {
    document.activeElement.blur();
    PROMPT.value = '';
  }
  if (INSERT_NODES.includes(document.activeElement.nodeName)) return;

  switch (e.key) {
    case 'Alt':
    case 'AltGraph':
      if (PATH.startsWith('/forum')) {
        document.querySelectorAll('tbody tr .topic-icon').forEach((el, index) => {
          el.append(...html(`<div class="vim-hint">${index > 12 ? '<kbd>Shift</kbd> + ' : ''}<kbd>${TOP_ROW[index % 13]}</kbd></div>`));
        });
      }
      break;
    case 'r':
    case 'R':
    case 'F5':
      if (PATH.startsWith('/forum')) navigation.reload();
      if (PATH.startsWith('/topic')) {
        location.href += '#form';
        location.reload();
      }
      e.preventDefault();
      break;
    case 'i':
    case 'I':
      if (PATH.startsWith('/forum')) {
        document.querySelector('input[name="title"]').scrollIntoView({ behavior: 'smooth' });
        document.querySelector('input[name="title"]').focus();
      }
      if (PATH.startsWith('/topic')) {
        document.querySelector('#form textarea').scrollIntoView({ behavior: 'smooth' });
        document.querySelector('#form textarea').focus();
      }
      PROMPT.value = '-- INSERT --';
      e.preventDefault();
      break;
    case 'h':
      document.querySelector('.pagination-topic li:nth-child(2) a').click();
      break;
    case 'H':
      window.scrollTo({ top: 0, behavior: 'smooth' });
      break;
    case 'j':
    case 'J':
      document.querySelector('.glyphicon-chevron-left').parentNode.click();
      break;
    case 'k':
    case 'K':
      document.querySelector('.glyphicon-chevron-right').parentNode.click();
      break;
    case 'l':
      document.querySelector('.pagination-topic li:nth-last-child(2) a').click();
      break;
    case 'L':
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      break;
    case ':':
      PROMPT.disabled = false;
      PROMPT.value = '';
      PROMPT.focus();
      break;
    case 'Backspace':
      navigation.canGoBack && navigation.back();
  }
  if (TOP_ROW.includes(e.code)) {
    if (PATH.startsWith('/forum'))
      navigation.navigate(
        document.querySelectorAll('.topic-icon a')[TOP_ROW.indexOf(e.code) + (e.shiftKey ? 13 : 0)].href + (e.ctrlKey ? '#form' : '')
      );
    if (PATH.startsWith('/topic'))
      document.querySelectorAll('.topic-message')[TOP_ROW.indexOf(e.code) + (e.shiftKey ? 13 : 0)].scrollIntoView({ behavior: 'smooth' });
  }
}

function vim() {
  document.onkeyup = keyup;
  document.onkeydown = keydown;
  css();
  ui();
  console.log('🔶 avimnoel: loaded');
}

vim();
