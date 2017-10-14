'use strict'

const path = require('path');
const mime = require('mime');
const fs = require('fs-extra');
const os = require('os');
const debug = require('debug')('phd');
const pandoc = require('./pandoc');

module.exports = function(config, action, program){
  console.log('Watching: ',config.cwdDir);
  let dir = program.D ||  'thesis' ;
  fs.watch(dir, (event, filename) => {
    if (filename) {
      config.sourceDir = path.join(config.cwdDir, dir);
      console.log(filename,'changed, building pdf.')
      let outFile = filename.split('.');
      let oFile = outFile[0] + '.pdf';
      const options = {
        in:  path.join(config.cwdDir, dir, filename),
        out:  path.join(config.cwdDir, 'build', oFile),
        type: 'pdf',
      }

      pandoc( config, options, function(error, msg){
          if (error) debug('Creating pandocs error:',error);
          console.log('Done',msg)
          return;
      })

    } else {
      console.log('filename not provided');
    }
  });
}
