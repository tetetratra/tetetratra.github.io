---
layout: post
title:  "ブログを移しました"
tags: ブログ
---


[black-neon-tetra.hatenablog.com](https://black-neon-tetra.hatenablog.com/)
から
[blog.tetetratra.net](http://blog.tetetratra.net)
に、ブログを移しました。

- はてなブログはちょっと重い
- tetetratra.netドメインを使いたい
  - はてなブログproにすると出来るけどお金かかる
- 記事とかの管理をコードで、コマンドでやりたい

が理由です。

[jekyll](http://jekyllrb-ja.github.io/) というシステム? を使いました。

はてなブログのようなサービスとは違う、WordPressのような動的にページを作るのとも違う、静的サイトジェネレーターというものらしいです。
マークダウンで書いた記事と設定を書いたファイルをjekyllに読み込ませると、自動でHTMLのまとまりを作ってくれるしくみです。
出来たHTMLは静的なので、サーバーはこれを配信するだけでOKです。

色々な人のGitHubをふらふら見ていると、Blogというリポジトリをたまに見かけます。
ブログ記事をgit管理している風でもないしなんだろうと思っていたのですが、調べてみたらこのようなシステムでした。

jekyllの詳しい使い方は分かってないのですが、とりあえずは良さげな出来になってくれて満足です。おすすめ... かどうかはまだ分かりません。

