#! /usr/bin/env node

console.log('');


const FS = require('fs'),
      Path = require('path'),
      FolderKit = require('./FolderKit'),
      IgnoreParser = require('gitignore-parser'),
      blank_line = /[\r\n]{4,}/g;


var path = process.argv[2] || '.';

var ignore = FolderKit.searchUp(path, '.gitignore');

if ( ignore )
    ignore = IgnoreParser.compile( FS.readFileSync(ignore, 'utf-8') );


FolderKit.walkDown(path,  function (name, path) {

    path = Path.join(path, name);

    if ((name === '.git')  ||  (ignore  &&  ignore.denies( path )))
        return;

    var text = FS.readFileSync(path, 'utf-8').replace(/[ \t]+([\r\n])/g, '$1');

    var blank = text.match( blank_line );

    if (! blank)  return;

    console.log(`${path}  |  ${blank.length}`);

    FS.writeFileSync(path,  text.replace(blank_line, "\n\n"));
});