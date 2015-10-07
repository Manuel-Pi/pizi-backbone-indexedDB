(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(["exports", "module", "backbone", "pizi-indexedDB"], factory);
	} else if (typeof exports !== "undefined" && typeof module !== "undefined") {
		factory(exports, module, require("backbone"), require("pizi-indexedDB"));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, mod, global.Backbone, global.piziIndexedDB);
		global.piziBackboneIndexedDB = mod.exports;
	}
})(this, function (exports, module, _backbone, _piziIndexedDB) {
	"use strict";

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _Backbone = _interopRequireDefault(_backbone);

	var _piziIndexedDB2 = _interopRequireDefault(_piziIndexedDB);

	function getAllEntity(model) {
		var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

		// Convert to Array for Backbone.Collection.set()
		if (options.success) {
			(function () {
				var success = options.success;
				options.success = function (object) {
					success([object]);
				};
			})();
		}
		_piziIndexedDB2["default"].getAll(model.className || model.model.prototype.className, options);
	}

	function saveEntity(model) {
		var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

		if (model instanceof _Backbone["default"].Model) {
			if (options.success) {
				(function () {
					var success = options.success;
					options.success = function (id) {
						success({ id: id });
					};
				})();
			}
			_piziIndexedDB2["default"].save(model.className, model.toJSON(), options);
		} else {
			if (options.error) {
				options.error();
			}
		}
	}

	function getEntity(model) {
		var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

		if (model.id) {
			_piziIndexedDB2["default"].get(model.className, model.id, options);
		} else {
			console.log('Id not valid!');
			if (options.error) {
				options.error();
			}
		}
	}

	function deleteEntity(model) {
		var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

		if (model.id) {
			_piziIndexedDB2["default"].remove(model.className, model.id, options);
		} else {
			console.log('Id not valid!');
			if (options.error) {
				options.error();
			}
		}
	}

	function overrideBackboneSync() {
		var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_piziIndexedDB2["default"].conf = opts.conf;
		_piziIndexedDB2["default"].open({
			dbName: opts.dbName,
			dbVersion: opts.dbVersion,
			success: function success() {
				if (_Backbone["default"]) {
					_Backbone["default"].defaultSync = _Backbone["default"].sync;
					_Backbone["default"].sync = function (method, model) {
						var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

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
								if (model instanceof _Backbone["default"].Model) {
									getEntity(model, options);
								} else if (model instanceof _Backbone["default"].Collection) {
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
		var _this = this;

		var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		var Session = _Backbone["default"].Model.extend({
			className: 'session',
			put: function put(key, value) {
				if (value && value.toJSON) {
					value = value.toJSON();
				}
				_this.set(key, value);
			},
			pick: function pick(key) {
				return _this.get(key);
			}
		});

		var createSesssion = function createSesssion() {
			_Backbone["default"].session = new Session({ id: 1, date: new Date() });
			_Backbone["default"].session.save();
		};

		var autoSaveSession = function autoSaveSession() {
			_Backbone["default"].session.on('change', function () {
				_Backbone["default"].session.set('date', new Date(), { silent: true });
				_Backbone["default"].session.save();
			});
		};

		var oldSession = new Session({ id: 1 });
		var oldSessionDate = oldSession.get('date');

		oldSession.fetch({
			success: function success() {
				if (oldSessionDate instanceof Date && new Date().getTime() - oldSessionDate.getTime() < 3600 * 1000) {
					console.log('Old session getted!' + oldSession.get('date'));
					oldSession.set('date', new Date());
					_Backbone["default"].session = oldSession;
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
		_Backbone["default"].sync = _Backbone["default"].defaultSync;
	}

	module.exports = {
		apply: overrideBackboneSync,
		disable: restoreDefaultSync,
		initSession: initSession,
		saveEntity: saveEntity,
		deleteEntity: deleteEntity,
		getEntity: getEntity,
		getAllEntity: getAllEntity
	};
});
