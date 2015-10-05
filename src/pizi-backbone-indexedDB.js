import Backbone from "backbone";
import piziIndexedDB from "pizi-indexedDB";

var idsExtension = '-map';

function getAllEntity(model, options){
	// Convert to Array for Backbone.Collection.set()
	options.success = function(object){
		if(options.success){
			options.success([object]);
		}
	};
	piziIndexedDB.getAll(model.className || model.model.prototype.className, options);
}

function saveEntity(model, options){
	if(model instanceof Backbone.Model){
		if(options.success){
			var success = options.success;
			options.success = function(id){
				success({id: id});
			};
		}
		piziIndexedDB.save(model.className, model.toJSON(), options);
	} else {
		if(options && options.error){
			options.error();
		}
	}
}

function getEntity(model, options){
	if(model.id){
		piziIndexedDB.get(model.className, model.id, options);
	} else {
		console.log('Id not valid!');
		if(options && options.error){
			options.error();
		}
	}
}

function deleteEntity(model, options){
	if(model.id){
		piziIndexedDB.remove(model.className, model.id, options);
	} else {
		console.log('Id not valid!');
		if(options && options.error){
			options.error();
		}
	}
}

function overrideBackboneSync(opts = {}){
	piziIndexedDB.conf = opts.conf;
	piziIndexedDB.open({
		dbName: opts.dbName,
		dbVersion: opts.dbVersion,
		success : function(){
			if(Backbone){
				Backbone.defaultSync = Backbone.sync;
				Backbone.sync = function(method, model, options = {}) {

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
						options = _.extend({validate: true}, options);
						if(model instanceof Backbone.Model){
							getEntity(model, options);
						} else if(model instanceof Backbone.Collection){
							getAllEntity(model, options);
						}
						break;
					}
				};

				if(opts.session){
					initSession(opts);
				} else if(opts.success){
					opts.success();
				}
			}
		},
		error : opts.error
	});
}

function initSession(opts){
	var Session = Backbone.Model.extend({
		className : 'session',
		put : function(key, value){
			if(value && value.toJSON){
				value = value.toJSON();
			}
			this.set(key, value);
		},
		pick : function(key){
			return this.get(key);
		}
	});

	var createSesssion = function(){
		Backbone.session = new Session({id: 1, date: new Date()});
		Backbone.session.save();
	};

	var autoSaveSession = function(){
		Backbone.session.on('change', function(){
			Backbone.session.set('date', new Date(), {silent: true});
			Backbone.session.save();
		});
	};

	var oldSession = new Session({id: 1});
	var oldSessionDate = oldSession.get('date');

	oldSession.fetch({
		success : function(){
			if(oldSessionDate instanceof Date && (new Date()).getTime() - oldSessionDate.getTime() < 3600 * 1000 ){
				console.log('Old session getted!' + oldSession.get('date'));
				oldSession.set('date', new Date());
				Backbone.session = oldSession;
			} else {
				createSesssion();
			}
			autoSaveSession();
			if(opts.success){
				opts.success();
			}
		},
		error: function(){
			createSesssion();
			autoSaveSession();
			if(opts.error){
				opts.error();
			}
		}
	});
}

function restoreDefaultSync(){
	Backbone.sync = Backbone.defaultSync;
}

export default {
	apply : overrideBackboneSync,
	disable : restoreDefaultSync,
	initSession : initSession,
	saveEntity : saveEntity,
	deleteEntity : deleteEntity,
	getEntity : getEntity,
	getAllEntity : getAllEntity
};
