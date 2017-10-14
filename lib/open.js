'use strict'

const path = require('path')
const os = require('os')
const spawn = require('child_process').spawn;
// const level = require('level')
// const g = require('^g')

module.exports = function(homeDir){
    let phdir = path.join(homeDir,'Documents/PhD/')
    console.log('config', phdir)
    return spawn('atom',{'with-project':phdir})

}

// let pandoc = spawn('pandoc',arg, {cwd:config.sourceDir});
