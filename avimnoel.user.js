// ==UserScript==
// @name         a𝑽𝒊𝒎noel
// @version      1.0.1
// @description  Add vim shortcuts to avenoel
// @author       Tigriz
// @source       https://github.com/Tigriz
// @license      CECILL-2.1; http://www.cecill.info/licences/Licence_CeCILL_V2.1-en.txt
// @match        https://avenoel.org/*
// @icon         https://raw.githubusercontent.com/Tigriz/aVimnoel/main/img/avimnoel.png
// @run-at       document-body
// @require      https://raw.githubusercontent.com/Tigriz/aVimnoel/main/js/config.keys.js
// @require      https://raw.githubusercontent.com/Tigriz/aVimnoel/main/js/config.prompts.js
// @require      https://raw.githubusercontent.com/Tigriz/aVimnoel/main/js/utils.js
// @grant        GM_info
// ==/UserScript==

const DEV_MODE = GM_info.script.name.includes('dev');
const HOST = DEV_MODE ? 'http://127.0.0.1:8080' : 'https://raw.githubusercontent.com/Tigriz/aVimnoel/main';

const KEYS = localStorage.vim_keys || keys;
document.KEYS = KEYS;
const PROMPTS = localStorage.vim_prompts || prompts;
document.PROMPTS = PROMPTS;

const INSERT_NODES = ['TEXTAREA', 'INPUT'];

const UI = h(`
<input id="vim-prompt" list="vim-hints" name="vim-prompt" type="text" placeholder=":h" disabled>
<datalist id="vim-hints">
  ${Object.keys(PROMPTS)
    .map((prompt) => `<option value="${prompt}"></option>`)
    .join('')}
</datalist>
<pre id="vim-help" style="display: none">
${KEYS.map(
  (key) =>
    `<i class="${key.on}">${key.altKey ? '<kbd>Alt</kbd> + ' : ''}${key.ctrlKey ? '<kbd>Ctrl</kbd> + ' : ''}${
      key.metaKey ? '<kbd>Meta</kbd> + ' : ''
    }${key.shiftKey ? '<kbd>Shift</kbd> + ' : ''}<kbd>${key.key}</kbd></i>: ${actions[key.action].description} ${key.parameter ?? ''}`
).join('\n')}
${Object.keys(PROMPTS)
  .map((prompt) => `<kbd>${prompt}</kbd></i>: ${actions[PROMPTS[prompt]].description}`)
  .join('\n')}
</pre>
`);
const PROMPT = UI[0];
document.body.append(...UI);

PROMPT.onkeydown = (e) => {
  if (e.key === 'Enter') {
    try {
      const prompt = PROMPTS[PROMPT.value];
      exec(prompt);
    } finally {
      PROMPT.value = '';
      PROMPT.disabled = true;
      e.stopPropagation();
    }
  }
};

document
  .querySelector('head')
  .append(...h(`<link rel="stylesheet" type="text/css" href="${HOST}/assets/style.css?v=${DEV_MODE ? Date.now() : GM_info.script.version}">`));

document.onkeyup = (e) => {
  console.debug('🔶 a𝑽𝒊𝒎noel: keyup', e);
  const match = KEYS.find((key) => key.key === e.key && key.on === 'keyup');
  if (match) exec(match.action, match.parameter);
};

document.onkeydown = (e) => {
  console.debug('🔶 a𝑽𝒊𝒎noel: keydown', e);
  if (INSERT_NODES.includes(document.activeElement.nodeName) && e.code === 'Escape') {
    document.activeElement.blur();
    PROMPT.value = '';
  }
  if (INSERT_NODES.includes(document.activeElement.nodeName)) return;

  const match = KEYS.find((key) => key.key === e.key && key.on === 'keydown');
  if (match) exec(match.action, match.parameter);
};

console.log('🔶 a𝑽𝒊𝒎noel: ready');
