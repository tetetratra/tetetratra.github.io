---
layout: default
title:  "Atomで出来たことをNeovimでも出来るようにする"
categories: other
---

<!-- <p><span itemscope itemtype="http://schema.org/Photograph"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/b/black_neon_tetra/20200105/20200105015826.png" alt="f:id:black_neon_tetra:20200105015826p:plain" title="f:id:black_neon_tetra:20200105015826p:plain" class="hatena-fotolife" itemprop="image"></span></p> -->

![](/assets/2020-01-05-atom_to_neovim/neovim.png)


<p>AtomからNeovimに乗り換えたお話です。</p>

<p>neovimというのはvimの派生で、操作とかはほぼ同じですがオリジナルのvimより早いらしいです。以下、ホントはneovimだけどvimって書きます。</p>

<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fneovim.io%2F" title="Home - Neovim" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://neovim.io/">neovim.io</a></cite></p>

<hr />

<p>Atomも十分良いエディタです。なんですけど、ちょっとだけ不満がありました。</p>

<ul>
<li>立ち上がりが遅い。

<ul>
<li>エディタは持ち主に似るんですねハハハ(は?)</li>
</ul>
</li>
<li>ターミナル、chrome、Atomとの画面奪い合い合戦が起きてしまう

<ul>
<li>争いはよくないですね</li>
</ul>
</li>
</ul>


<p>不満なんてほとんどなかったんですけど、vimが良さそうだったからvimを使い始めました。</p>

<ul>
<li>かっこいい

<ul>
<li>いいえ</li>
</ul>
</li>
<li>マウスは極力使いたくない

<ul>
<li>ねずみ年なのに</li>
</ul>
</li>
<li>ターミナルで完結

<ul>
<li>chromeとターミナルの争いのほうが穏やか</li>
</ul>
</li>
<li>慣れれば便利そう

<ul>
<li><code>d3w</code>って打てば、「削除(delete)」+「3」+「単語(word)」みたくなる</li>
</ul>
</li>
<li>軽い

<ul>
<li>やったー</li>
</ul>
</li>
<li>どのサーバーにもvimは入ってる

<ul>
<li>電通大のiedのPCには入ってないけど</li>
</ul>
</li>
</ul>


<p>vimに移行したはいいもののatomよりも不便になったら困ります。</p>

<p>ということで、atomにあった便利機能をvimで実現するために試してみたものを紹介します。</p>

<p>vimは触ったことがあるけれど普段は使ってないよ、みたいな人向けです。プラグインの入れ方とかは各自で調べてね。</p>

<h2>左側にファイルのツリーを表示</h2>

<p>素のvimだとこういう系の機能はほとんどありません。</p>

<p>NERDTreeというプラグインを入れたら表示できます。</p>

<p><a href="https://github.com/scrooloose/nerdtree">GitHub - preservim/nerdtree: A tree explorer plugin for vim.</a></p>

<p>NERDTree-git-pluginを入れるとファイルごとのgitのstatusも表示してくれます。</p>

<p><a href="https://github.com/Xuyuanp/nerdtree-git-plugin">GitHub - Xuyuanp/nerdtree-git-plugin: A plugin of NERDTree showing git status</a></p>

<p>これ入れるだけで随分それっぽくなります。</p>

<h2>タブ機能</h2>

<p>素のvimにありました。ちょっと設定を変えるとちょっと使いやすくなります。</p>

<p><a href="https://github.com/Xuyuanp/nerdtree-git-plugin">GitHub - Xuyuanp/nerdtree-git-plugin: A plugin of NERDTree showing git status</a></p>

<p>タブも使ってNERDTreeも使うなら、vim-nerdtree-tabも入れるといいかもです。</p>

<h2>ステータスバー(下のバー)の表示がいまいち</h2>

<p>設定を書き換えてもいいんでしょうけど、これを入れたら簡単にいい感じになりました。</p>

<p><a href="https://github.com/itchyny/lightline.vim">GitHub - itchyny/lightline.vim: A light and configurable statusline/tabline plugin for Vim</a></p>

<p>文字コード、カーソル位置、現在のモードやgitのブランチとかを表示してくれます。</p>

<p>vimに限らずターミナルとかで新幹線や鉛筆みたいな表示をたまに見かけるんですけど、あれちょっと派手すぎな気がしませんか。このくらいが丁度いいです。</p>

<h2>色がいまいち</h2>

<p>カラースキームを設定しましょう。icebergというテーマが好きです</p>

<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fgithub.com%2Fcocopon%2Ficeberg.vim" title="cocopon/iceberg.vim" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://github.com/cocopon/iceberg.vim">github.com</a></cite></p>

