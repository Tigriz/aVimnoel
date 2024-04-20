// ==UserScript==
// @name         a𝑽𝒊𝒎noel
// @version      1.0.21
// @description  Add vim shortcuts to avenoel
// @author       Tigriz
// @source       https://github.com/Tigriz
// @license      CECILL-2.1; http://www.cecill.info/licences/Licence_CeCILL_V2.1-en.txt
// @match        https://avenoel.org/*
// @icon         https://raw.githubusercontent.com/Tigriz/aVimnoel/main/assets/avimnoel.png
// @run-at       document-start
// @grant        GM_info
// ==/UserScript==

const DEV_MODE = GM_info.script.name.includes('dev');
const HOST = DEV_MODE ? 'http://127.0.0.1:8080' : 'https://Tigriz.github.io/aVimnoel';

const { keys } = await import(`${HOST}/js/config.keys.js?v=${DEV_MODE ? Date.now() : GM_info.script.version}`);
const { prompts } = await import(`${HOST}/js/config.prompts.js?v=${DEV_MODE ? Date.now() : GM_info.script.version}`);
const { $, $$, h, scroll, actions, exec } = await import(`${HOST}/js/utils.js?v=${DEV_MODE ? Date.now() : GM_info.script.version}`);

const KEYS = localStorage.vim_keys ? JSON.parse(localStorage.vim_keys) : keys;
localStorage.vim_keys = JSON.stringify(KEYS);
const PROMPTS = localStorage.vim_prompts ? JSON.parse(localStorage.vim_prompts) : prompts;
localStorage.vim_prompts = JSON.stringify(PROMPTS);

const UI = h(`
<input id="vim-prompt" list="vim-hints" name="vim-prompt" type="text" placeholder=":h" disabled>
<datalist id="vim-hints">
  ${Object.keys(PROMPTS)
    .map((prompt) => `<option value="${prompt}"></option>`)
    .join('')}
</datalist>
<pre id="vim-help" style="display: none">
${Object.keys(PROMPTS)
  .map((prompt) => `<kbd>${prompt}</kbd></i>: ${actions[PROMPTS[prompt]]?.description}`)
  .join('\n')}
${KEYS.map(
  (key) =>
    `<i class="${key.on}">${key.altKey ? '<kbd>Alt</kbd> + ' : ''}${key.ctrlKey ? '<kbd>Ctrl</kbd> + ' : ''}${
      key.metaKey ? '<kbd>Meta</kbd> + ' : ''
    }${key.shiftKey ? '<kbd>Shift</kbd> + ' : ''}<kbd>${key.key}</kbd></i>: ${actions[key.action]?.description} ${key.parameter ?? ''}`
).join('\n')}
</pre>
`);
const PROMPT = UI[0];
document.body.append(...UI);

const style = document.createElement('style');
style.innerText = await (await fetch(`${HOST}/assets/style.css?v=${DEV_MODE ? Date.now() : GM_info.script.version}`)).text();
document.body.append(style);

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

document.onkeyup = (e) => {
  console.debug('🔶 a𝑽𝒊𝒎noel: keyup', e);
  const match = KEYS.find((key) => key.key === e.key && key.on === 'keyup');
  if (match) exec(match.action, match.parameter);
};

document.onkeydown = (e) => {
  console.debug('🔶 a𝑽𝒊𝒎noel: keydown', e);
  const match = KEYS.find((key) => key.key === e.key && key.on === 'keydown');
  if (match) exec(match.action, match.parameter);
};

console.log('🔶 a𝑽𝒊𝒎noel: ready');
