export const actions = {
  send: {
    forum: () => $(".form-group:has(input[name='_token']) button[type='submit']").click(),
    topic: () => $(".form-group:has(input[name='_token']) button[type='submit']").click(),
  },
  return: {
    topic: () => navigation.navigate('/forum'),
    mp: () => navigation.navigate('/messagerie'),
  },
  navigate: {
    forum: (index) => {},
    topic: (index) => {},
    mps: (index) => {},
    mp: (index) => {},
  },
};
