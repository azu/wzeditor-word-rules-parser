"use strict";
module.exports = {
    parse: require("./lib/wzeditor-rules-parser").parse,
    rawLineParse: require("./lib/wzeditor-rules-parser").rawLineParse,
    lineParse: require("./lib/wzeditor-rules-parser").lineParse,
    lineParseStream: require("./lib/wzeditor-rules-stream")
};
