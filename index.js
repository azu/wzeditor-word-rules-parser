"use strict";
module.exports = {
    parse: require("./lib/wzeditor-rules-parser").parse,
    lineParse: require("./lib/wzeditor-rules-parser").lineParse,
    parseLineStream: require("./lib/wzeditor-rules-stream")
};