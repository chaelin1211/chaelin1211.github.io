---
layout: post
title: "2. Jekyll & Ruby 적용 (윈도우)"
subtitle: "Jekyll을 이용하여 편해지기 - 로컬에서 미리 보고 수정하기"
date: 2021-02-11 11:27:00 +0900
background: '/img/posts/jekyll-02.png'
category: Study
---

안녕하세요~

github 블로그를 작성하는데 있으면 편한! jekyll과 ruby 다운로드와 사용에 대해 다뤄볼게요!

*****

1. Ruby 설치
2. Jekyll 설치
3. 적용하기

*****
추가적으로 인코딩 오류 발생 시 필요한 내용도 가장 아래 쪽에 있습니다.

<h3>1. Ruby 설치</h3>

<a href="https://rubyinstaller.org/downloads/">여기</a>에서 윈도우용 RubyInstaller를 다운받아 설치해주세요.
<img class="img-fluid" src="/img/posts/inPost/jekyll-02-01.png">
<span class="caption text-muted">제가 받은 버전입니다.</span>

다운 받아 설치 후! 다음 프로그램을 실행합니다.

<img class="img-fluid" src="/img/posts/inPost/jekyll-02-02.png">

<h3>2. Jekyll 설지</h3>
Start Command Prompt on Ruby에서 다음 코드를 통해 패키지 설치를 진행합니다.

```
gem install jekyll
gem install minima
gem install bundler
gem install jekyll-feed
gem install tzinfo-data
```

성공적으로 설치됐는지 꼭 확인해주세요! 제가 할 땐 꼭 몇 개씩 설치가 안 되더라구요... 만약 설치가 안 됐다면 ```cd``` 명령어로 폴더를 이동해 다시 시도해보세요!


<h3>3. 적용하기</h3>
우선 본인의 git 파일이 있는 로컬 폴더로 이동합니다! (clone해서 로컬에 저장하고 그 폴더로 이동하는 거에요)   다음 명령어를 이용하면 됩니다.
```
cd C:\chaelin1211.github.io
```

그 후 다음 명령어로 jekyll server를 실행합니다.
```
jekyll server
```

그럼 다음과 같은 출력을 볼 수 있습니다.
```
C:\chaelin1211.github.io>jekyll server
Configuration file: C:/chaelin1211.github.io/_config.yml
            Source: C:/chaelin1211.github.io
       Destination: C:/chaelin1211.github.io/_site
 Incremental build: disabled. Enable with --incremental
      Generating...
       Jekyll Feed: Generating feed for posts
                    done in 33.338 seconds.
 Auto-regeneration: enabled for 'C:/chaelin1211.github.io'
    Server address: http://127.0.0.1:4000/
  Server running... press ctrl-c to stop.
  ```

<a href="http://127.0.0.1:4000/">http://127.0.0.1:4000/</a>

링크에 들어가면 로컬 서버에서 블로그를 볼 수 있으며 깃에 push하기 전에 미리 확인할 수 있습니다!

내용을 수정하면 실시간으로 오류 내용도 확인할 수 있습니다.

<p class="hight-block">Git에 push하기 전에 미리 로컬에서 확인할 수 있어 매우 편해요!</p>


+) 인코딩 오류 발생시 다음 코드를 입력하면 됩니다
```
chcp 65001
```

감사합니다:)

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin.</p>