<p>脱線なんですけど、このテーマを作った方(cocoponさん)のこの記事が面白かったです。</p>

<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fcocopon.me%2Fblog%2F2018%2F09%2Fmy-favorite-things" title="制約によって生じる本質の結晶 - ここぽんのーと" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://cocopon.me/blog/2018/09/my-favorite-things">cocopon.me</a></cite></p>

<p>アクアリウムレイアウトとかはどうなんでしょう。水槽内という制限はありますが、コンテスト上位作品は巨大水槽しかないので微妙な気がします。</p>

<h2>ファイル横断検索</h2>

<p>今いるファイル内の単語検索はできるんです。正規表現も使えますし。</p>

<p>今いるディレクトリ内の全ファイルから単語を探したい時もたまにあります。Atomだと簡単にできるんですけど、vim-fugitiveを入れるとvimでもできるようになります。</p>

<p>(追記: 素のvimにもありました)</p>

<p><a href="https://github.com/tpope/vim-fugitive">GitHub - tpope/vim-fugitive: fugitive.vim: A Git wrapper so awesome, it should be illegal</a></p>

<h2>PDFを見る</h2>

<p>vimでは多分見れません。chromeで見てます。</p>

<h2>マルチカーソル</h2>

<p>Atomではコマンドキーを押しながらクリックするとカーソルが増えます。
vimでもできるようにするプラグインがあるんですけど全然使いこなしてません</p>

<p><a href="https://github.com/terryma/vim-multiple-cursors">GitHub - terryma/vim-multiple-cursors: True Sublime Text style multiple selections for Vim</a></p>

<h2>コメントアウトのショートカット</h2>

<p>nerdcommenterを入れると拡張子に応じていい感じにコメントアウトしてくれます。</p>

<p><a href="https://github.com/preservim/nerdcommenter">GitHub - preservim/nerdcommenter: Vim plugin for intensely nerdy commenting powers</a></p>

<h2>独自のキーバインド</h2>

<p>これはむしろ逆かもしれません。</p>

<p>vimにはキーバインド設定ができるしほとんどの人がしてると思うんですけど、atomにもあります。</p>

<h2>コード整形</h2>

<p>Ruby書く時の話です。</p>

<p>rubocopというRubyのライブラリ(gem)がありまして、コードの良くない点を指摘してくれます。</p>

<p>まずはrubocopというgemをシステムにインストールしましょう。</p>

<p>次に、vim-rubocopと、aleをvimに入れて終わりです。コードを指摘されましょう。</p>

<p><a href="https://github.com/ngmy/vim-rubocop">GitHub - ngmy/vim-rubocop: The Vim RuboCop plugin runs RuboCop and displays the results in Vim</a></p>

<p><a href="https://github.com/dense-analysis/ale">GitHub - dense-analysis/ale: Check syntax in Vim asynchronously and fix files, with Language Server Protocol (LSP) support</a></p>

<p><a href="https://hoshinotsuyoshi.com/post/neovim_rubocop_autocorrect/">&#x26A1;neovim + &#x1F37B;ale + &#x1F693;rubocop &middot; hoshinotsuyoshi.com - &#x81EA;&#x7531;&#x306A;&#x30D6;&#x30ED;&#x30B0;&#x3060;&#x3088;</a></p>

<h2>補完</h2>

<p>変数の補完は素のvimにも入っています。</p>

<p>コードの補完は、atomの時はrsenseというgemを使った方法でしていました。</p>

<p>vimでは、deopleteという汎用補完プラグインと、deoplete-rubyを入れて使っています。</p>

<p><a href="https://github.com/Shougo/deoplete.nvim">GitHub - Shougo/deoplete.nvim: Dark powered asynchronous completion framework for neovim/Vim8</a></p>

<p><a href="https://github.com/ishbullet/deoplete-ruby">https://github.com/ishbullet/deoplete-ruby</a></p>

<p>他の補完できる言語ついてはここにまとまっています。
<a href="https://github.com/Shougo/deoplete.nvim/wiki/Completion-Sources">Completion Sources &middot; Shougo/deoplete.nvim Wiki &middot; GitHub</a></p>

<p>deopleteの作者さん ( Shougoさん ( <ruby><rb>暗黒美無王</rb><rp>（</rp><rt>dark vim master</rt><rp>）</rp></ruby>さん ) ) ですが、この方neovim自体の作者さんで、日本の方です。
いくつかプレゼンのスライドが上がっていてどれも面白かったです。</p>

<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fwww.slideshare.net%2FShougo" title="Shougo" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://www.slideshare.net/Shougo">www.slideshare.net</a></cite></p>

<hr />

<p>以上、atomからneovimに移行した記事でした〜</p>

