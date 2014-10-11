#!/usr/bin/env node

"use strict";
var parserStream = require("../lib/wzeditor-rules-stream");
var es = require("event-stream");
var typeName = require("type-name");
process.stdin                        //connect streams together with `pipe`
    .pipe(es.split())                  //split stream to break on newlines
    .pipe(parserStream())
    .pipe(es.map(function (data, cb) {
        cb(null, JSON.stringify(data, function (key, value) {
            if (typeName(value) === "RegExp") {
                return String(value);
            }
            return value;
        }, 4) + "\n");
    }))
    .pipe(process.stdout);
