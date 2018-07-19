import View from '../view';
import './app.css';
import appTemplate from './app.html';
import AppModel from './app.model';
const MOCK_USERS = [
  {
    name: 'me',
    id: 0,
    avatar:
      'http://www.stickees.com/files/avatars/male-avatars/1697-andrew-sticker.png'
  },
  {
    name: 'My imaginary girlfriend',
    id: 1,
    avatar: 'http://www.stickees.com/files/avatars/girl-avatars/0.png'
  }
];
function say(content) {
  return {
    content,
    sent: new Date()
  };
}
function* iSay() {
  yield say("Hello, it's me");
  yield say('To go over everything');
  yield say("But I ain't done much healing");
  yield say("I'm in California dreaming about who we used to be");
  yield say("I've forgotten how it felt before the world fell at our feet");
}
function* sheSay() {
  yield say("I was wondering if after all these years you'd like to meet");
  yield say("They say that time's supposed to heal ya");
  yield say('Hello, can you hear me');
  yield say('When we were younger and free');
  yield say("There's such a difference between us");
  yield say('And a million miles');
  yield say('...');
}
function* chat(users) {
  const she = sheSay();
  const i = iSay();
  let userId = 0;
  while (true) {
    yield (userId => {
      const user = users.find(({ id }) => id === userId);
      if (!user) {
        return;
      }
      const content = !user.isCurrent
        ? {
            ...she.next().value,
            from: userId
          }
        : {
            ...i.next().value,
            from: userId
          };
      return content;
    })(userId);
    userId = userId === 0 ? 1 : 0;
  }
}

export default class App extends View {
  constructor(root) {
    super(root, appTemplate);
    let message;
    const model = this.defineModel(AppModel, {
      messages: this.observe([]),
      users: MOCK_USERS,
      typing: this.observe(''),
      send: function() {
        if (this.typing()) {
          this.messages.push({
            content: this.typing(),
            from: this.users.find(({ isCurrent }) => isCurrent).id,
            sent: new Date()
          });
        }
        let user;
        message = message || chat(this.users);
        let isDone = false;
        let content;
        while (!user || !user.isCurrent) {
          const nextMessage = message.next();
          isDone = nextMessage.done;
          content = nextMessage.value;
          user = this.users.find(({ id }) => id === content.from);
          if (!user.isCurrent) {
            this.messages.push(content);
          }
        }
        user.isCurrent && content && this.typing(content.content);
        $('.messages').scrollTop($('.messages').prop('scrollHeight'));
      }
    });
  }
}
