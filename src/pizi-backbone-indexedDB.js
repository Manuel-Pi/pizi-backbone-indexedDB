import Backbone from "backbone";
import piziIndexedDB from "pizi-indexedDB";

function getAllEntity(model, options = {}) {
    // Convert to Array for Backbone.Collection.set()
    if (options.success) {
        let success = options.success;
        options.success = (object) => {
            success([object]);
        };
    }
    piziIndexedDB.getAll(model.className || model.model.prototype.className, options);
}

function saveEntity(model, options = {}) {
    if (model instanceof Backbone.Model) {
        if (options.success) {
            let success = options.success;
            options.success = (id) => {
                success({ id: id });
            };
        }
        piziIndexedDB.save(model.className, model.toJSON(), options);
    } else {
        if (options.error) {
            options.error();
        }
    }
}

function getEntity(model, options = {}) {
    if (model.id) {
        piziIndexedDB.get(model.className, model.id, options);
    } else {
        console.log('Id not valid!');
        if (options.error) {
            options.error();
        }
    }
}

function deleteEntity(model, options = {}) {
    if (model.id) {
        piziIndexedDB.remove(model.className, model.id, options);
    } else {
        console.log('Id not valid!');
        if (options.error) {
            options.error();
        }
    }
}

function indexedDBSync(method, model, options = {}) {
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
            if (model instanceof Backbone.Model) {
                getEntity(model, options);
            } else if (model instanceof Backbone.Collection) {
                getAllEntity(model, options);
            }
            break;
    }
}

function overrideBackboneSync(opts = {}) {
    piziIndexedDB.open({
        dbName: opts.dbName,
        dbVersion: opts.dbVersion,
        conf: opts.conf,
        success: () => {
            let sync = Backbone.sync;
            Backbone.sync = (method, model, options = {}) => {
                let storage = options.storage || model.storage;
                if (storage === 'indexedDB') {
                    options.dbName = options.dbName || model.dbName;
                    options.dbVersion = options.dbVersion || model.dbVersion;
                    indexedDBSync.call(this, method, model, options);
                } else {
                    sync.call(this, method, model, opts);
                }
            };
            if (opts.session) {
                let session = initSession(opts);
            } else if (opts.success) {
                opts.success(session);
            }
        },
        error: opts.error
    });
}

let Session = Backbone.Model.extend({
    className: 'Session',
    storage: 'indexedDB',
    put(key, value) {
        if (value && value.toJSON) {
            value = value.toJSON();
        }
        this.set(key, value);
    }
});

function initSession(opts = {}) {
    opts.sessionTimeout = opts.sessionTimeout || 60;
    let session = new Session({ id: 1, date: new Date() });
    session.on('change', () => {
        session.set('date', new Date(), { silent: true });
        session.save();
    });
    session.fetch({
        success() {
            if (session.get('date') instanceof Date && (new Date()).getTime() - session.get('date').getTime() < (opts.sessionTimeout * 60 * 1000)) {
                console.log('Old session found: ' + session.get('date'));
                session.set('date', new Date());
            }
            if (opts.success) opts.success(session);
        },
        error(model, err) {
            if (err.name === "ModelNotFound") {
                session.save();
                if (opts.success) opts.success(session);
            } else if (opts.error) {
                opts.error(err);
            }
        }
    });
}

export default {
    apply: overrideBackboneSync,
    initSession: initSession,
};