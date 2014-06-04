# wzeditor-word-rules-parser

[WZ EDITOR](http://www.wzsoft.jp/wz8/index.html "WZ EDITOR")の用語統一辞書のパーサーです。

[WEB+DB PRESS用語統一ルール](https://gist.github.com/inao/f55e8232e150aee918b9 "WEB+DB PRESS用語統一ルール")をパースできることを目的としています。

> \1\2ほう\3	([^使])([いくすたつのる])方([ぁ-んァ-ヶ])	,,RE<★い方が★☆使い方☆>

のような行ごとの辞書を正規表現に変換します。

### 調査レポート

辞書の形式の仕様は公開されてないので、実行結果から推測して正規表現に落としています。

* [WZ Editor 用語統一ヘルプ](https://gist.github.com/azu/ae4d643aff11e4562267 "WZ Editor 用語統一ヘルプ")

## Installation

```sh
npm wzeditor-word-rules-parser
```

## Usage

``` js
var parser = require("../lib/wzeditor-rules-parser");
var file = fs.readFileSync(__dirname + "/../dictionary/WEB+DB PRESS用語統一ルール", "utf-8");
var result = parser.parse(content);
/*
[ { beforeRegexp: /クッキー|\bCOOKIE\b|\bcookie\b/,
    afterRegexp: 'Cookie' },
  { beforeRegexp: /Web Socket/, afterRegexp: 'WebSocket' },
  { beforeRegexp: /(?:[^/]ウェブ)|(?:ウェブ[^/\+])|(?:[^/]\bWEB)|(?:WEB\b[^/\+])|(?:[^/]ウェッブ)|(?:ウェッブ[^/\+])/,
    afterRegexp: 'Web' },
  { beforeRegexp: /ORマッ|O-Rマッ/, afterRegexp: 'O/Rマッ' },
  { beforeRegexp: /O\/Rマッパー|\bORM\b/, afterRegexp: 'O/Rマッパ' },
  { beforeRegexp: /アィディア|アイディア|アィディア|アィデア/, afterRegexp: 'アイデア' },
 ....
]
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT