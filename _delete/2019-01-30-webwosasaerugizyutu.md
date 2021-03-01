---
layout: default
title:  "Webを支える技術を読みました"
categories: other
---


<p>Webを支える技術という本を読みたいと思っていました。</p>

<p>=> 金欠だから本は買えない => 図書館で借りよう => 返したら内容忘れるじゃん => ざっくりと残しておこう</p>

<p>というわけで書きます。<br/>
4章構成だけど半分ちょっとまでしかしっかり読んでません。<br/>
いつものようにひどい文章 &amp; 雑な内容です。</p>

<hr />

<h2>Web概論</h2>

<p>webの特徴とか歴史とかを説明していておもしろかった。<br/>
WebはRESTスタイルで作られてる。<br/>
- クライアント/サーバー<br/>
- ステートレスサーバ<br/>
  - Cookieはこのスタイルからはズレてる<br/>
- キャッシュ<br/>
- 統一インターフェース<br/>
- 階層化システム<br/>
- コードオンデマンド<br/>
  - jsとかダウンロードしてクライアントで実行</p>

<p>P2Pとかはこれじゃないスタイル。P2Pなにもわかんないけど。</p>

<h2>URI</h2>

<pre class="code" data-lang="" data-unlink>http://username:password@hostname:8000/path?q=query&amp;qq=subquery#idname  </pre>


<p>が全部詰め込んだ感じのURI<br/>
場合によっては相対パスの書き方もOK<br/>
htmlなら<code>&lt;head&gt;</code>の<code>&lt;base&gt;</code>にベースURIを書く。<br/>
％エンコーディングで、普通はUTF8から変換したもの。<br/>
2038byteまでらしい。URLだけでサービス提供してみたのqiitaの記事で書いてあった気がする。<br/>
uriではリソースの<strong>名詞</strong>を表すものにすべしらしい。<br/>
はてなのサービスのURLはきれいらしい。</p>

<h2>HTTP</h2>

<p>アプリケーション層<br/>
80番port<br/>
今はHTTP/1.1なのかHTTP/2なのかわからない。<br/>
2010年版だから2について書いてない…</p>

<p>相対URI指定するならHostヘッダにHostを書く</p>

<p>メソッドは少し。getとpostしか知らない。<br/>
post使えば何でもできるけど、Webの考えに反してるからダメらしい。サーバー側で具体的にメソッドをどう使っているのかが気になる。<br/>
ツイ消しとかのHTTPメソッドがDeleteなのかも気になる。</p>

<p>postはURI指定なしで中身を送るのに対して、putはURIまで指定して中身を送ってる。postに対してのレスポンスのlocationヘッダに作られたリソースのURLがはいってる。</p>

<p><code>_method</code>パラメータを<strong>フォーム</strong>で指定すると、postで疑似deleteが表現できるらしい。<code>Content-Type: application/x-www-form-urlencoded</code>がヘッダに入る。この方法はrailsで採用されてる。<br/>
<del>ならtwitterはrailsらしいしツイ消しもpostなのね</del> 調べてみたらrailsじゃないっぽい？</p>

<p>フォーム以外の内容をpostで他のメソッド扱いとして送るときは、<br/>
<code>X-HTTP-Method-Override: PUT</code>のようにする。</p>

<p>レスポンスコードたち↓</p>

<ul>
<li>200 OK</li>
<li>201 Created</li>
<li>301 Moved Pernanentky

<ul>
<li>Locationヘッダに新URLが入る</li>
</ul>
</li>
<li>303 See Other

<ul>
<li>別のところからこのリソースは取れるよ</li>
</ul>
</li>
<li>400 Bad Request</li>
<li>401 Unauthorized

<ul>
<li>ヘッダで認証方式これ使えって言われる</li>
</ul>
</li>
<li>404 Not Found</li>
<li>500 Internal Server Error</li>
<li>503 Service Unavailable

<ul>
<li>Reetry-After ヘッダに秒数が書かれてるかも</li>
</ul>
</li>
</ul>


<p>Content-Typeヘッダ<br/>
タイプ/サブタイプ形式で、xmlには+xmlと付ける</p>

<ul>
<li>text

<ul>
<li>text/plain</li>
<li>text/csv</li>
<li>text/css</li>
<li>text/html</li>
<li>text/xml</li>
</ul>
</li>
<li>image

<ul>
<li>image/jpg</li>
<li>image/gif</li>
</ul>
</li>
<li>application

<ul>
<li>application/xml+xml</li>
<li>application/xhtml+xml</li>
<li>application/atom+xml</li>
<li>application/json</li>
<li>application/javascript</li>
</ul>
</li>
<li>audio</li>
<li>video</li>
<li>Accept

<ul>
<li>qパラメータで優先度指定できる。</li>
<li>サーバーが非対応なら406が返る</li>
</ul>
</li>
</ul>


<p>認証</p>

<ul>
<li>basic

<ul>
<li>IDとパスワードほぼ直送り</li>
</ul>
</li>
<li>Digest

<ol>
<li>まずテキトーに送って、401 Unauthorizedが返る</li>
<li>レスポンスのヘッダ内のnonce(number used once)の値を使う</li>
<li>nonce + username + password でハッシュ化する</li>
<li>それを送って認証完了</li>
</ol>
</li>
<li>WSSE

<ol>
<li>自分で決めたnonce, 日時情報, password でhashを作る</li>
<li>hash, nonce, 日時情報 , username を送る</li>
<li>サーバーがそのnonceと日時情報から、保管してあるユーザーのパスワードについてhashを計算して、送られてきたhashと一致すれば認証OK</li>
</ol>
</li>
</ul>


<p>キャッシュ<br/>
キャッシュ使うな！だったり、いついつまで使ってOK！だったりをレスポンスヘッダに書く。<br/>
いついつにGETしたリソースは持ってるよってのをリクエストに含めて無駄をなくす方法がある。<br/>
Connection: close で持続的接続になる。<br/>
サーバーのレスポンスを待たずにリクエストを送れる。</p>

<h2>ハイパーメディアフォーマット</h2>

<p>htmlとかについて。ここらへんから雑に読んだ。<br/>
xhtmlだったりAtom形式だったり、複数のxml形式を使うときは「名前空間」を指定してあげる。<br/>
<code>xmlns:接頭辞="名前空間名"</code>の書き方。<code>xmls:atom="http://www.w3.org/2005/Atom"</code>なかんじらしい。よく分かってない。<br/>
html書いたことないから要素とか全然わからない。<br/>
form要素でgetやpostでのリクエストを送れる。</p>

<p>microformatsという、リソースの意味を書くのがある。<br/>
要素への意味とかの書き方とかを統一して便利に。というもの。<br/>
Atom形式とかがそれ。<br/>
AtomPubという、リソースのCRUDを定義したやつある。</p>

<p>JSON<br/>
JSONPというものを利用すると、クロスドメイン通信ができる。<br/>
他のサーバーからなにか持ってきてそれを使える。<br/>
危険な感じがするけど、大丈夫。<br/>
JSONPに対応してあるサーバーのリソースからしかデータをとれないから、変なことは起きない。<br/>
javascriptをコールバックする形式でデータを送る必要がある。ので、大丈夫。<br/>
文での説明むずかしい。</p>

<h2>Webサービスの設計</h2>

<p>しっかり読んでないからまあいいや</p>

<hr />

<h1>終わりに</h1>

<p>おわりです</p>


