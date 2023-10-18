// preload.js
const { contextBridge } = require('electron');
const firebase = require('firebase');

contextBridge.exposeInMainWorld('firebase', firebase);