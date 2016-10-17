#!/usr/bin/env node

"use strict";
var path = require("path");
var parse = require(path.join(__dirname, "../lib/wzeditor-rules-parser")).parse;
var concat = require('concat-stream');
var fs = require('fs');
var file = process.argv[2];
var input = file && file !== '-'
        ? fs.createReadStream(process.argv[2])
        : process.stdin
    ;
input.pipe(concat(function (buf) {
    console.log(parse(buf.toString('utf8')));
}));