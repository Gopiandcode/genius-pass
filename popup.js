// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
   var tab = tabs[0];

    var url = tab.url;

    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });
}




function getSavedPassword(url, callback) {
  chrome.storage.sync.get(url, (items) => {
    callback(chrome.runtime.lastError ? null : items[url]);
  });
}


document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabUrl((url) => {
      console.log("Popup.js: " + url);
    var passwordInput = document.getElementById('password');
    var urlInput = document.getElementById('url');

    urlInput.value = url;
    // Load the saved background color for this page and modify the dropdown
    // value, if needed.
    getSavedPassword(url, (savedPassword) => {
      if (savedPassword) {
        passwordInput.value = savedPassword;
      }
    });

    });
});

chrome.runtime.onMessage.addListener((message, sender, response) => {
    var passwordInput = document.getElementById('password');
    var urlInput = document.getElementById('url');

    passwordInput.value = message.password;
    urlInput.value = message.url;
});