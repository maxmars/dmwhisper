import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import DMWhisper from './components/DMWhisper';
import reportWebVitals from './reportWebVitals';
import { store } from './store';
import { Provider } from 'react-redux';
import './i18n/i18n.js';

const renderReactDom = () => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <DMWhisper />
      </Provider>
    </React.StrictMode>
  );
};

window.addEventListener('load', function () {
  window.history.pushState({ noBackExitsApp: true }, '');
});

if (window.cordova) {
  document.addEventListener('deviceready', () => {
    renderReactDom();
  }, false);
} else {
  renderReactDom();
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
