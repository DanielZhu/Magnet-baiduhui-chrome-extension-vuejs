"use strict";
// Copyright (c) 2016 Zhu Meng-Dan(Daniel). All rights reserved.

function Ajax() {
  this.loadXMLHttp = function () {
    var xmlhttp;
    if (window.XMLHttpRequest) {
      // code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp=new XMLHttpRequest();
    }

    return xmlhttp;
  };
}

Ajax.prototype.post = function (inParams) {
  var xhr = this.loadXMLHttp();

  xhr.open("POST", inParams.url, true);

  //set headers
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.setRequestHeader("charset", "UTF-8");

  xhr.send(inParams.body);
  return xhr;
};

function Magnet() {
  // this.configs = [];
  // this.chromeVersion = null;
  // this.platform = null;

  // chrome.runtime.onInstalled.addListener(function () {
  //   chrome.tabs.create({url: chrome.runtime.getURL("options.html")});
  // });

  // this._syncConfig();
  // this._registerScrollToLastPositionListener();
}

Magnet.prototype = {
  constructor: Magnet,


function entryPoint () {
  var magnet = new Magnet();

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

    }
  );
}


entryPoint();
