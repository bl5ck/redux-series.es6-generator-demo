import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import 'bootstrap';
import App from './app';

if (module.hot) {
  module.hot.accept(() => {
    new App($('#root'));
  });
}

new App($('#root'));
