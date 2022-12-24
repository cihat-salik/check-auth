'use strict';

import './popup.css';
import { checkAuthRequest, loginWithGoogleAccount } from './requests';

(function () {
  // We will make use of Storage API to get and store `count` value
  // More information on Storage API can we found at
  // https://developer.chrome.com/extensions/storage

  // To get storage access, we have to mention it in `permissions` property of manifest.json file
  // More information on Permissions can we found at
  // https://developer.chrome.com/extensions/declare_permissions

  const isAuthStorage = {
    get: (cb) => {
      chrome.storage.sync.get(['isAuth'], (result) => {
        cb(result.isAuth);
        chrome.storage.local.set({ isAuth: result.isAuth });
      });
    },
    set: (value, cb) => {
      chrome.storage.sync.set(
        {
          isAuth: value,
        },
        () => {
          cb();
        }
      );
    },
  };

  function setupCheckAuth(initialValue) {
    document.getElementById('check-button').addEventListener(
      'click',
      () => {
        checkAuth(initialValue);
      },
      { once: true }
    );
  }

  function updateStatus() {
    isAuthStorage.get((isAuth) => {
      if (typeof isAuth === 'undefined') {
        isAuthStorage.set(false, () => {
          setupCheckAuth(false);
        });
      } else {
        setupCheckAuth(isAuth);
      }
    });
  }

  function updateDom(res) {
    const checkButton = document.getElementById('check-button');
    const statusValue = document.getElementById('status-value');
    if (!checkButton && !statusValue) return;

    if (res.status === 200) {
      statusValue.innerHTML = 'Authenticated';
      statusValue.className = 'authenticated';
    } else if (res.status === 404) {
      statusValue.innerHTML = 'Not Authenticated';
      statusValue.className = 'not-authenticated';
    }
  }

  async function checkAuth(initialValue) {
    let isAuth = initialValue;
    const res = await checkAuthRequest();

    updateDom(res);

    res.status === 200 ? (isAuth = true) : (isAuth = false);
    return isAuthStorage.set(isAuth, () => {
      updateStatus(isAuth);
    });
  }

  document.addEventListener('DOMContentLoaded', checkAuth);

  // Communicate with background file by sending a message
  // chrome.runtime.sendMessage(
  //   {
  //     type: 'GREETINGS',
  //     payload: {
  //       message: 'Hello, my name is Pop. I am from Popup.',
  //     },
  //   },
  //   (response) => {
  //     console.log(response.message);
  //   }
  // );
})();
