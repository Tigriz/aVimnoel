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
  {
    key: ':',
    on: 'keydown',
    action: 'prompt',
  },
  {
    key: 'j',
    on: 'keydown',
    action: 'previousHighlight',
  },
  {
    key: 'k',
    on: 'keydown',
    action: 'nextHighlight',
  },
  {
    key: 'Enter',
    on: 'keydown',
    action: 'selectHighlight',
  },
  {
    key: 'Backspace',
    on: 'keydown',
    action: 'back',
  },
];
