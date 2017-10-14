#!/usr/bin/env node
'use strict'

const rooty = require('rooty')
rooty('./')

const path = require('path')
const mime = require('mime')
const fs = require('fs')
const debug = require('debug')('phd')

const program = require('commander')

const lib = require('^lib')

program
  .arguments('<action>')
  .option('-c <config>', 'Config file (see further documentation)')
  .option('-t, <type>', 'Output type [html|docx|pdf]')
  .option('-d, <dir>', 'Thesis dir')
  .option('-s, <source>', 'Source file [filename|dir]. If no file extension is given, the script assumes you want to merge a directory of markdown files (with .md extension) into one output file. If there is no extension and the directory cannot be found the script will error. A merge occurs in alphanumeric order, numbers first followed by alphabetic order.')
  .option('-g, <google>', 'Updates associated document on Google Drive')
  .action(function (action) {
    let homeDir = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
    let configFile = (program.C !== undefined) ?  path.join( process.cwd(), program.C ) : path.join( process.cwd(), 'config.json' );
    let config = require(configFile);
    config.cwdDir = process.cwd();

    switch ( action.trim() ) {
      // case 'init': lib.init(config, action, program)
      //   break;
      case 'build':
        // let configFile = (program.C !== undefined) ?  path.join( process.cwd(), program.C ) : path.join( process.cwd(), 'config.json' );
        // let config = require(configFile);
        // console.log('program.T ',program.T );
        config.pandocOptions.type = (program.T == undefined || program.T  == 'pdf')? 'latex' : program.T ;
        config.pandocOptions.sourceFile = program.S;
        lib.build(config, action, program);
        break;
      case 'open': lib.open(homeDir)
        break;
      case 'abridge': lib.abridge(config, action, program)
        break;
      case 'watch':
        // let configFile = (program.C !== undefined) ?  path.join( process.cwd(), program.C ) : path.join( process.cwd(), 'config.json' );
        // let config = require(configFile);
        lib.watch(config, action, program)
        break;
      // case 'run': lib.run(config, action, program)
      //   break;
      // case 'clean': lib.clean()
      //   break;

      default:
        break;
    }
  })
  .parse(process.argv)
