import config from './pizi-indexedDBStores.json';
import './test.html';
import 'jquery';
import 'backbone';
import piziBackboneIndexedDB from '../build/pizi-backbone-indexedDB.js';

window.piziBackboneIndexedDB = piziBackboneIndexedDB;
window.config = config;