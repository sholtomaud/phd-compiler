var fs = require('fs');
var fail = require('debug')('google:error');
var success = require('debug')('google:success');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var authorize = require('./authorize');

function up(options, callback){
    // Load client secrets from a local file.
    fs.readFile(__dirname + '/client_secret.json', function processClientSecrets(err, content) {
        if (err) {
            fail('%cError loading client secret file: ' + err,{color: 'red'});
            // "color: blue; font-size: x-large"
            return;
        }
        
        authorize(JSON.parse(content), function(auth){
            // newFile(auth, options);
            ( options.fileId ) ? loadFile(auth, options): newFile(auth, options);
        });

    });    
}

function newFile(auth,options){
    var drive = google.drive({version:'v3', auth: auth });

    drive.files.create({
      convert: true,
      newRevision: true,
      resource: {
        title: options.title,
        name: options.name,
        mimeType: options.mimeType,
        parents: options.parents
      },
      media: {
        mimeType: options.mediaMimeType,
        body: fs.createReadStream(options.file)
      }
    }, function(err, msg){
        if (err ) {
          fail('error loading files to drive: ', err);
          return err;
        }
        else{
          success('file loaded! ', msg);
          return msg;
        }
    });    
}

function loadFile(auth, options){
    var drive = google.drive({version:'v3', auth: auth });
    
    drive.files.update({
      fileId: options.fileId,
      resource: {
        title: options.title,
        name: options.name,
        mimeType: options.mimeType
      },
      media: {
        mimeType: options.mediaMimeType,
        body: fs.createReadStream(options.file)
      }
    }, function(err, msg){
        if (err ) {
          fail('error loading files to drive: ', err);
          return err;
        }
        else{
          success('File updated on Google Drive!');
          return msg;
        }
    });     
}

module.exports = up;