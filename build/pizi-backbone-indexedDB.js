(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("backbone"), require("pizi-indexedDB"));
	else if(typeof define === 'function' && define.amd)
		define("pizi-backbone-indexedDB", ["backbone", "pizi-indexedDB"], factory);
	else if(typeof exports === 'object')
		exports["pizi-backbone-indexedDB"] = factory(require("backbone"), require("pizi-indexedDB"));
	else
		root["pizi-backbone-indexedDB"] = factory(root["backbone"], root["pizi-indexedDB"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("backbone");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("pizi-indexedDB");

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_backbone__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_backbone___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_backbone__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_pizi_indexedDB__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_pizi_indexedDB___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_pizi_indexedDB__);



function getAllEntity(model) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    // Convert to Array for Backbone.Collection.set()
    if (options.success) {
        var success = options.success;
        options.success = function (object) {
            success([object]);
        };
    }
    __WEBPACK_IMPORTED_MODULE_1_pizi_indexedDB___default.a.getAll(model.className || model.model.prototype.className, options);
}

function saveEntity(model) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (model instanceof __WEBPACK_IMPORTED_MODULE_0_backbone___default.a.Model) {
        if (options.success) {
            var success = options.success;
            options.success = function (id) {
                success({ id: id });
            };
        }
        __WEBPACK_IMPORTED_MODULE_1_pizi_indexedDB___default.a.save(model.className, model.toJSON(), options);
    } else {
        if (options.error) {
            options.error();
        }
    }
}

function getEntity(model) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (model.id) {
        __WEBPACK_IMPORTED_MODULE_1_pizi_indexedDB___default.a.get(model.className, model.id, options);
    } else {
        console.log('Id not valid!');
        if (options.error) {
            options.error();
        }
    }
}

function deleteEntity(model) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (model.id) {
        __WEBPACK_IMPORTED_MODULE_1_pizi_indexedDB___default.a.remove(model.className, model.id, options);
    } else {
        console.log('Id not valid!');
        if (options.error) {
            options.error();
        }
    }
}

function indexedDBSync(method, model) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    switch (method) {
        case 'create':
            saveEntity(model, options);
            break;

        case 'update':
            saveEntity(model, options);
            break;

        case 'delete':
            deleteEntity(model, options);
            break;

        case 'read':
            options = _.extend({ validate: true }, options);
            if (model instanceof __WEBPACK_IMPORTED_MODULE_0_backbone___default.a.Model) {
                getEntity(model, options);
            } else if (model instanceof __WEBPACK_IMPORTED_MODULE_0_backbone___default.a.Collection) {
                getAllEntity(model, options);
            }
            break;
    }
}

function overrideBackboneSync() {
    var _this = this;

    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    __WEBPACK_IMPORTED_MODULE_1_pizi_indexedDB___default.a.open({
        dbName: opts.dbName,
        dbVersion: opts.dbVersion,
        conf: opts.conf,
        success: function success() {
            var sync = __WEBPACK_IMPORTED_MODULE_0_backbone___default.a.sync;
            __WEBPACK_IMPORTED_MODULE_0_backbone___default.a.sync = function (method, model) {
                var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

                var storage = options.storage || model.storage;
                if (storage === 'indexedDB') {
                    options.dbName = options.dbName || model.dbName;
                    options.dbVersion = options.dbVersion || model.dbVersion;
                    indexedDBSync.call(_this, method, model, options);
                } else {
                    sync.call(_this, method, model, opts);
                }
            };
            if (opts.session) {
                var _session = initSession(opts);
            } else if (opts.success) {
                opts.success(session);
            }
        },
        error: opts.error
    });
}

var Session = __WEBPACK_IMPORTED_MODULE_0_backbone___default.a.Model.extend({
    className: 'Session',
    storage: 'indexedDB',
    put: function put(key, value) {
        if (value && value.toJSON) {
            value = value.toJSON();
        }
        this.set(key, value);
    }
});

function initSession() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    opts.sessionTimeout = opts.sessionTimeout || 60;
    var session = new Session({ id: 1, date: new Date() });
    session.on('change', function () {
        session.set('date', new Date(), { silent: true });
        session.save();
    });
    session.fetch({
        success: function success() {
            if (session.get('date') instanceof Date && new Date().getTime() - session.get('date').getTime() < opts.sessionTimeout * 60 * 1000) {
                console.log('Old session found: ' + session.get('date'));
                session.set('date', new Date());
            }
            if (opts.success) opts.success(session);
        },
        error: function error(model, err) {
            if (err.name === "ModelNotFound") {
                session.save();
                if (opts.success) opts.success(session);
            } else if (opts.error) {
                opts.error(err);
            }
        }
    });
}

/* harmony default export */ __webpack_exports__["default"] = ({
    apply: overrideBackboneSync,
    initSession: initSession
});

/***/ })
/******/ ]);
});