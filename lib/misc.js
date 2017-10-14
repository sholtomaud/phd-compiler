'use strict'

const rooty = require('rooty');
rooty('./lib');

const path = require('path')
const mime = require('mime')
const fs = require('fs')
const debug = require('debug')('phd')
const argv = require('minimist')(process.argv.slice(2))
const crypto = require('crypto');
const shasum = require('shasum');
const kgo = require('kgo')
const program = require('commander')

const level = require('level')

// const logger = require('^logger')
const g = require('^g')
const pandoc = require('^pandoc')

let ops = [
  {
    type: 'put',
    key: new Buffer([1, 2, 3]),
    value:{
      fileName: 'SysEndPhil',
      googleID: '1gg7HrnTtcNORehVWMHaTqUuZ0MpkNaUp9vm6dlqHivk',
      parents: ['0B07zX9keQNghVlE1NG9zYjNPWFE']
    },
    keyEncoding   : 'binary',
    valueEncoding : 'json'
  },
  {
    type: 'put',
    key: new Buffer([1, 2, 4]),
    value:{
      fileName: '1_UnreasonableMetaphor',
      googleID: '1OTHaXp7VGXW-9XlKnkWrnMqfYCFhenrvHlVV1CUqOpk',
      parents: ['0B07zX9keQNghVlE1NG9zYjNPWFE']
    },
    keyEncoding   : 'binary',
    valueEncoding : 'json'
  },

]

program
  .arguments('<action>')
  .option('-c <config>', 'Config file')
  .option('-s, <source>', 'Source file[s]')
  .action(function (action) {
    // let configFile = path.join(process.cwd(), action)
    // let config = require(configFile)
    // let db = level(path.join(process.cwd(),config.dbDir))
    // let buildDir = config.buildDir
    console.log(action,program.C)

    switch (action.trim()) {
      case 'init': lib.init(conf, action, program)
        break
      case 'build': lib.build(conf, action, program)
        break
      case 'run': lib.run(conf, action, program)
        break
      case 'clean': lib.clean()
        break
      default:

    // db.batch(ops, function (err) {
    //   if (err) return console.log('Ooops!', err)
    //   console.log('Great success dear leader!')
    // })
    // //
    // db.createReadStream({ keys: true, values: true })
    // .on('data', function (data) {
    //   console.log('key: ',data.key, 'value: ', data.value)
    // })

  })
  .parse(process.argv);







//
// const options = {
//         in: path.resolve(__dirname, './thesis/1_UnreasonableMetaphor.md'),
//         out: path.resolve(__dirname, './build/1_UnreasonableMetaphor.docx'),
//         type: 'docx',
//     }
//
// const otherOptions =
//     [{
//         src: './thesis/thesis.md',
//         type: 'pdf'
//     },{
//         src: './thesis/Precis.md',
//         type: 'docx'
//     },{
//         src: './thesis/Precis.md',
//         type: 'html'
//     }]
//
//
// var googleOptions = {
//     title : '1_UnreasonableMetaphor',
//     mimeType: 'application/vnd.google-apps.document',
//     file: options.out,
//     name: '1_UnreasonableMetaphor',
//     parents: ['0B07zX9keQNghVlE1NG9zYjNPWFE'],
//     mediaMimeType: mime.lookup(options.out)
//     ,
//     // fileId: '1tXiOERNTufMywTv8SpAKxiCz2HIx2kLkuwmVe9x9gH0'
//     // fileId: '1gg7HrnTtcNORehVWMHaTqUuZ0MpkNaUp9vm6dlqHivk' //SysEndPhil
//     fileId: '1OTHaXp7VGXW-9XlKnkWrnMqfYCFhenrvHlVV1CUqOpk' //1_UnreasonableMetaphor
// };
//
//
//
// // console.log(`filename provided: ${filename}`);
// const file = path.resolve(__dirname, './build/1_UnreasonableMetaphor.docx');
// const dir = path.join(process.cwd(),'/',argv.d,'/')
// const fil = path.join(process.cwd(),'/thesis/1_UnreasonableMetaphor.md')
// console.log(`the dir:`,dir);
// console.log(`the fil:`,fil);
// console.log(`the file:`,file);
//
// fs.watch(fil, (event, filename) => {
//   if (filename) {
//     console.log('event fired',filename)
//     kgo
//         ('pandc', function( done){
//             pandoc( options, function(error, msg){
//                 if (error) debug('Creating pandocs error:',error);
//                 done(error, msg);
//             })
//         })
//         ('gdoc',['pandc'], function(pandoc, done){
//             g( googleOptions,function(error,msg){
//                 if (error) debug('Creating gDrive error: ',error);
//                 done(error, msg);
//             })
//             // done(null)
//         })
//         (['*'],function(err){
//             debug('Error: ' + err);
//             console.error(err.error.underline.red,err.msg);
//             return;
//         })
//   } else {
//     console.log('filename not provided');
//   }
// });
