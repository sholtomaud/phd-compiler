var db = require('../../persistence'),
    kgo = require('kgo'),
    errors = require('generic-errors'),
    schemaService = require('../schema'),
    viewService = require('../view'),
    translationService = require('../translation'),
    JaySchema = require('jayschema'),
    jayschema = new JaySchema(),
    normaliseErrors = require('jayschema-error-messages'),
    schimitar = require('schimitar'),
    cherrypick = require('cherrypick'),
    errorFunction = require('../errorFunction'),
    fields = 'id data schemaId schemaVersion';

function cherryPickFields(callback){
    return function(data){
        callback(null, cherrypick(data, fields));
    };
}

function validateSchema(data, schema, callback){
    jayschema.validate(data, schema, function(error){
        if (error) {
            return callback(normaliseErrors(error));
        }

        callback(null, data);
    });
}

function translateToSchema(account, record, targetSchemaId, callback){
    kgo
    ({
        account: account,
        record: record,
        currentSchemaId: record.schemaId,
        currentSchemaVersion: record.schemaVersion,
        targetSchemaId: targetSchemaId
    })
    ('targetSchema', ['account', 'targetSchemaId'], schemaService.get)
    ('needsTranslation', ['targetSchema', 'currentSchemaVersion', 'currentSchemaId'], function(targetSchema, currentSchemaVersion, currentSchemaId, done){
        if(!targetSchema || !targetSchema.definition){
            return done(new errors.Unprocessable('Invalid Schema'));
        }

        if(targetSchema.id === currentSchemaId && targetSchema.version === currentSchemaVersion){
            return callback(null, record);
        }

        done();
    })
    ('translatedRecord', ['!needsTranslation', 'account', 'record', 'targetSchema'], translationService.translateTo)
    (['translatedRecord'], callback.bind(null, null))
    .on('error', function(error){
        callback(error);
    });
}

function translateToLatestSchema(account, record, callback){
    translateToSchema(account, record, record.schemaId, callback);
}

function validateAgainstSchema(account, recordData, callback){
    if(!recordData.schemaId){
        return callback(new errors.Unprocessable('schemaId is required'));
    }

    kgo
    ({
        account: account,
        schemaId: recordData.schemaId,
        recordData: recordData,
        data: recordData.data
    })
    ('schema', ['account', 'schemaId'], schemaService.get)
    ('definition', ['schema'], function(schema, done){
        if(!schema || !schema.definition){
            return done(new errors.Unprocessable('Invalid Schema'));
        }

        done(null, schema.definition);
    })
    ('validated', ['data', 'definition'], validateSchema)
    (['!validated', 'recordData', 'schema'], function(recordData, schema){
        recordData.schemaVersion = schema.version;

        callback(null, recordData);
    })
    .on('error', function(error){
        callback(error);
    });
}

function get(account, id, callback){
    kgo
    ({
        account: account,
        id: id
    })
    ('record', function(){
        db.Record.findOne(
            {
                _id: id,
                companyId: account.companyId,
                enabled: true
            },
            fields,
            errorFunction(callback)
        );
    })
    .on('error', function(error){
        callback(error);
    });
}

function getLatest(account, id, callback){
    kgo
    ({
        account: account,
        id: id
    })
    ('record', ['account', 'id'], get)
    ('translatedData', ['account', 'record'], translateToLatestSchema)
    ('updatedRecord', ['account', 'id', 'translatedData'], update)
    (['updatedRecord'], callback.bind(null, null))
    .on('error', function(error){
        callback(error);
    });
}

function getWithView(account, id, viewId, callback){
    kgo
    ({
        account: account,
        id: id,
        viewId: viewId
    })
    ('record', ['account', 'id'], get)
    ('view', ['account', 'viewId'], viewService.get)
    (['record', 'view'], function(record, view){
        if(record.schemaId !== view.schemaId){
            return callback(new errors.Unprocessable('Invalid View'));
        }

        record.data = schimitar(record.data, view.definition);

        callback(null, record);
    })
    .on('error', function(error){
        callback(error);
    });
}

function create(account, recordData, callback){
    recordData.companyId = account.companyId;

    kgo
    ({
        account: account,
        recordData: recordData
    })
    ('validData', ['account', 'recordData'], validateAgainstSchema)
    ('record', ['validData'], function(validData, done){
        db.Record.create(validData, done);
    })
    (['record'], cherryPickFields(callback))
    .on('error', function(error){
        callback(error);
    });
}

function update(account, id, recordData, callback){
    recordData.companyId = account.companyId;

    if(typeof recordData.toObject === 'function'){
        recordData = recordData.toObject();
        delete recordData._id;
    }

    kgo
    ({
        account: account,
        id: id,
        recordData: recordData
    })
    ('validData', ['account', 'recordData'], validateAgainstSchema)
    ('updated', ['validData'], function(validData, done){
        db.Record.update({ _id: id, companyId: account.companyId }, { $set: validData }, done);
    })
    ('record', ['!updated', 'account', 'id'], get)
    (['record'], callback.bind(null, null))
    .on('error', function(error){
        callback(error);
    });
}

module.exports = {
    create: create,
    update: update
};
