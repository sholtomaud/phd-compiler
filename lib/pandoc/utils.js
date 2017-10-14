'use strict';
const path = require('path');
const fs = require('fs');

// config.bibliography = ( config.pandocOptions.bibliography.match(/^~/) )? path.join(os.homedir(), config.pandocOptions.bibliography.substring(1)) : path.join(config.cwdDir,config.pandocOptions.bibliography);
// config.csl = ( config.pandocOptions.bibliographyStyle.match(/^~/) )? path.join(os.homedir(), config.pandocOptions.bibliographyStyle.substring(1)) : path.join(config.cwdDir,config.pandocOptions.bibliographyStyle);

function resolveHome(config, filepath) {
    if (filepath[0] === '~') {
        return path.join(process.env.HOME, filepath.slice(1));
    }
    if (filepath[0] === '.') {
        return path.join(config.cwdDir, filepath.slice(1));
    }
    return filepath;
}

function type(config, type) {
  return `-t ${type}`;
}

function sourceFile(config, source) {
  let sourcePath = path.join(config.cwdDir,source);
  let fileName = path.basename(sourcePath);
  let sourceFile;
  let sourceDir;

  if(fs.lstatSync(sourcePath).isFile()){
      sourceFile = sourcePath;
      sourceDir = path.dirname(sourcePath);
      let fileName = path.basename(sourcePath);
      // console.log('source fileName: ',fileName);
      // console.log('source sourcePath: ',sourcePath);
  }
  else{
      sourceFile = fs.readdirSync(sourcePath).join(" ");
      sourceDir = sourcePath;
  }

  return `-s ${sourcePath}`;
}

function pandocFilters(config, filters) {
  let filterString =  filters.map((arg)=>{
    return `-F ${arg}`;
  },[]);
  return filterString.join(" ");
}

function referenceDocx(config, docx) {
  if (config.pandocOptions.type == 'docx') return `--reference-docx= ${resolveHome(config,docx)}`;
  return null;
}

function tableOfContents(config, toc) {
  return '--toc'
}

function tocDepth(config, depth) {
  return `--toc-depth ${depth}`;
}

function highlightStyle(config, style) {
  return `--highlight-style ${style}`;
}

function bibliography(config, biblio) {
  // console.log('config.bib', config.pandocOptions, 'biblio',biblio);
  // console.log('biblio',resolveHome(biblio));
  // path.resolve()
  let bib = `--biblio ${resolveHome(config,biblio)}`;
  return bib; //path.resolve(__dirname, biblio);
}

function bibliographyStyle(config, csl){
  let cs = `--csl ${resolveHome(config,csl)}`;
  return  cs; //path.resolve(__dirname, csl);
}

module.exports = { type, sourceFile, pandocFilters, referenceDocx, tableOfContents, tocDepth, highlightStyle, bibliography, bibliographyStyle, };
