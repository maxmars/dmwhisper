import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import DMWhisper from './components/DMWhisper';
import reportWebVitals from './reportWebVitals';
import { store } from './store';
// import { store, persister } from './store';
import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';

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

if (window.cordova) {
  document.addEventListener('deviceready', () => {
    renderReactDom();
  }, false);
} else {
  renderReactDom();
}

/*
cordova.plugins.barcodeScanner.scan(
      function (result) {
          alert("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);
      },
      function (error) {
          alert("Scanning failed: " + error);
      },
      {
          preferFrontCamera : true, // iOS and Android
          showFlipCameraButton : true, // iOS and Android
          showTorchButton : true, // iOS and Android
          torchOn: true, // Android, launch with the torch switched on (if available)
          saveHistory: true, // Android, save scan history (default false)
          prompt : "Place a barcode inside the scan area", // Android
          resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
          formats : "DATA_MATRIX", // default: all but PDF_417 and RSS_EXPANDED
          orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
          disableAnimations : true, // iOS
          disableSuccessBeep: false // iOS and Android
      }
   );
*/

/*
      <PersistGate loading={null} persistor={persister}>
        <DMWhisper />
      </PersistGate>
*/

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
