import Backbone from "backbone";
import piziIndexedDB from "pizi-indexedDB";

function getAllEntity(model, options = {}){
	// Convert to Array for Backbone.Collection.set()
	if(options.success){
		let success = options.success;
		options.success = (object) => {
			success([object]);
		};
	}
	piziIndexedDB.getAll(model.className || model.model.prototype.className, options);
}

function saveEntity(model, options = {}){
	if(model instanceof Backbone.Model){
		if(options.success){
			let success = options.success;
			options.success = (id) =>{
				success({id: id});
			};
		}
		piziIndexedDB.save(model.className, model.toJSON(), options);
	} else {
		if(options.error){
			options.error();
		}
	}
}

function getEntity(model, options = {}){
	if(model.id){
		piziIndexedDB.get(model.className, model.id, options);
	} else {
		console.log('Id not valid!');
		if(options.error){
			options.error();
		}
	}
}

function deleteEntity(model, options = {}){
	if(model.id){
		piziIndexedDB.remove(model.className, model.id, options);
	} else {
		console.log('Id not valid!');
		if(options.error){
			options.error();
		}
	}
}

function overrideBackboneSync(opts = {}){
	piziIndexedDB.open({
		dbName: opts.dbName,
		dbVersion: opts.dbVersion,
		conf: opts.conf,
		success : ()=>{
			if(Backbone){
				Backbone.defaultSync = Backbone.sync;
				Backbone.sync = (method, model, options = {})=>{

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

function initSession(opts = {}){
	let Session = Backbone.Model.extend({
		className : 'session',
		put(key, value){
			if(value && value.toJSON){
				value = value.toJSON();
			}
			this.set(key, value);
		},
		pick(key){
			return this.get(key);
		}
	});

	let createSesssion = ()=>{
		Backbone.session = new Session({id: 1, date: new Date()});
		Backbone.session.save();
	};

	let autoSaveSession = ()=>{
		Backbone.session.on('change', ()=>{
			Backbone.session.set('date', new Date(), {silent: true});
			Backbone.session.save();
		});
	};

	let oldSession = new Session({id: 1});
	let oldSessionDate = oldSession.get('date');

	oldSession.fetch({
		success(){
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
		error(model, err){
			createSesssion();
			autoSaveSession();
			if(err.name === "ModelNotFound"){
				opts.success();
			} else if(opts.error){
				opts.error(err);
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
