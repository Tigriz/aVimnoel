export const prompts = {
  ':h': { action: 'help', description: 'Help' },
  ':q': { action: 'return', description: 'Return' },
  ':w': { action: 'send', description: 'Send' },
  ':wq': { action: 'sendAndReturn', description: 'Send and return' },
  ':auto-end': { action: 'config', parameter: { 'auto-end': 1 }, description: 'Send and return' },
};
