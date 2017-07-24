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

function overrideBackboneSync() {
	var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	__WEBPACK_IMPORTED_MODULE_1_pizi_indexedDB___default.a.open({
		dbName: opts.dbName,
		dbVersion: opts.dbVersion,
		conf: opts.conf,
		success: function success() {
			if (__WEBPACK_IMPORTED_MODULE_0_backbone___default.a) {
				__WEBPACK_IMPORTED_MODULE_0_backbone___default.a.defaultSync = __WEBPACK_IMPORTED_MODULE_0_backbone___default.a.sync;
				__WEBPACK_IMPORTED_MODULE_0_backbone___default.a.sync = function (method, model) {
					var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};


					options.dbName = options.dbName || model.dbName;
					options.dbVersion = options.dbVersion || model.dbVersion;

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
				};

				if (opts.session) {
					initSession(opts);
				} else if (opts.success) {
					opts.success();
				}
			}
		},
		error: opts.error
	});
}

function initSession() {
	var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	var Session = __WEBPACK_IMPORTED_MODULE_0_backbone___default.a.Model.extend({
		className: 'session',
		put: function put(key, value) {
			if (value && value.toJSON) {
				value = value.toJSON();
			}
			this.set(key, value);
		},
		pick: function pick(key) {
			return this.get(key);
		}
	});

	var createSesssion = function createSesssion() {
		__WEBPACK_IMPORTED_MODULE_0_backbone___default.a.session = new Session({ id: 1, date: new Date() });
		__WEBPACK_IMPORTED_MODULE_0_backbone___default.a.session.save();
	};

	var autoSaveSession = function autoSaveSession() {
		__WEBPACK_IMPORTED_MODULE_0_backbone___default.a.session.on('change', function () {
			__WEBPACK_IMPORTED_MODULE_0_backbone___default.a.session.set('date', new Date(), { silent: true });
			__WEBPACK_IMPORTED_MODULE_0_backbone___default.a.session.save();
		});
	};

	var oldSession = new Session({ id: 1 });
	var oldSessionDate = oldSession.get('date');

	oldSession.fetch({
		success: function success() {
			if (oldSessionDate instanceof Date && new Date().getTime() - oldSessionDate.getTime() < 3600 * 1000) {
				console.log('Old session getted!' + oldSession.get('date'));
				oldSession.set('date', new Date());
				__WEBPACK_IMPORTED_MODULE_0_backbone___default.a.session = oldSession;
			} else {
				createSesssion();
			}
			autoSaveSession();
			if (opts.success) {
				opts.success();
			}
		},
		error: function error(model, err) {
			createSesssion();
			autoSaveSession();
			if (err.name === "ModelNotFound") {
				opts.success();
			} else if (opts.error) {
				opts.error(err);
			}
		}
	});
}

function restoreDefaultSync() {
	__WEBPACK_IMPORTED_MODULE_0_backbone___default.a.sync = __WEBPACK_IMPORTED_MODULE_0_backbone___default.a.defaultSync;
}

/* harmony default export */ __webpack_exports__["default"] = ({
	apply: overrideBackboneSync,
	disable: restoreDefaultSync,
	initSession: initSession,
	saveEntity: saveEntity,
	deleteEntity: deleteEntity,
	getEntity: getEntity,
	getAllEntity: getAllEntity
});

/***/ })
/******/ ]);
});