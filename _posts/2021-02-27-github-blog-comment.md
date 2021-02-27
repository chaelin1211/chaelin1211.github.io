---
layout: post
title: "7. Github.io 댓글 추가"
subtitle: "[Jekyll] 깃 블로그에 댓글 기능 추가하기"
date: 2021-02-27 11:00:00 +0900
background: '/img/posts/comments-01.png'
category: Study
tags: [githubBlog, jekyll]
comments: true
---
안녕하세요!

깃허브 블로그는 댓글 기능이 기본으로 제공되지 않습니다.

여러 방법으로 추가할 수 있지만 저는 흔히 사용되는 방법인 DIQUS로 추가해보았습니다!

제가 DISQUS를 선택한 이유는 크게 다음과 같습니다.

1. DISQUS를 이용하는 Github 블로거가 많다.   
    제 블로그에 DISQUS 계정을 이용할 수 있고 저도 DISQUS 계정을 이용해 댓글을 달 수 있으니 계정을 만드는 것이 편리하겠죠!
2. DISQUS를 이용하지 않아도 댓글을 남길 수 있다.   
    페이스북, 트위터, 구글 계정으로도 댓글을 남길 수 있습니다. 선택의 폭이 넓어 DISQUS 비유저도 이용시 편리합니다.
3. Recommend 기능도 있고 댓글 정렬도 가능합니다.

*****

우선 DISQUS 계정을 생성하고 DISQUS에서 URL을 추가해 보겠습니다.

### 1. DISQUS 계정 생성
아래의 DISQUS 블로그로 들어가주세요.

<a href="https://disqus.com/">https://disqus.com/</a>

<img class="img-fluid" src="/img/posts/inPost/disqus-01.png">

우측 상단의 Get Started를 눌러주세요!

<img class="img-fluid" src="/img/posts/inPost/disqus-02.png">

원하시는 방법으로 sign up 해주세요!

### 2. Site 추가

#### 1. 
<img class="img-fluid" src="/img/posts/inPost/disqus-03.png">

아래 버튼으로 본인 블로그를 추가해 줄거에요!

#### 2.
<img class="img-fluid" src="/img/posts/inPost/disqus-04.png">

다음 화면에서 웹사이트 이름을 적어주시고 (꼭 저 형식으로 해야하는게 아니라 편의상!) 카테고리 정해주세요.

> 저는 카테고리 Tech로 해주었습니다.

#### 3.
<img class="img-fluid" src="/img/posts/inPost/disqus-05.png">

무료 버전인 가장 아래 버튼을 눌러주세요!

#### 4.
<img class="img-fluid" src="/img/posts/inPost/disqus-06.png">

블로그 플랫폼을 선택해줍니다. 저는 Jekyll을 이용해서 Jekyll을 선택해 주었습니다.

#### 5.
<img class="img-fluid" src="/img/posts/inPost/disqus-07.png">

어떻게 설정하는지 알려주는 부분입니다.

설정을 끝내고 따라해보겠습니다.

[Configure]을 눌러 이동합니다.

#### 6.
<img class="img-fluid" src="/img/posts/inPost/disqus-08.png">

website name, url을 포함한 설정을 해줍니다. 

저는 따로 comment policy를 추가하거나 description을 추가하고 싶지 않아 다음으로 넘어갑니다.

#### 7.
<img class="img-fluid" src="/img/posts/inPost/disqus-09.png">

두 가지 모드가 있는데 간단하게는 위가 좀 더 느슨하달까요...?

||Basic|Strict|
|---|:---:|:---:|
|link|O|X|
|Image, Video|O|X|
|Guest Comment|O|X|
|보류되기 까지의 누적 신고 수|5|3|
|Toxic Comments|중간 승인 후 표시|자동 삭제|

위와 같은 차이가 있지만 저는 게스트 댓글을 허용하고 싶어서 Basic모드로 선택했습니다.

<img class="img-fluid" src="/img/posts/inPost/disqus-10.png">

성공했습니다~

*****

이제 블로그에 추가해 볼게요.

### 댓글 블록 코드 추가
##### post.html에 추가
게시글 내용을 위한 템플릿 파일에 추가해 줄거에요!

댓글 블록을 원하는 부분에 추가해 줍니다.

DISQUS에선 comments 필드를 추가해서 원하는 글 마다 필드를 true로 설정해 댓글 블록을 생성하는데 저는 카테고리 별로 나누어 댓글 블록 유무를 설정했습니다.

```
{% raw %}
{% if page.category != "Life" %}
    <div id="disqus_thread"></div>
    <script>
      var disqus_config = function () {
        this.page.url = 'https://~~.github.io{{ page.url }}';
        this.page.identifier = '{{ page.id }}';
      };
      (function () { // DON'T EDIT BELOW THIS LINE
        var d = document, s = d.createElement('script');
        s.src = 'https://~~.disqus.com/embed.js';
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
      })();
    </script>
    <noscript>Please enable JavaScript to view the <a href="https:/disqus.com/?ref_noscript">comments powered by
        Disqus.</a></noscript>
{% endif %}
{% endraw %}
```
> Life 카테고리는 혼잣말을 적는 데라 댓글 기능은 제외했습니다.

<img class="img-fluid" src="/img/posts/inPost/disqus-11.png">

이렇게 하면 jekyll server에서도 댓글 블록이 확인 가능하고 push하면 외부에서도 접근 가능합니다~

!위 코드를 복사하면 안 되고 본인 disqus 설정에 따라 바꿔주시고, url에 따라 바꿔주셔야해요!

감사합니다!

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>