---
layout: default
title:  "tempfileを使えば標準入出力に対応していないターミナルコマンドを副作用を抑えて関数化できる"

---


タイトルながー

タイトルで完結してますので記事読まなくても大丈夫です

えっと、どういうことかというとですね、たとえばpdfファイルを結合する、pdfuniteというコマンドがあります。

```bash
pdfunite hoge.pdf fuga.pdf hogefuga.pdf
# hoge.pdfとfuga.pdfを結合したものをhogefuga.pdfに書き出す
```

何度も実行するので、Ruby経由で実行したくなります(Rubyが好きなので)。pdfuniteメソッドを作ります。

```ruby
hoge = File.open('hoge.pdf', &:read)
fuga = File.open('fuga.pdf', &:read)
hogefuga = pdfunite(hoge, fuga)
```

このpdfuniteメソッドは次のような仕様だと嬉しいです。

- ファイルの中身を引数に受け取る
- 結合後のファイルの中身を返す

中身じゃなくてファイルのパスを渡せばいいじゃんと思うかもしれません。パスを渡す仕様ならば作るのは簡単です。

```ruby
def pdfunite(path1, path2)
  output_path = path1.gsub('.pdf', '') + path2
  `pdfunite #{path1} #{path2} #{output_path}`
  File.open(output_path, &:read)
end
```

こんな感じでしょうか。

ですが、これはあまり良い方法ではありません。引数がファイルのパスだからです。

渡されたパスとそのファイルの中身は別物なので、メソッドの返り値が引数以外の事柄に依存しています。

返り値が引数以外の状態に影響されるのは使いにくいです。副作用とか言われているやつです。

というわけで、パスを受け取るのはやめましょう。中身を受け取ります。

実行したいコマンドが標準入出力に対応していれば少し楽で、IO.popen を使うと、コマンドと標準入出力をやりとりできます。
[IO.popen (Ruby 2.7.0 リファレンスマニュアル)](https://docs.ruby-lang.org/ja/2.7.0/method/IO/s/popen.html)

標準入出力に非対応のコマンドのときはどうしましょう。

中身を受け取って、一旦ファイルに書き出せば良いのです。
OSの機能にtmpfileというものがあり、一時的なファイルが作れます。
これを使って、

1. tmpfileを1つ作って1つ目の引数を書き出す
1. tmpfileをもう1つ作って2つ目の引数を書き出す
1. tmpfileをもう1つ作る。空のまま
1. pdfuniteコマンドを実行
1. 出来たpdfファイルを読み込んで、中身を返す

と処理すればOKです。

```ruby
reqiure "tempfile"
def pdfunite(file1, file2)
  Tempfile.open do |f1|
    f1.puts(file1)
    Tempfile.open do |f2|
      f2.puts(file2)
      Tempfile.open do |f3|
        system("pdfunite #{f1.path} #{f2.path} #{f3.path}")
        f3.read
      end
    end
  end
end
```

ネストが深いですが、メソッドに切り出せました。

Rubyに限らず、どの言語でも出来るはずです。

ファイルの書き出し読み出しが多分重い処理になってしまうのですが、もっと良い方法はあるのでしょうか。わかりません。

以上、Rubyから標準入出力に対応していないターミナルコマンドを副作用を抑えてメソッドにする方法、でした。

