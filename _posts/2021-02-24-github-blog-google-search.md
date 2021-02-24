---
layout: post
title: "6. Github 블로그 구글 검색 노출"
subtitle: "구글 검색 유입 허용하기"
date: 2021-02-24 17:20:00 +0900
background: '/img/posts/google.jpg'
category: Study
tags: [githubBlog, jekyll]
---
안녕하세요!

오늘은 구글에서 github 블로그를 검색해서 들어오도록 설정해보겠습니다.

> 사실 처음에 그냥 되는 줄 알았네요...ㅎㅎㅎ 직접 제 글을 검색 해보고 알게 되었습니다... 안 된다는 것을...

설정하기 전에 Google 검색 원리를 간단하게 알고 넘어가면 좋을 것 같아요!

*****

### 검색에서 정보를 구성하는 방법
##### 1. 크롤링으로 정보 찾기 
Google은 웹 크롤러라는 소프트웨어를 사용하여 공개된 웹페이지를 발견합니다. 

크롤러는 웹페이지를 살펴보고 해당 웹페이지에 있는 링크를 따라갑니다. 이 크롤러는 여러 링크를 넘나들며 이러한 웹페이지에 관한 데이터를 Google 서버로 가져옵니다.
##### 2. 색인 생성을 통한 정보 구성
크롤러가 웹페이지를 찾으면 Google 시스템에서는 브라우저와 마찬가지로 해당 **페이지의 콘텐츠를 렌더링**합니다.

웹페이지 색인이 생성되면 웹페이지에 포함된 모든 단어의 색인 항목에 웹페이지를 추가합니다.
##### 3. 검색어와 색인을 이용해 결과 제공

> 자세한 내용은 <a href="https://www.google.com/intl/ko/search/howsearchworks/">여기</a>를 참조하세요!

*****

이렇게 구글 검색 원리에 대해 알아보았습니다!

다음 순서대로 진행해 블로그를 검색 노출 해보도록 하겠습니다.

*****

1. robots.txt 생성
2. sitemap.xml 생성
3. Google Search Console에 등록

*****

## 1. robots.txt 생성
>로봇 메타 태그를 사용하면 개별 페이지의 **색인이 생성되는 방식**과 Google 검색결과에서 페이지가 사용자에게 게재되는 방식을 제어하는 자세한 **페이지별 접근방식**을 활용할 수 있습니다.

>참고하지 않았으면 하는 파일들과 참고했으면 하는 파일들을 설정해 주면 웹 크롤러가 해당 내용을 확인하고 내가 설정한 파일들만 참고합니다.

##### 1. robots.txt 파일을 github.io repository root에 생성합니다.
##### 2. 다음 내용을 파일에 복사해줍니다.
```
 User-agent: *
 Allow: /
 Sitemap: https://[username].github.io/sitemap.xml
```
위 내용은 모든 로봇(웹 크롤러)의 접근을 허용한다는 의미입니다!

밑의 Sitemap은 각자 본인 github 계정으로 바꿔서 입력해주세요.

## 2. sitemap.xml 생성
>크롤링 프로세스는 이전의 크롤링 작업을 통해 수집한 웹 주소 목록과 웹사이트 소유자가 제공한 **사이트맵**에서부터 시작됩니다. 크롤러는 웹사이트를 방문한 다음 사이트에 있는 링크를 사용하여 다른 페이지를 찾습니다. 

>또한 크롤러 소프트웨어는 새로운 사이트, 기존 사이트의 변경사항, 깨진 링크를 주의 깊게 살핍니다. 크롤링할 사이트, 크롤링 횟수 및 각 사이트에서 가져올 페이지 수는 컴퓨터 프로그램에서 결정됩니다.

sitemap.xml을 생성하는 간단한 방법은 두 가지 입니다.

하니씩 살펴 보겠습니다. 

