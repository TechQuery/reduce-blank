'use strict';

const FS = require('fs'), Path = require('path');


function Folder_Stat(path, forEach) {

    for (let name  of  FS.readdirSync( path ))
        if ((name !== '.')  &&  (name !== '..')) {

            let URI = Path.join(path, name).replace('\\', '/');

            if (false  ===  forEach.call(FS.statSync( URI ),  name,  URI))
                break;
        }
}


exports.searchUp = function Search_Up(path, file) {

    var URI;

    Folder_Stat(path,  function (name) {

        if (name === file)  return  !(URI = Path.join(path, file));
    });

    if ( URI )  return URI;

    var parent = Path.join(path, '..');

    if ((parent !== path)  ||  (parent !== '..'))
        return  Search_Up(parent, file);
};


exports.walkDown = function Walk_Down(path, forEach) {

    Folder_Stat(path,  function (name) {

        if ( this.isDirectory() )
            Walk_Down(Path.join(path, name),  forEach);
        else
            forEach.call(this, name, path);
    });
};