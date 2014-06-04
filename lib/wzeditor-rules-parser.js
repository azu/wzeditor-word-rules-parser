"use strict";

var alphabetRegExp = /^[a-zA-Z]+$/;
function escapeRegExp(string) {
    if (!string) {
        return;
    }
    return string.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
}

function replaceMatchedValue(string) {
    // $$1 => $1が2だと => $1 という解釈がされてるのを回避するゆのさん
    return string.replace(/\\([\d])/g, "★ゆのさん★$1").replace(/★ゆのさん★/g
        , "$");
}
// line -> object
function patternForBeforeFieldOnly(lineObject) {
    return {
        "beforeRegexp": new RegExp("\\b" + lineObject.afterField + "\\b", "i"),
        "afterRegexp": replaceMatchedValue(lineObject.afterField)
    }
}

function stringPatternForField(fields, builder) {
    var pattens = fields.map(builder);
    return pattens.join("|");
}
function wordBuilder(predicate, string) {
    if (predicate(string)) {
        return string;
    } else {
        return escapeRegExp(string);
    }
}

function patternForBothField(lineObject) {
    var representWord = wordBuilder.bind(this, function () {
        return lineObject.hasRegExpOption;
    });
    var beforeStringPattern = stringPatternForField(lineObject.beforeFieldWords, function (word) {
        if (alphabetRegExp.test(word)) {
            return "\\b" + representWord(word) + "\\b";
        } else {
            return representWord(word);
        }
    });
    return {
        "beforeRegexp": new RegExp(beforeStringPattern),
        "afterRegexp": replaceMatchedValue(lineObject.afterField)
    }
}
function patternForRatherChar(lineObject) {
    var representWord = wordBuilder.bind(this, function () {
        return lineObject.hasRegExpOption;
    });
    var beforeStringPattern = stringPatternForField(lineObject.beforeFieldWords, function (word) {
        if (alphabetRegExp.test(word)) {
            var string = [lineObject.beforeChar, representWord(word), lineObject.afterChar].join("\\b");
            return string;
        } else {
            var string = [lineObject.beforeChar, representWord(word), lineObject.afterChar].join("");
            return string;
        }
    });
    return {
        "beforeRegexp": new RegExp(beforeStringPattern),
        "afterRegexp": replaceMatchedValue(lineObject.afterField)
    }
}
function patternForBothChar(lineObject) {
    var representWord = wordBuilder.bind(this, function () {
        return lineObject.hasRegExpOption;
    });
    var beforeStringPattern = stringPatternForField(lineObject.beforeFieldWords, function (word) {

        if (alphabetRegExp.test(word)) {
            return "(?:" + lineObject.beforeChar + "\\b" + representWord(word) + ")"
                + "|"
                + "(?:" + representWord(word) + "\\b" + lineObject.afterChar + ")"
        } else {
            return "(?:" + lineObject.beforeChar + representWord(word) + ")"
                + "|"
                + "(?:" + representWord(word) + lineObject.afterChar + ")"
        }
    });

    return {
        "beforeRegexp": new RegExp(beforeStringPattern),
        "afterRegexp": replaceMatchedValue(lineObject.afterField)
    }
}
function lineParse(line) {
    if (line.length === 0) {
        return;
    }
    if (line[0] === "#") {
        return;
    }

    /*
    コメント
        ★
        ☆
        ●
     */
    var commentRegexp = /<(.*?)>$/;
    var removedComment = line.replace(commentRegexp, "");
    var fields = removedComment.split("\t");
    /*
    前置文字,後置文字,オプション
     */
    var optionalFields = [];
    if (fields[2] != null) {
        if (fields[2].indexOf(",") === -1) {
            optionalFields = [fields[2]];
        } else {
            optionalFields = fields[2].split(",");
        }
    }
    var beforeChar = (function () {
        var withoutSpace = /\S/;
        var field = optionalFields[0];
        if (field != null && withoutSpace.test(field)) {
            return field.trim()
        } else {
            return null;
        }
    })();
    var afterChar = (function () {
        var withoutSpace = /\S/;
        var field = optionalFields[1];
        if (field != null && withoutSpace.test(field)) {
            return field.trim()
        } else {
            return null;
        }
    })();
    var hasRegExpOption = optionalFields[2] === "RE";
    var beforeField = fields[1] ? fields[1].trim() : null;
    var afterField = fields[0] ? fields[0].trim() : null;
    var lineObject = {
        // 変更前単語
        beforeField: beforeField,
        // | で区切った文字列
        beforeFieldWords: beforeField && beforeField.split("|"),
        // 変更後単語
        afterField: afterField,
        // 前置文字
        beforeChar: beforeChar,
        // 後置文字
        afterChar: afterChar,
        hasRegExpOption: hasRegExpOption
    };
    /*
    # なお、正解パターンだけ置く場合、WZ6以降ではそれ以外の記述があると機能しなくなる（コメントもだめ）
    # 「CakePHP　<★cakephp★>」ではWZ6以降は機能しない
    => iオプションの正規表現を作成する
     */
    if (beforeField === null && afterField) {
        return patternForBeforeFieldOnly(lineObject);
    }
    // 変更前単語 + 変更後単語
    if (beforeChar === null && afterChar === null) {
        return patternForBothField(lineObject);
    }
    // 前置文字 と 後置文字があるパターン
    if (beforeChar !== null && afterChar !== null) {
        return patternForBothChar(lineObject);
    } else {
        return patternForRatherChar(lineObject);
    }

}
function isNotEmpty(object) {
    return object != null;
}
function parse(content) {
    var contentByLine = content.split("\n");
    return contentByLine.map(function (line) {
        try {
            return lineParse(line);
        } catch (error) {
            console.error(error);
        }
    }).filter(isNotEmpty);
}

module.exports.parse = parse;
module.exports.lineParse = lineParse;