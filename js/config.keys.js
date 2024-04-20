export const keys = [
  /*
  {
    key: 'Key',
    // or
    code: 'Code'
    on: 'keydown',
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    action: 'example',
    parameter: 1,
  },
  */
  {
    key: ':',
    on: 'keydown',
    action: 'prompt',
  },
  {
    key: 'r',
    on: 'keydown',
    action: 'refresh',
  },
  {
    key: 'Alt',
    on: 'keydown',
    action: 'showHints',
  },
  {
    key: 'Alt',
    on: 'keyup',
    action: 'hideHints',
  },
  {
    key: 'AltGraph',
    on: 'keydown',
    action: 'showHints',
  },
  {
    key: 'AltGraph',
    on: 'keyup',
    action: 'hideHints',
  },
  {
    key: 'Escape',
    on: 'keydown',
    action: 'escape',
  },
  {
    key: 'i',
    on: 'keydown',
    action: 'insert',
  },
  {
    key: 'h',
    on: 'keydown',
    action: 'previousPage',
  },
  {
    key: 'ArrowLeft',
    on: 'keydown',
    action: 'previousPage',
  },
  {
    key: 'H',
    on: 'keydown',
    action: 'page',
    parameter: Number.MIN_SAFE_INTEGER,
  },
  {
    key: 'j',
    on: 'keydown',
    action: 'previousHighlight',
  },
  {
    key: 'J',
    on: 'keydown',
    action: 'highlight',
    parameter: Number.MIN_SAFE_INTEGER,
  },
  {
    key: 'k',
    on: 'keydown',
    action: 'nextHighlight',
  },
  {
    key: 'K',
    on: 'keydown',
    action: 'highlight',
    parameter: Number.MAX_SAFE_INTEGER,
  },
  {
    key: 'l',
    on: 'keydown',
    action: 'nextPage',
  },
  {
    key: 'ArrowRight',
    on: 'keydown',
    action: 'nextPage',
  },
  {
    key: 'L',
    on: 'keydown',
    action: 'page',
    parameter: Number.MAX_SAFE_INTEGER,
  },
  {
    key: 'Enter',
    on: 'keydown',
    action: 'select',
  },
  {
    key: 'Backspace',
    on: 'keydown',
    action: 'back',
  },
  {
    key: 'q',
    on: 'keydown',
    action: 'quote',
  },
  {
    key: 'e',
    on: 'keydown',
    action: 'edit',
  },
  {
    key: 'd',
    on: 'keydown',
    action: 'delete',
  },
  ...`²&é"'(-è_çà)=`.split('').flatMap((key, index) => [
    {
      key,
      on: 'keydown',
      action: 'highlight',
      parameter: index,
    },
    {
      key,
      on: 'keyup',
      action: 'select',
      parameter: index,
    },
  ]),
  ...`~1234567890°+`.split('').flatMap((key, index) => [
    {
      key,
      on: 'keydown',
      action: 'highlight',
      parameter: index + 13,
    },
    {
      key,
      on: 'keyup',
      action: 'select',
      parameter: index + 13,
    },
  ]),
];
