---
layout: post
title: "5. Jekyll Theme 커스터마이징 - 태그 적용"
subtitle: "게시글에 태그를 추가하고 카테고리 & 태그 별로 게시글 보기"
date: 2021-02-14 02:42:00 +0900
background: '/img/posts/jekyll-03.png'
category: Study
tags: [githubBlog, jekyll]
---
안녕하세요! 제가 태그 설정한 방법을 적어볼게요.

일단 제가 구현한 부분은 아래와 같습니다.

아래 블로그를 엄청 매우 참조했습니다. 같이 보는 것도 추천합니다!
<a href="https://wormwlrm.github.io/2019/09/22/How-to-add-tags-on-Jekyll.html">https://wormwlrm.github.io/2019/09/22/How-to-add-tags-on-Jekyll.html</a>

*****

1. 각 게시글에 태그 추가
2. 카테고리 별 게시글 목록에서 해당 카테고리 내의 게시글들의 태그들 가져오기
3. 태그 별 게시글 목록 가져오기
4. 게시글을 볼 때 태그 링크 추가 (클릭 시 태그별 게시글 목록으로 이동)

*****

#### 1. 각 게시글에 태그 추가
posts 폴더의 파일에 category 추가하듯이 추가해줍니다.

이 부분에 정해진 것만 저장해야하는 줄 알았는데 필요한 필드는 원하는대로 추가할 수 있더라구요!

```
---
layout: post
<!-- 내용 -->
tags: [githubBlog, jekyll]
---
```

이런 식으로 추가하는 거에요!

추가한 tag들은 파일에 목록으로 다 저장해 줄 거에요. data 폴더에 tags.yml 파일을 만든 후 거기에 목록으로 저장해 줍니다.
```
- githubBlog
- jekyll
```

#### 2. 카테고리 별 게시글 목록에서 해당 카테고리 내의 게시글들의 태그들 가져오기

##### ◇ 카테고리 내에 존재하는 태그 따로 저장하기
이 기능을 구현하기 위해 category 폴더에 만들었던 .md 파일에 tags 필드를 만들어 줍니다. 위에서 한 거랑 비슷해요. 

**해당 카테고리의 글에 새로운 태그를 추가할 때 마다 여기에도 추가하고, 전체 태그를 저장하는 tags.yml에도 추가하면 됩니다.**

```
---
layout: category
title: Study
background: '/img/bg-post-study.jpg'
description: 여러가지 촘촘따리 공부한 내용을 저장합니다.
<!-- Study 카테고리에 존재하는 태그들 -->
tags: [algorithm, baekjoon, githubBlog, jekyll] 
---
```
Study란 카테고리에 저장된 태그들을 저장한 모습이에요. Study.md 파일 내용입니다.

format도 해줄거에요!

*****

1. 한글로 된 tag를 사용하고 싶은데 url로 tag 이름을 전달할 때 인코딩 문제 발생
2. 영어로 저장된 태그 명 첫 알파벳을 대문자로 하는 등의 formatting이 필요할 때

*****

위와 같은 경우에 유용해요!

data 폴더에 format.yml 파일을 만들고 다음 같이 [key:value]의 형태로 저장합니다. [저장:화면출력]이런 형태에요.

```
algorithm : Algorithm
baekjoon : 백준알고리즘
githubBlog: Github블로그
jekyll: jekyll
```

##### ◇ tag를 화면에 띄워주는 html 파일을 작성하기
include 폴더에 tag 모듈을 만들어 주겠습니다.

저는 tag.html로 만들었습니다.

내용의 일부입니다.

<img class="img-fluid" src="/img/posts/inPost/jekyll-05-02.png">
<span class="caption text-muted">카테고리 별 tag vs 전체 tag</span>

page.tags는 위에서 카테고리 md 파일에 저장한 그 tags 입니다. 즉, 카테고리에 저장된 태그만을 가져오는 용도 입니다.

그 밑에 "posts"가 url에 포함되어 있다면...의 의미는 전체 게시글 출력하는 화면일 경우를 의미합니다. 그래서 전체 tag가 저장된 site.data.tags에서 tag 목록을 받아 오는 것입니다.

<img class="img-fluid" src="/img/posts/inPost/jekyll-05-01.png">
<span class="caption text-muted">반복문을 통해 tag들을 가져옵니다.</span>

tags.yml에 저장되지 않은 tag들은 출력되지 않게 if문을 이용하여 필터링 하였습니다.   또 site.data.format을 이용해서 formatting된 형태를 가져와 출력합니다.

이렇게 작성한 부분을 원하는 부분에 넣어줍니다. include tags.yml 코드를 이용하면 됩니다.

#### 3. 태그 별 게시글 목록 가져오기
이렇게 tag를 span으로 화면에 띄웠을 때, 클릭 시 해당 tag의 글만을 출력되도록 해야합니다.

