"use strict";
var assert = require("power-assert");
var fs = require("fs");
var parser = require("../wzeditor-rules-parser");
function assertRegExp(actual, expect) {
    assert.equal(String(actual), String(expect));
}
function escapeS(string) {
    return string.replace(/\\/g, "\\\\");
}
describe("wzeditor-rules-parser", function () {
    var file = fs.readFileSync(__dirname + "/../dictionary/WEB+DB PRESS用語統一ルール", "utf-8");
    context("When 前置文字だけの場合", function () {
        var content = "Git";
        it("大文字を無視する変換の正規表現を生成", function () {
            var result = parser.parse(content);
            assertRegExp(result[0].beforeRegexp, /Git/i);
        });
    });
    context("単純な文字列置換において", function () {
        context("変更前単語がアルファベットの場合", function () {
            var content = "AFTER\tabc";
            it("境界値を含めた変換する正規表現を生成", function () {
                var result = parser.parse(content);
                assertRegExp(result[0].beforeRegexp, /\babc\b/);
            });
        });
        context("変更前単語が日本語の場合", function () {
            var content = "変換後\t日本語";
            it("完全一致で変換する正規表現を生成", function () {
                var result = parser.parse(content);
                assertRegExp(result[0].beforeRegexp, /日本語/);
            });
        });
    });
    context("変更前単語 + 前置文字のみの場合で", function () {
        context("変更前単語が日本語の時", function () {
            var content = "変換後\t日本語\t[\\d]";
            it("前置文字 + 変更前単語 の正規表現を生成", function () {
                var result = parser.parse(content);
                assertRegExp(result[0].beforeRegexp, /[\d]日本語/);
            });
        });
        context("変更前単語がアルファベットの時", function () {
            var content = "変換後\tABC\t[\\d]";
            it("変更前単語 \b 前置文字 の正規表現を生成", function () {
                var result = parser.parse(content);
                console.log(result[0].beforeRegexp);
                assertRegExp(result[0].beforeRegexp, /[\d]\bABC\b/);
            });
        });
    });
    context("変更前単語 + 後置文字のみの場合で", function () {
        context("変更前単語が日本語の時", function () {
            var content = "変換後\t日本語\t,[\\d]";
            it("変更前単語 + 後置文字 の正規表現を生成", function () {
                var result = parser.parse(content);
                assertRegExp(result[0].beforeRegexp, /日本語[\d]/);
            });
        });
        context("変更前単語がアルファベットの時", function () {
            var content = "変換後\tABC\t,[\\d]";
            it("変更前単語 \b 後置文字 の正規表現を生成", function () {
                var result = parser.parse(content);
                assertRegExp(result[0].beforeRegexp, /\bABC\b[\d]/);
            });
        });
    });
    context("前置文字、後置文字両方ある場合で", function () {
        context("変更前単語が日本語の時", function () {
            var content = "変換後\t日本語\t[\\w],[\\d]";
            it("(前置文字 + 変更前単語) or (変更前単語 + 後置文字)の正規表現を生成", function () {
                var result = parser.parse(content);
                assertRegExp(result[0].beforeRegexp, /(?:[\w]日本語)|(?:日本語[\d])/);
            });
        });
        context("変更前単語がアルファベットの時", function () {
            var content = "変換後\tABC\t[\\w],[\\d]";
            it("(前置文字 \b 変更前単語) or (変更前単語 b 後置文字)の正規表現を生成", function () {
                var result = parser.parse(content);
                assertRegExp(result[0].beforeRegexp, /(?:[\w]\bABC)|(?:ABC\b[\d])/);
            });
        });
    });
    context("前置文字に|がある場合", function () {
        var content = "変換後\tABC|EFG\t[\\w],[\\d]";
        it("|の数だけorの正規表現が作成される", function () {
            var result = parser.parse(content);
            assertRegExp(result[0].beforeRegexp, /(?:[\w]\bABC)|(?:ABC\b[\d])|(?:[\w]\bEFG)|(?:EFG\b[\d])/);
        });
    });
});