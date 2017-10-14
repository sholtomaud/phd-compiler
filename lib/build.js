'use strict'
const rooty = require('rooty')
rooty()

const path = require('path');
const mime = require('mime');
const fs = require('fs');
const os = require('os');
const debug = require('debug')('phd');
const argv = require('minimist')(process.argv.slice(2));
const crypto = require('crypto');
const shasum = require('shasum');
const kgo = require('kgo');
const program = require('commander');
// const level = require('level')
// const g = require('^g')
const pandoc = require('./pandoc');

module.exports = function(config, action, program){

  // let db = level(path.join(config.cwdDir,config.dbDir))
  let buildDir = config.buildDir
  let sourcePath = path.join(config.cwdDir,program.S)
  let fileName = path.basename(sourcePath)
  let target
  let targetFile
  let source
  let sourceDir

  if(fs.lstatSync(sourcePath).isFile()){
      source = sourcePath
      sourceDir = path.dirname(sourcePath)

      let fileName = path.basename(sourcePath);
      // let target = program.S + '.' + program.T
      console.log('fileName: ',fileName);
      let targetName = fileName.split('.');
      let target = targetName.shift() + '.' + program.T;
      targetFile = path.join(config.cwdDir,config.buildDir,target)
      console.log('targetFile',targetFile);
  }
  else{
      source = fs.readdirSync(sourcePath).join(" ")
      sourceDir = sourcePath
  }

  config.sourceDir = sourceDir
  // config.bibliography = ( config.pandocOptions.bibliography.match(/^~/) )? path.join(os.homedir(), config.pandocOptions.bibliography.substring(1)) : path.join(config.cwdDir,config.pandocOptions.bibliography);
  // config.csl = ( config.pandocOptions.bibliographyStyle.match(/^~/) )? path.join(os.homedir(), config.pandocOptions.bibliographyStyle.substring(1)) : path.join(config.cwdDir,config.pandocOptions.bibliographyStyle);

  let tFile = path.join(config.cwdDir,config.buildDir,'thesis.pdf');
  let inSource = '-s '

    + path.join(config.cwdDir,'thesis','00_Title.md')
    + ' ' +
    // +
    path.join(config.cwdDir,'thesis','10_Introduction.md')
    + ' ' +  path.join(config.cwdDir,'thesis','20_Hermeneutic.md')
    + ' ' +  path.join(config.cwdDir,'thesis','21_Epistemology.md')
    + ' ' +  path.join(config.cwdDir,'thesis','22_Ontology.md')
    + ' ' +  path.join(config.cwdDir,'thesis','23_Reticulation.md')
    + ' ' +  path.join(config.cwdDir,'thesis','50_References.md') ;

  let options2 = {
    in: inSource,
    out: tFile,
    type: program.T,
  }

  let options = {
    in: source,
    out: targetFile,
    type: program.T,
  }

  pandoc( config, options, function(error, msg){
      if (error) debug('Creating pandocs error:',error);
      console.log('Done',msg)
      // done(error, msg);
  })

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
}




    // db.batch(ops, function (err) {
    //   if (err) return console.log('Ooops!', err)
    //   console.log('Great success dear leader!')
    // })
    // //
    // db.createReadStream({ keys: true, values: true })
    // .on('data', function (data) {
    //   console.log('key: ',data.key, 'value: ', data.value)
    // })







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
