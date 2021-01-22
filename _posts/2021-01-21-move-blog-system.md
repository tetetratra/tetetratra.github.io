---
layout: post
title:  "ブログ移行中"
date:   2021-01-21 10:20:45 +0900
tags:   ブログ
---

ブログをGitHub pagesから配信するように移行中です。

今までは借りていたVPSから配信していたのですが、
サーバーの管理が大変だし(知識不足)、githubに任せよう。と思った次第です。

あとは、今まではブログの更新が手間だったんですよね。
書くのが億劫というのもあるんですが、書いた記事のデプロイも面倒で、

マークダウンでブログを書いて、ローカルでビルドして、githubにpushして、今度はサーバーにsshして、サーバーでpullして、、、

という回りくどい手順でやっていました。

もっと楽したいですよね。

GitHub actionsでjekyllのビルド処理をできるようにしてGitHubから配信すれば、
書いた記事をpushするだけでサイトに反映されます。されるはずです。

あとは、GitHubに置くことで、サーバーの故障に影響されなくなります。

借りているサーバーなんですが、色々弄りすぎて自分でもよく分からないことになっているんですよね。
下手になにか消したりすると壊れそう、みたいな。

借りてたサーバーで動かしていたものを全部別の場所に移したいなとも思っていて、ブログの移動もその整理の一環でもあります。

そういうわけで、ブログを移行しています。

それではそれでは。

<!-- You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. You can rebuild the site in many different ways, but the most common way is to run `jekyll serve`, which launches a web server and auto-regenerates your site when a file is updated. -->

<!-- Jekyll requires blog post files to be named according to the following format: -->

<!-- `YEAR-MONTH-DAY-title.MARKUP` -->

<!-- Where `YEAR` is a four-digit number, `MONTH` and `DAY` are both two-digit numbers, and `MARKUP` is the file extension representing the format used in the file. After that, include the necessary front matter. Take a look at the source for this post to get an idea about how it works. -->

<!-- Jekyll also offers powerful support for code snippets: -->

<!-- {% highlight ruby %} -->
<!-- def print_hi(name) -->
<!--   puts "Hi, #{name}" -->
<!-- end -->
<!-- print_hi('Tom') -->
<!-- #=> prints 'Hi, Tom' to STDOUT. -->
<!-- {% endhighlight %} -->

<!-- Check out the [Jekyll docs][jekyll-docs] for more info on how to get the most out of Jekyll. File all bugs/feature requests at [Jekyll’s GitHub repo][jekyll-gh]. If you have questions, you can ask them on [Jekyll Talk][jekyll-talk]. -->

<!-- [jekyll-docs]: https://jekyllrb.com/docs/home -->
<!-- [jekyll-gh]:   https://github.com/jekyll/jekyll -->
<!-- [jekyll-talk]: https://talk.jekyllrb.com/ -->
