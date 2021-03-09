---
layout: post
title: "Docker 설치"
subtitle: "Windows에 도커 설치하기"
date: 2021-03-09 16:06:00 +0900
background: '/img/posts/docker-01.jpg'
category: Study
tags: [docker]
---
이전 글에서 Docker의 개념과 Docker와 VM의 차이에 대해 알아보았습니다.

> <a href="https://chaelin1211.github.io/study/2021/03/06/docker-start.html">Docker란?</a>

이번 글에선 설치하는 방법에 대해 알아보겠습니다.

이 글을 통해 설치 가능한 환경
1. Windows 10
2. 컴퓨터 가상화 지원

#### 가상화 지원 확인
[작업 관리자]-[성능]으로 들어가 가상화 부분을 확인합니다.

<img class="img-fluid" src="/img/posts/inPost/docker-02-01.png">

"사용"으로 되어있으면 도커를 사용할 수 있습니다.

가상환 지원이 안 될 경우 BIOS에서 가상화가 꺼져 있을 수도 있으니 BIOS에서 가상화 관련 옵션을 "On"으로 설정해주세요.

> BIOS란? (Basic Input/Output System)   
> 운영 체제 중 가장 기본적인 컴퓨터의 입출력을 처리하는 소프트웨어이다. 사용자가 컴퓨터를 켜면 시작되는 프로그램으로 **주변 장치와 컴퓨터 운영 체제 사이**의 데이터의 흐름을 관리한다.

### 1. 도커 설치파일 다운로드 및 설치
<a href="https://hub.docker.com/editions/community/docker-ce-desktop-windows/">docker.com</a>에 들어가서 [Get Docker]를 클릭합니다.

<img class="img-fluid" src="/img/posts/inPost/docker-02-02.png">

버튼 클릭하면 바로 다운 시작 가능합니다.

<img class="img-fluid" src="/img/posts/inPost/docker-02-03.png">

설치되면서 컴퓨터를 다시 시작해야 합니다. 저는 다시 켜졌는데 WSL을 설치하기에 kernel 버전이 낮아 지시대로 업데이트를 수행하였습니다.

<img class="img-fluid" src="/img/posts/inPost/docker-02-04.png">

링크로 들어가서 다운 후 설치해줍니다.

<img class="img-fluid" src="/img/posts/inPost/docker-02-05.png">

다운 완료 했습니다.

<img class="img-fluid" src="/img/posts/inPost/docker-02-06.png">

완료 후 다음 창의 Restart를 눌러 다시 설치를 완료합니다. - Docker 설치

<img class="img-fluid" src="/img/posts/inPost/docker-02-04.png">

하단의 숨겨진 아이콘에서 확인 가능합니다.

<img class="img-fluid" src="/img/posts/inPost/docker-02-10.png">


### 2. 튜토리얼 (Optional)
<img class="img-fluid" src="/img/posts/inPost/docker-02-07.png">
위처럼 튜토리얼을 위해 생성된 git을 clone해 실행해볼 수 있습니다.

튜토리얼을 쭉 따라가면 브라우저에서 실행하는 모습을 볼 수 있습니다.

<img class="img-fluid" src="/img/posts/inPost/docker-02-09.png">
튜토리얼 끝나고 화면에서 빨간 상자 속 버튼을 눌러주세요!

<img class="img-fluid" src="/img/posts/inPost/docker-02-08.png">

성공적으로 실행됩니다.

### 3. 회원가입
<a href="https://hub.docker.com/signup">여기서</a> 회원가입을 진행해줍니다.

<img class="img-fluid" src="/img/posts/inPost/docker-02-11.png">

저는 무료 버전으로 선택하겠습니다.

그 후에 이메일 확인하고 가입을 완료해주세요.

### 4. 로그인
아까 숨겨진 아이콘에서 도커를 선택후 로그인 해주세요!

<img class="img-fluid" src="/img/posts/inPost/docker-02-12.png">

*****

여기까지! 

Windows에 설치를 완료했습니다.

감사합니다.

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>