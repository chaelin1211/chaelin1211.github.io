---
layout: post
title: "4. Jekyll Theme 커스터마이징 - 카테고리 적용"
subtitle: "카테고리를 추가하고 카테고리 별로 게시글 분류해서 보기"
date: 2021-02-12 08:29:00 +0900
background: '/img/posts/jekyll-02.png'
category: Study
tags: [githubBlog, jekyll]
---

안녕하세요~

오늘은 테마 커스터마이징한 내용을 정리해볼게요! 까먹을지도 모르니 후딱 적어야겠네요.

<p class="hight-block">startbootstrap/clean-blog 테마를 이용했습니다.</p>

다음 순서대로 적어볼게요.

1. 카테고리 파일 생성 (Markdown 형식)
2. 카테고리 별 페이지 생성
3. 네비게이션 바에 추가하기
4. 게시글 페이지에서 이전 글, 이후 글로 이동하는 버튼 만들기


*****
#### 1. 카테고리 파일 생성 (Markdown 형식)
* Root에 categories폴더를 생성합니다.

원하는 카테고리들을 넣어주세요! 

저는 Life, Review, Study 이 세 가지로 정했습니다. 다음처럼 파일들을 생성해 넣어주세요!
<img class="img-fluid" src="/img/posts/inPost/jekyll-04-01.png">
<span class="caption text-muted">markdown 파일로 생성해주세요</span>

```
---
layout: category
title: Life
description: 혼잣말을 남기는 공간입니다.
background: '/img/bg-post-life.jpg'
tags: []
---
```

파일 내용은 위 처럼 채워줍니다!

title과 description은 화면 중앙에 띄워질 문구에요. 원하는 내용으로 변경하세요.   background는 뒤에 배경사진으로 쓰일 사진 파일 path를 입력하세요.

tags는 제가 카테고리 별 태그를 나눠 저장하고 싶어 추가한 부분인데... 이 부분은 다른 방법이 있을 수도 있겠네요! 카테고리 별로 tag를 저장할 필요가 없다면 생략 가능한 부분입니다.

* _data 폴더를 만들어 category.yml 파일에 목록 형식으로 저장
tag나 category를 목록으로 관리하면 쉽게 참조할 수 있습니다. 

```
- Life
- Review
- Study
```

*****
#### 2. 카테고리 별 페이지 생성
* _layouts폴더에도 category.html 파일을 만듭니다.

위에서 만든 카테고리 별 파일에서 layout을 category로 했죠? layouts 폴더의 category.html을 의미합니다. 

카테고리 별 목록을 나타내는 페이지인데, 카테고리 별로 title, 사진을 다르게 나타낼 수 있습니다.

```
---
layout: page
---
```
파일 설정은 위처럼 해주세요. 저는 별도로 모듈을 추가했습니다. tag.html은 tag별 분류를 위해 만든 모듈입니다. 위처럼 필요한 모듈을 포함할 수 있습니다. 이러한 모듈은 _includes폴더에 만들면 됩니다.

카테고리 별 글 목록을 위해선 기본 테마의 posts/index.html 파일 내용을 조금 수정해주었습니다.

<img class="img-fluid" src="/img/posts/inPost/jekyll-04-03.png">
<span class="caption text-muted">Liquid 문법이 그대로 안 보이고 불러와져서 보이네요. 왜이런담</span>

이렇게 하면 게시글 중에서 해당 카테고리의 글 목록이 출력됩니다. 현재 페이지의 카테고리를 가져와서 이용하는 방법입니다.

<img class="img-fluid" src="/img/posts/inPost/jekyll-04-02.png">
<span class="caption text-muted">카테고리 별 글 목록을 볼 수 있습니다</span>

*****
#### 3. 네비게이션 바에 추가하기
위의 페이지에 방문하기 위해 네비게이션에 카테고리별 링크를 dropdown으로 만들었습니다.

우선 dropdown 형식을 추가했습니다. 
```
<li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Posts</a>
    <div class="dropdown-menu">
        <!-- 메뉴 링크 -->
    </div>
</li>
```

메뉴 링크 부분에 category들을 찾아 불러올거에요!
<img class="img-fluid" src="/img/posts/inPost/jekyll-04-04.png">
<span class="caption text-muted">위에서 만든 category.yml 파일에서 목록을 불러와 네비게이션 바를 구성합니다.</span>

*****
#### 4. 게시글 페이지에서 이전 글, 이후 글로 이동하는 버튼 만들기
이 부분은 진짜 너무 고민이었어요! 

원래 코드가 전체 글을 기준으로 이전 글, 이후 글을 찾기 때문에 같은 카테고리 내의 글 중에서 찾도록 수정해야했습니다.

이 방법이 맞는지는 모르겠지만 제가 한 방법을 소개해드릴게요!

> 애초에 목록을 구성할 때 글 목록을 저장하지 않아서 불러올 순 없어요. 그래서 게시글 페이지에서 버튼을 구성할 때도 글을 순회해 이전, 이후 글을 찾아야 합니다! 더 좋은 방법 있다면 알려주세요...

<img class="img-fluid" src="/img/posts/inPost/jekyll-04-05.png">
<span class="caption text-muted">엄청나게 길네요ㅎㅎ</span>

우선 같은 카테고리인 전체 글을 reversed로 순회하면서 직전 글을 찾습니다.

<img class="img-fluid" src="/img/posts/inPost/jekyll-04-06.png">

또 순회해서 직후 글을 찾습니다.

즉 같은 카테고리 내의 글들을 총 1번 순회합니다. 순회 없이 찾고자 했는데 더 나은 방법을 모르겠네요. 그래도 오류는 없습니다.

<img class="img-fluid" src="/img/posts/inPost/jekyll-04-07.png">

previousPost, nextPost에 이전 글, 이후 글 url이 저장됩니다. 원래 테마의 코드를 활용해 if previousPist가 참인 경우 Previous버튼을 활성화 합니다. 같은 원리로 if nextPost가 참인 경우 Next 버튼을 활성화 합니다. 

가장 최근 글일 경우 Next 버튼 자리에 END 버튼을 만들었습니다.

*****
#### 5. 후기
이 글을 쓰면서 수정한 부분도 있고 더 효율적인 부분을 찾을 수 있었습니다!<br>다른 분들한테도 도움이 되었으면 좋겠네요!

감사합니다:)

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin.</p>