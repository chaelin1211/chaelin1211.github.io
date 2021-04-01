---
layout: post
title: "[Error] Docker Run 시에 발생한 오류"
subtitle: "error during connect: This error may indicate that the docker daemon is not running.: Get http://%2F%2F.%2Fpipe%2Fdocker_engine/v1.24/images/json: open //./pipe/docker_engine: The system cannot find the file specified."
date: 2021-03-12 18:28:00 +0900
background: '/img/posts/game_over.jpg'
category: Study
tags: [spring, error, docker]
---
안녕하세요.

잘 되던 docker가 계속 오류가 발생해서 여러 방법을 해봤는데, 검색해서 다른 분들이 해결 성공한 방법이랑 제가 성공한 방법을 모아서 정리 해보았습니다.

### 오류 내용
```
error during connect: This error may indicate that the docker daemon is not running.: Get http://%2F%2F.%2Fpipe%2Fdocker_engine/v1.24/images/json: open //./pipe/docker_engine: The system cannot find the file specified.
```

```
error during connect: This error may indicate that the docker daemon is not running.: Post http://%2F%2F.%2Fpipe%2Fdocker_engine/v1.24/build?buildargs=%7B%7D&cachefrom=%5B%5D&cgroupparent=&cpuperiod=0&cpuquota=0&cpusetcpus=&cpusetmems=&cpushares=0&dockerfile=Dockerfile&labels=%7B%7D&memory=0&memswap=0&networkmode=default&rm=1&shmsize=0&t=restful_springboot&target=&ulimits=null&version=1: open //./pipe/docker_engine: The system cannot find the file specified.
```

### 시도 1: docker 재 실행
docker 접속을 위해 local에서 docker Desktop 앱을 실행해서 연결 해줍니다.

**실패**

### 시도 2: 세팅 변경
docker Desktop에서 세팅 변경 해줍니다.

<img class="img-fluid" src="/img/posts/inPost/doker-error-01.png">

```Expose daemon on tcp://localhost:2375 without TLS```의 설정을 체크 해줍니다.

**실패**

### 시도 3: 다음 명령어 입력
```
cd C:\Program Files\Docker\Docker
DockerCli.exe -SwitchDaemon
```

cmd 창에서 위 명령어를 입력해 줍니다.

다음 링크에서 참조했습니다.

<a href="https://github.com/docker/for-win/issues/1825">https://github.com/docker/for-win/issues/1825</a>

Issue 내용을 보고 쭉 내려가다 보면 이 부분을 참조했습니다.

<img class="img-fluid" src="/img/posts/inPost/doker-error-02.png">

위 내용은 업데이트에 의해 설정이 엉망이 될 수 있다는 내용입니다. 

**성공**

### 끝
만약 위 방법으로 해결이 안 된다면 위 링크에서 다른 방법이 또 있으니 찾아 보시길 추천 드립니다! 

위 방법으로 해결되었으면 좋겠네요.

감사합니다.

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>