위에 tag.html을 통해 tag들은 다음과 같이 저장됩니다. attribute 값에 tag 값을 저장하고 있습니다.
attribute에는 저장된 값이고 span value는 formatting된 값입니다.
```
<span class="tag" data-tag="algorithm">Algorithm</span>
<span class="tag" data-tag="baekjoon">백준알고리즘</span>
<span class="tag" data-tag="githubBlog">Github블로그</span>
<span class="tag" data-tag="jekyll">jekyll</span>
```

추가적으로 게시글 preview 목록에 새로운 attribute를 추가해야합니다. 해당 게시글 preview div에 게시글의 tag들을 attribute로 저장하는 것입니다.
<img class="img-fluid" src="/img/posts/inPost/jekyll-05-03.png">

아래처럼 게시글의 tags를 저장하게 됩니다.
<img class="img-fluid" src="/img/posts/inPost/jekyll-05-04.png">

버튼의 data-tag attribute와 게시물 preview의 tag 목록을 저장한 attribute를 이용해 jQuery 코드를 작성합니다. clean blog 테마 기준으로.. include 폴더의 script.html 파일에 작성했습니다.

```
// 태그를 위한 부분
$("[data-tag]").click((e) => {
  currentTag = e.target.dataset.tag;
  filterByTagName(currentTag);
})
```
click 이벤트를 이용해 tag를 가져와 filterByTagName function을 불러옵니다.

```
// filterByTagName function
function filterByTagName(tagName) {
    $('.d-none').removeClass('d-none');
    if(tagName != ""){
      $('.post-wrapper').each((index, elem) => {
        if (!elem.hasAttribute('data-'+tagName)) {
          $(elem).addClass('d-none');
        }
      });
    }
    $('.tag').removeClass('selected');
    $('.tag[data-tag='+tagName+']').addClass('selected');
}
```
d-none은 bootStrap에 있는 class로 display: none을 의미합니다. 

기존에 d-none을 가지는 것들을 removeClass를 통해 초기화하고 클릭된 tag를 가지지 않는 게시물 preview에 d-none을 추가해 보이지 않게 합니다.

<p class="hight-block">selected class, span을 버튼처럼 보이게 하는 class를 추가로 구현해주세요.</p>

#### 4. 게시글을 볼 때 태그 링크 추가 (클릭 시 태그별 게시글 목록으로 이동)
layout/post.html 파일이 게시글을 볼 수 있는 페이지입니다. 여기에 태그를 추가해 줍니다.

<img class="img-fluid" src="/img/posts/inPost/jekyll-05-05.png">
원하는 부분에 위 코드를 넣어줬습니다.

<img class="img-fluid" src="/img/posts/inPost/jekyll-05-06.png">
<span class="caption text-muted">tag 버튼들이 추가되었습니다.</span>

- page.tags는 현재 띄우고 있는 post의 tags입니다.
- if 문을 통해 미리 tags.yml에 저장된 tag만 띄웁니다.
- a태그의 href에서 tag값을 url에 저장해 줍니다. 

a태그로 posts/index.html로 이동하면서 클릭 된 tag를 저장해 이용합니다. 여기서 한글로 저장된 tag명을 사용하면 오류가 발생하기 때문에 formatting을 해줘야 합니다!

jQuery를 이용해 화면이 load될 때 동작을 수행합니다. 마찬지로 script.html 파일에 작성했습니다.

```
// 클릭된 tag 명이 저장된 url을 이용해 해당 tag의 글 목록을 출력합니다.
$(document).ready(function() {
  let currentTag = "";
  const queryTag = getParam('tag');
  if (queryTag) {
    currentTag = queryTag;
    filterByTagName(currentTag);
  }
});

// url에 저장된 value를 받아 return
function getParam(sname) {
  // 출처: https://electronic-moongchi.tistory.com/82
  var params = location.search.substr(location.search.indexOf("?") + 1);
  var sval = "";
  params = params.split("&");
  for (var i = 0; i < params.length; i++) {
      temp = params[i].split("=");
      if ([temp[0]] == sname) { sval = temp[1]; }
  }
  return sval;
}
```

위의 코드를 다 작성하였을 때, 아래의 수행을 할 수 있습니다.

<img class="img-fluid" src="/img/posts/inPost/jekyll-05-07.png">
<span class="caption text-muted">tag 버튼을 클릭합니다.</span>

<img class="img-fluid" src="/img/posts/inPost/jekyll-05-08.png">
<span class="caption text-muted">posts/index.html로 이동한 모습. jQuery에 의해 클릭된 tag가 select 되어있습니다.</span>

#### 추가
*****

tag를 선택하고 다시 tag에 관계없이 전체 글을 보고싶을 땐 버튼을 하나 더 만들어 줍니다.

다른 span 버튼 처럼 해주되 data-tag의 value를 비워둡니다. filterByTagName function에 의해 전체 글을 띄울 수 있습니다.

```
<span class="tag selected px-3" data-tag="">ALL</span>
```
저는 이렇게 작성했습니다.

*****

감사합니다.
<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>