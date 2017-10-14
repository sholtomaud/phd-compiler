'use strict'

const StringDecoder = require('string_decoder').StringDecoder;
const path = require('path');
const tmpDir = require('os').tmpdir();
const fs = require('fs-extra');
const debug = require('debug')('phd');
const argv = require('minimist')(process.argv.slice(2));
const kgo = require('kgo');
// const program = require('commander');
// const split = require('split');
const pandoc = require('./pandoc');

const abridgePoint = '/<!-- abridge -->/';

module.exports = function(config, action, program){

  let buildDir = config.buildDir
  let sourcePath = path.join(config.cwdDir,program.S)
  let fileName = path.basename(sourcePath)

  let target
  let targetFile
  let source
  let sourceDir

  if(fs.lstatSync(sourcePath).isFile()){
      config.sourceDir = path.dirname(sourcePath);
      config.references = path.join(config.cwdDir,config.references);
      config.csl = path.join(config.cwdDir,config.csl);

      let fileName = path.basename(sourcePath);
      let targetName = fileName.split('.');
      targetName.pop();
      targetName.push(program.T);
      targetFile = path.join(config.cwdDir,'tmp',targetName.join('.'))
      let tempFile = path.join(config.cwdDir,'tmp',fileName)

      let options = {
        in: sourcePath,
        out: targetFile,
        type: program.T,
      }


      // let writeStream = fs.createWriteStream(tempFile+'.md');

      // readable.pipe(writable);

      fs.copy(sourcePath, tempFile, function (err) {
        if (err) return console.error(err);

        fs.createReadStream(tempFile)
          .pipe(parseContent())
          .on('data', function (obj) {
            //each chunk now is a a js object
            console.log('obj',obj)
          })
          .on('error', function (err) {
            //syntax errors will land here
            //note, this ends the stream.
            console.log('error',err)
          })


        // let writeStream = fs.createWriteStream(tempFile);
        // let readStream = fs.createReadStream(tempFile)
        //   readStream
        //     .pipe(abridgeStream)
        //     .pipe(writeStream)
        //
        //
        // // This is here incase any errors occur
        // writeStream.on('error', function (err) {
        //   console.log(err);
        // });

        // pandoc( config, options, function(error, msg){
        //     if (error) debug('Creating pandocs error:',error);
        //     console.log('msg',msg)
        // })

      });


  }
  else{
      console.warn('Source is not a file. You cannot abridge a directory. Specify a file. Exiting.')
  }
}



function parseContent(stream, callback) {
  stream.on('error', callback);
  stream.on('readable', onReadable);
  const decoder = new StringDecoder('utf8');
  let content = '';
  function onReadable() {
    var chunk;
    while (null !== (chunk = stream.read())) {
      var str = decoder.write(chunk);
      if (str.match(abridgePoint)) {
        // found the header boundary
        // var split = str.split(/\n\n/);
        // header += split.shift();
        // const remaining = split.join('\n\n');
        // const buf = Buffer.from(remaining, 'utf8');
        // stream.removeListener('error', callback);
        // // set the readable listener before unshifting
        // stream.removeListener('readable', onReadable);
        // if (buf.length)
        //   stream.unshift(buf);
        // now the body of the message can be read from the stream.
        callback(null, content, stream);
      } else {
        // still reading the header.
        content += str;
      }
    }
  }
}
