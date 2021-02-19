---
layout: post
title: "[Error][짧은글] Github 블로그 게시 오류"
subtitle: "게시글의 날짜와 링크에 오류가 생긴 경우"
date: 2021-02-19 17:27:00 +0900
background: '/img/posts/jekyll-03.png'
category: Study
tags: [githubBlog, error]
---

안녕하세요!

저는 jekyll server로 포스팅 전 테스트를 해보는데 의문의 오류가 발생해서 관련 글을 써봅니다.

우선 jekyll server로 확인했을 땐 전혀 문제가 없었는데 push 후 github.io에 들어가 확인하니 기능상 오류가 발생하더라구요.

1. 다른 날짜로 작성한 두 게시글 중 한 게시글의 날짜가 다르게 표기 됨
2. 또 다른 게시글 선택 시 해당 게시글이 아닌 다른 게시글로 연결됨

위 두 가지 문제가 발생했습니다. 두 게시글의 제목은 다음과 같았습니다.

*****
2021-02-11-diary.md   
2021-02-12-diary.md
*****

이름은 똑같고 날짜가 다르죠! 

### 1. 다른 날짜로 작성한 두 게시글 중 한 게시글의 날짜가 다르게 표기 됨
#### jekyll 서버에서 글 목록
<img class="img-fluid" src="/img/posts/inPost/error-01-01.png">

#### github.io에서 글 목록
<img class="img-fluid" src="/img/posts/inPost/error-01-02.png">

보이는 것처럼 위의 게시물 날짜가 바뀌죠! jekyll server의 날짜가 맞는 날짜입니다.

### 2. 또 다른 게시글 선택 시 해당 게시글이 아닌 다른 게시글로 연결됨
글 목록 중 아래 글을 선택해 보았습니다.

#### jekyll 서버에서 클릭 후 화면
<img class="img-fluid" src="/img/posts/inPost/error-01-04.png">

#### github.io에서 클릭 후 화면
<img class="img-fluid" src="/img/posts/inPost/error-01-05.png">

이처럼 같은 글을 선택했는데 다른 수행이 발생하네요...

결과적으로 목록 아래에 위치한 글은 github.io에서 볼 수 없게 되었어요!

다른 카테고리 내의 글과 같은 template을 쓰는데... 이런 오류가 여기서만 발생했습니다. 제 생각엔 글의 파일 제목이 url로 파싱되어 들어가는데 날짜 부분을 제외한 제목 부분이 같으면 안 되는 거 같아요.

*****
만약 글의 파일 제목이 2021-02-12-diary.md라면 글 선택시 url은 /2021/02/12/diary-02.html로 변형됩니다.

*****

### 3. 해결
위에서 예상한대로 두 글의 제목을 다음처럼 바꾸었더니 기능상 오류를 잡을 수 있었습니다.

*****
2021-02-11-diary-01.md   
2021-02-12-diary-01.md
*****

### 결론
_posts 내의 post 파일의 제목의 날짜 부분은 Parsing 되고 뒤의 title 부분은 고유해야 한다.

감사합니다.
<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>