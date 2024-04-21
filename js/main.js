export async function vim(VERSION = Date.now()) {
  const { keys } = await import(`./config.keys.js?v=${VERSION}`);
  const { cmd } = await import(`./config.cmd.js?v=${VERSION}`);
  const { h } = await import(`./utils.js?v=${VERSION}`);
  const { actions, exec } = await import(`./actions.js?v=${VERSION}`);

  const KEYS = localStorage.vim_keys ? JSON.parse(localStorage.vim_keys) : keys;
  localStorage.vim_keys = JSON.stringify(KEYS);
  const PROMPTS = localStorage.vim_prompts ? JSON.parse(localStorage.vim_prompts) : cmd;
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
}
