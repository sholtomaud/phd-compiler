'use strict'

const success = require('debug')('pandoc:success')
const fail = require('debug')('pandoc:fail')
const path = require('path')
const os = require('os')
const spawn = require('child_process').spawn;
const utils = require('./utils');

module.exports = function(config, options, callback ){
    let type = (options.type == 'pdf')? 'latex' : options.type;
    let args = Object.entries(config.pandocOptions).filter(([key, value])=>{
      return ( utils[key](config, value) != null );
    })
    .map(([key, value])=>{
      return utils[key](config, value);
    },[]);

    let ar = options.in + " " + args.join(" ") + "-t "+ type + " -S -o " + options.out;
    let arg = ar.split(" ");

    let arg2 = [ '/Users/sholtomaud/Documents/PhD/thesis/02_DescartesQuantityOfMotion.md',
  '--biblio',
  '/Users/sholtomaud/references/MyLibrary.json',
  '--csl',
  '/Users/sholtomaud/references/styles/chicago-fullnote-bibliography.csl',
  '-F',
  'pandoc-crossref',
  '-F',
  'pandoc-citeproc',
  '-F',
  'pandoc-eqnos',
  '--toc',
  '--toc-depth',
  '3',
  '--highlight-style',
  'haddock',
  '-t',
  'latex',
  '-S',
  '-o',
  '/Users/sholtomaud/Documents/PhD/build/02_DescartesQuantityOfMotion.pdf' ];

    // console.log('cwd',config.sourceDir);
    let pandoc = spawn('pandoc',arg, {cwd:config.cwdDir});

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
