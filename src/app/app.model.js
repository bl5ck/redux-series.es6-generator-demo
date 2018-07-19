import ko from 'knockout';
function fuzzyTime(date) {
  const delta = Math.round((+new Date() - date) / 1000);

  const minute = 60,
    hour = minute * 60,
    day = hour * 24,
    week = day * 7;

  let fuzzy;

  if (delta < 30) {
    fuzzy = 'just then.';
  } else if (delta < minute) {
    fuzzy = delta + ' seconds ago.';
  } else if (delta < 2 * minute) {
    fuzzy = 'a minute ago.';
  } else if (delta < hour) {
    fuzzy = Math.floor(delta / minute) + ' minutes ago.';
  } else if (Math.floor(delta / hour) == 1) {
    fuzzy = '1 hour ago.';
  } else if (delta < day) {
    fuzzy = Math.floor(delta / hour) + ' hours ago.';
  } else if (delta < day * 2) {
    fuzzy = 'yesterday';
  }
  return fuzzy;
}
export default class AppModel {
  constructor({ messages = [], users = [], typing = '', send }) {
    this.messages = messages;
    this.users = users.map(user => ({
      ...user,
      isCurrent: user.name === 'me'
    }));
    this.typing = typing;
    const computeMessages = () =>
      this.messages().map(message => ({
        ...message,
        user: this.users.find(({ id }) => id === message.from),
        fuzzy: fuzzyTime(message.sent)
      }));
    this.messagesOfUsers = ko.computed(computeMessages);
    this.send = send;
  }
}
