"use strict";

var alphabetRegExp = /^[a-zA-Z]+$/;
function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\$1");
}
// line -> object
function patternForBeforeFieldOnly(lineObject) {
    return {
        "beforeRegexp": new RegExp(lineObject.afterField, "i"),
        "afterRegexp": lineObject.afterField
    }
}

function patternForBothField(lineObject) {
    if (alphabetRegExp.test(lineObject.beforeField)) {
        return {
            "beforeRegexp": new RegExp("\\b" + lineObject.beforeField + "\\b"),
            "afterRegexp": lineObject.afterField
        }
    } else {
        return {
            "beforeRegexp": new RegExp(lineObject.beforeField),
            "afterRegexp": lineObject.afterField
        }
    }
}
function safeString(string) {
    return string == null ? "" : string;
}
function patternForRatherChar(lineObject) {
    if (alphabetRegExp.test(lineObject.beforeField)) {
        var string = [lineObject.beforeChar, lineObject.beforeField, lineObject.afterChar].join("\\b");
        return {
            "beforeRegexp": new RegExp(escapeRegExp(string)),
            "afterRegexp": lineObject.afterField
        }
    } else {
        var string = [lineObject.beforeChar, lineObject.beforeField, lineObject.afterChar].join("");
        return {
            "beforeRegexp": new RegExp(escapeRegExp(string)),
            "afterRegexp": lineObject.afterField
        };
    }
}
function patternForBothChar(lineObject) {
    if (alphabetRegExp.test(lineObject.beforeField)) {
        return  {
            "beforeRegexp": new RegExp(
                    "(?:" + lineObject.beforeChar + "\\b" + lineObject.beforeField + ")"
                    + "|"
                    + "(?:" + lineObject.beforeField + "\\b" + lineObject.afterChar + ")"
            ),
            "afterRegexp": lineObject.afterField
        };
    } else {
        return  {
            "beforeRegexp": new RegExp(
                    "(?:" + lineObject.beforeChar + lineObject.beforeField + ")"
                    + "|"
                    + "(?:" + lineObject.beforeField + lineObject.afterChar + ")"
            ),
            "afterRegexp": lineObject.afterField
        };
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
function parse(content) {
    var contentByLine = content.split("\n");
    return contentByLine.map(function (line) {
        return lineParse(line);
    });
}

module.exports.parse = parse;