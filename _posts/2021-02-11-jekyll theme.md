---
layout: post
title: "3. Jekyll Theme 적용 "
subtitle: "Github 블로그에 jekyll theme 적용하기"
date: 2021-02-11 22:58:00 +0900
background: '/img/posts/jekyll-03.png'
category: Study
---

안녕하세요~

스스로 테마를 만들어도 되지만! 블로그 기능이 구현되어 있는 theme를 다운 받아 적용해서 수정하는 것이 효율적이겠죠~

*****

1. 테마 다운로드
2. 사용자 설정
3. 적용 확인

*****

<h5>1. 테마 다운로드</h5>
테마는 유료, 무료 다양하구요! 전 깔끔한 clean 테마를 다운 받았습니다. 다음 링크에서 무료 테마들을 볼 수 있습니다. 
<a class="hight-block" href="https://jekyllthemes.io/free">https://jekyllthemes.io/free</a>

<img class="img-fluid" src="/img/posts/inPost/jekyll-03-01.png">
<span class="caption text-muted">원하는 테마를 선택해서 깃으로 이동하세요!</span>

<img class="img-fluid" src="/img/posts/inPost/jekyll-03-02.png">
<span class="caption text-muted">제가 다운한 테마에요!</span>

*****

* fork - repository를 미리 생성하지 않은 경우!
* 미리 생성한 repositoy에 clone
* zip파일로 받아서 git 폴더에 압축 해제

*****

저는 zip파일로 받아서 git에 압축 해제하여 적용하였어요.

<img class="img-fluid" src="/img/posts/inPost/jekyll-03-03.png">
<span class="caption text-muted">빨간 버튼을 클릭해 테마가 저장된 github로 이동합니다!</span>

zip파일로 다운받을 수도 있고 clone할 수도 있어요.

<img class="img-fluid" src="/img/posts/inPost/jekyll-03-04.png">
<span class="caption text-muted">zip파일 다운 클릭!</span>

로컬에 있는 git 폴더에 압축 풀어주세요!

전에 미리 만들었던 index.html이랑 겹칠 수도 있는데 덮어씌워주세요! 따로 유지하고 싶으시면 다른데에 옮겨두세요.

압축폴더의 내용이 이렇게 저장됩니다.

<img class="img-fluid" src="/img/posts/inPost/jekyll-03-05.png">
<span class="caption text-muted">저는 커스터마이징한게 있어서 처음 다운 data랑은 다른 부분도 있어요</span>

<h5>2. 사용자 설정</h5>
기존 내용에서 삭제할 수 있는 부분은 삭제하고 필요한 부분을 변경할게요.

삭제해도 되는 파일은 다음과 같습니다.
<p class="hight-block">README.md<br/>jekyll-theme-clean-blog.gemspec<br/>스크린샷(.png 파일)</p>

수정할 부분은 _config.yml 파일의 내용입니다.

```
title:              Clean Blog
email:              your-email@example.com
description:        A Blog Theme by Start Bootstrap
author:             Start Bootstrap
baseurl:            "/startbootstrap-clean-blog-jekyll"
url:                "https://startbootstrap.github.io"
```

초기 내용에서 title, email과 description은 원하는 내용으로 바꿔주시면 돼요.


(필수) baseurl은 없애주시고 url의 "startbootstrap"은 본인 github 아이디로 바꿔주세요.

```
# Social Profiles
twitter_username:   SBootstrap
github_username:    StartBootstrap
facebook_username:  StartBootstrap
instagram_username:  
linkedin_username:
```

이 부분도 본인 계정으로 바꿔주시면 되고 없으면 비워두시면 됩니다!

채워주시면 하단에 링크 아이콘이 생겨요. 
<img class="img-fluid" src="/img/posts/inPost/jekyll-03-06.png">
<span class="caption text-muted">아이콘이 귀엽네요.</span>

```
# Build settings
markdown:           kramdown
paginate:           5
paginate_path:      "/posts/page:num/"
plugins:
  - jekyll-feed
  - jekyll-paginate
  - jekyll-sitemap 
```

- paginate는 한 페이지에서 나올 게시물 개수
- paginate_path는 paginate를 이용해 게시물 목록을 보여줄 페이지 path입니다.

테마 내에서 posts/index.html에서 게시물 목록이 보여지기 때문에 거기로 맞춰져 있습니다.   나중에 필요하면 변경해서 이용하시면 됩니다.

여기까지 하면 필수적인 부분은 다 교체했습니다. 추가적으로 필요한 커스터마이징은 html 파일 내에 내용을 바꾸시면 되는데 아주 쉬워요!

이 부분은 다음 글로 적을게요. 너무 길어질거 같아서...

<h5>3. 적용 확인</h5>
jekyll server를 켜서 확인해 보시면 됩니다~

혹시 위의 동작에서 baseurl 삭제를 빼먹으셨다면 오류가 날 수 있어요!

위 내용대로 했는데 오류가 난다면 prompt 창에서 파일 경로가 git 폴더가 맞는지 한 번 확인해주세요. 그래도 안된다면 ```bundle install``` 명령어 입력 후 다시 server 켜보세요! 

bundle install은 새로운 bundle 추가할 때 사용하는데 삭제하거나 변경이 있으면 다시 해줘야 합니다.

<h5>4. 후기</h5>
저는 이 부분에서 하루 꼬박 걸렸어요... 왠지 모르게 오류가 계속 나서...

baseurl 꼭 지우기!! 잊지마세요...

jekyll server가 안 된다면 꼭 두 번 째 글에서 jekyll install 코드 다시 해보는 것도 잊지마세요!

감사합니다:)

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin.</p>