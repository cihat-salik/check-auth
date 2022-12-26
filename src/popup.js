'use strict';

import './popup.css';
import { checkAuthRequest, loginWithGoogleAccount, logout } from './requests';

(function () {
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
    const checkButton = document.getElementById('check-button')
    checkButton.addEventListener(
      'click',
      () => {
        checkAuth(initialValue);
        checkButton.disabled = true;
        setTimeout(() => {
          checkButton.disabled = false;
        }, 5000);
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
    const linkWrapper = document.getElementById('go-jf');
    if (!checkButton && !statusValue && !linkWrapper) return;

    // check button to child elements because it can be added before
    if (linkWrapper.children.length > 0) return;
    const link = document.createElement('a');
    // linkWrapper.classList = 'button'
    link.href = 'https://www.jotform.com/';
    link.setAttribute('target', '_blank');
    link.innerHTML = 'Go to the JotForm';
    link.className = 'button';
    linkWrapper.appendChild(link);

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

    if (!isAuth) {
      await logout();
      // TODO: login with google account
      // await loginWithGoogleAccount();
    }

    return isAuthStorage.set(isAuth, () => {
      updateStatus(isAuth);
    });
  }

  document.addEventListener('DOMContentLoaded', checkAuth);
})();
