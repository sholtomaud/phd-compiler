'use strict'

const success = require('debug')('pandoc:success')
const fail = require('debug')('pandoc:fail')
const path = require('path')
const os = require('os')
const spawn = require('child_process').spawn;
const utils = require('./utils');

module.exports = function(config, options, callback ){
    const type = (options.type == 'pdf')? 'latex' : options.type;
    
    const args = Object.entries(config.pandocOptions).filter(([key, value])=>{
      return ( utils[key](config, value) != null );
    })
    .map(([key, value])=>{
      return utils[key](config, value);
    },[]);

    const ar = options.in + " " + args.join(" ") + "-t "+ type + " -S -o " + options.out;
    const arg = ar.split(" ");

    const pandoc = spawn('pandoc',arg, {cwd:config.cwdDir});
    pandoc.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    pandoc.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });
    pandoc.on('close', function (error, message){
      if (error){
            fail('Pandocs error: ',error);
            console.log(`child process exited with code ${error}`);
        }
        else{
            success('Pandocs good: ',message);
            callback(null,message);
        }
    });
}