##### 직접 sitemap.xml 파일을 생성
1. sitemap.xml 파일을 github.io repository root에 생성합니다.
2. 다음 내용을 파일에 복사해줍니다.
3. https://[username].github.io/sitemap.xml 에 들어가 확인합니다.

> 정해진 형식대로 sitemap을 구현하는 코드입니다.

```
---
layout: null
sitemap:
exclude: 'yes'
---
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{%raw%}
  {% for post in site.posts %}
    {% unless post.published == false %}
    <url>
      <loc>{{ site.url }}{{ post.url }}</loc>
      {% if post.sitemap.lastmod %}
        <lastmod>{{ post.sitemap.lastmod | date: "%Y-%m-%d" }}</lastmod>
      {% elsif post.date %}
        <lastmod>{{ post.date | date_to_xmlschema }}</lastmod>
      {% else %}
        <lastmod>{{ site.time | date_to_xmlschema }}</lastmod>
      {% endif %}
      {% if post.sitemap.changefreq %}
        <changefreq>{{ post.sitemap.changefreq }}</changefreq>
      {% else %}
        <changefreq>monthly</changefreq>
      {% endif %}
      {% if post.sitemap.priority %}
        <priority>{{ post.sitemap.priority }}</priority>
      {% else %}
        <priority>0.5</priority>
      {% endif %}
    </url>
    {% endunless %}
  {% endfor %}
{%endraw%}
</urlset>
```

##### Jekyll plugin을 이용해 sitemap.xml 생성
이 plugin만 추가하면 되는 간단한 방법입니다. 따로 sitemap.xml 파일을 추가하지 않아도 됩니다.

_config.yml의 내용에 다음처럼 추가해주세요!

```
plugins:
  - jekyll-sitemap
```

https://[username].github.io/sitemap.xml에 들어가 확인합니다.
<img class="img-fluid" src="/img/posts/inPost/jekyll-06-01.png">
<span class="caption text-muted">위와 같은 화면이면 바르게 된 것입니다.</span>

## 3. Google Search Console에 등록
#### 1. Google Search Console에 들어가 시작합니다
이전에 사용해봤던 분은 다음으로 넘어가주세요.

[시작하기] 버튼으로 다음으로 넘어가주세요.

<img class="img-fluid" src="/img/posts/inPost/jekyll-06-02.png">

#### 2. 속성 추가
[속성 추가]를 눌러주세요.
<img class="img-fluid" src="/img/posts/inPost/jekyll-06-03.png">

다음 화면에서 본인 github.io url을 입력해주세요. 

[계속] 버튼으로 다음으로 넘어가주세요.
<img class="img-fluid" src="/img/posts/inPost/jekyll-06-04.png">

#### 3. 소유권 확인
1번 버튼을 눌러 .html 파일을 받아 github.io repository root에 저장해주세요.

2번 버튼을 눌러 인증을 확인하세요.

<img class="img-fluid" src="/img/posts/inPost/jekyll-06-05.png">

소유권이 확인되면 [속성으로 이동]을 눌러 다음으로 넘어가주세요.
<img class="img-fluid" src="/img/posts/inPost/jekyll-06-06.png">

#### 4. sitemap.xml 추가
Sitemaps 탭에서 다음처럼 입력 후 [제출]버튼을 눌러주세요!

아래의 제출된 사이트맵에 입력됩니다. 
<img class="img-fluid" src="/img/posts/inPost/jekyll-06-07.png">

**처음엔 실패할 수 있으나 사이트맵 처리까지 텀이 있으니 나중에 다시 확인하면 됩니다.**

만약 실패 시 상세 오류에 따로 오류 사항이 존재하면 실패된 것이니 오류가 없는지 다시 시도해보세요.

## 확인하기
<img class="img-fluid" src="/img/posts/inPost/jekyll-06-08.png">
다음처럼 글과 블로그가 뜨는 것을 확인할 수 있습니다.

감사합니다.
<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>
