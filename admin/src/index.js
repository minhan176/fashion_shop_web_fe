import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import store from './Redux/store';
import Toast from './components/LoadingError/Toast';

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <Toast />
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root'),
);
