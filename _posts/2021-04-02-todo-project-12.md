---
layout: post
title: "[REST] TO-DO List 만들기(12) - Docker에 올리기"
subtitle: "도커에 Spring boot + Mongo DB 올리기"
date: 2021-04-02 18:49:00 +0900
background: '/img/posts/rest-02.jpg'
category: Study
tags: [miniproject, spring, docker, mongodb]
---
> 참고: <a href="https://imasoftwareengineer.tistory.com/51?category=772561">https://imasoftwareengineer.tistory.com/51?category=772561</a>

오늘은 저번까지 했던 프로젝트를 이용해 Spring boot와 Mongo DB를 도커에 올리는 것을 실습해 보겠습니다.

* docker-compose.yml을 이용해 Spring boot와 Mongo DB를 도커에 올립니다.
* 기존 플젝에서 사용하던 임베디드 Mongo DB에서 벗어나 Docker에 Mongo DB를 올리고 Spring boot에서 이 Mongo DB를 이용하도록 설정합니다.

### docker-compose.yml
##### docker의 compose
웹 애플리케이션 제작엔 데이터베이스, Back-end API, Front-end API 같은 여러 컴포넌트가 필요합니다. 

이런 웹 애플리케이션을 전부 deploy하기 위해서는 각각 컴포넌트를 환경설정하고 코드를 deploy해야 합니다.

이를 위해 **Spring boot의 root**에 docker-compose.yml파일을 생성합니다.

##### docker-compose.yml
* 각 컴포넌트의 Configuration과 dependency 등을 yml 형식의 하나의 파일에 정의해 작성된 대로 docker에 올려주는 tool
* 즉 각각의 컴포넌트를 deploy 해주는 툴입니다.
* deploy: 만들어진 프로그램을 서비스 위치로 보내는 작업

즉 docker-compose.yml에 작성된대로(stack이라 함) docker compose를 이용해 한 번에 docker에 올릴 수 있습니다.

##### docker-compose.yml
```
version: "3"
services:
  mongodb:
    image: mongo:3.4
    environment: 
      - MONGO_DATA_DIR=/data/db
      - MONGO_LOG_DIR=/dev/null
    volumes:
      - ./data/db:/data/db
    container_name: "mongodb"
    hostname: "mongodb"
    ports:
      - 27017:27017
    command: mongod --smallfiles --logpath=/dev/null # --quiet
  app:
    image: restful_springboot       // 본인이 작성한 image 이름
    ports:
      - 5000:5000
    links:
      - mongodb
```

mongodb 3.2.4 버전이 오류로 연결이 계속 끊겨서 3.4 버전을 pull해서 바꿨더니 연결이 잘 되더라구요!

전체적인 구조는 services 아래에 필요한 컨테이너에 대한 내용을 추가합니다.  컨테이너가 사용할 image, 로그 저장 경로, DB 경로, 컨테이너 이름, 포트, 실행할 커맨드 등을 정의합니다.

* app: Spring boot app
    - link: mongodb
    - 위 명시를 통해 도커 컨테이너가 app 컨테이너의 요청을 mongodb 컨테이너에서 응답할 수 있다는 것을 알게 합니다.


### SpringBoot - pom.xml
이전에 임베디드 mongoDB 설정 해놓은 부분을 주석 처리 해줍니다.
```
<dependency> 
	<groupId>org.springframework.boot</groupId> 
	<artifactId>spring-boot-starter-data-mongodb</artifactId> 
</dependency>
<!-- <dependency>
	<groupId>de.flapdoodle.embed</groupId>
	<artifactId>de.flapdoodle.embed.mongo</artifactId>
</dependency> -->
```
위처럼 아래의 embeded mongo에만 주석 처리 해주세요.

### application.properties
application.properties에서 Spring Boot가 사용할 mongo DB의 경로를 지정해 줍니다.

```
server.port = 5000
spring.data.mongodb.uri= mongodb://mongodb:27017/TodoRepository
```

보통 로컬 mongo DB에 연결할 때 mongodb://localhose:27017/~~ 이런 식으로 연결하는데, 도커에선 이렇게 할 수 없습니다.

도커 컨테이너는 **컨테이너 차제가 분리된 하나의 환경**으로 인식되기 때문에 도커 컨테이너의 localhost와 Spring Boot의 localhost는 서로 다른 localhost입니다.

따라서 localhost를 사용하는 부분은 **컨테이너 이름**으로 대체해 주어야 도커가 이를 해석해 mongo DB가 있는 도커로 연결해 줄 수 있습니다.

### maven clean
application.properties를 수정했기 때문에 재빌드를 위해 clean을 해줍니다.

<img class="img-fluid" src="/img/posts/inPost/rest-13-01.gif">

**Terminal의 경로를 .mvn이 있는 곳으로 이동 후 클릭하는 것 잊지 마세요!**

<img class="img-fluid" src="/img/posts/inPost/rest-13-02.png">

빌드가 잘 되었습니다.

### docker image build
도커 이미지를 빌드해줍니다.

```
docker build -t restful_springboot .
```

다음 같은 오류가 발생하면 아까 maven clean을 했던 창에서 package를 선택해 jar 파일을 생성해주세요.

<img class="img-fluid" src="/img/posts/inPost/rest-13-03.png">

<img class="img-fluid" src="/img/posts/inPost/rest-13-04.png">

성공적으로 이미지가 생성되었다면 다음처럼 출력 됩니다.

<img class="img-fluid" src="/img/posts/inPost/rest-13-05.png">

다음 명령어로 생성된 이미지들을 확인할 수 있습니다.

```
> docker images
REPOSITORY           TAG       IMAGE ID       CREATED          SIZE
restful_springboot   latest    4f491a24eb36   9 seconds ago    669MB
...
```

### docker-compose
docker compose 전에 이미 5000 포트가 사용되는 중이면 안 되기 때문에 종료 해주어야 합니다.

```
docker ps
``` 
현재 실행 중인 컨테이너가 출력 됩니다.

현재 Spring boot 컨테이너가 실행 중이라면 ID를 복사해 종료해줍니다.

```
docker stop <컨테이너 ID>
```

docker compose를 이용해 mongo DB와 Spring boot를 도커에 올립니다.

```
docker-compose up
```

<img class="img-fluid" src="/img/posts/inPost/rest-13-06.png">

위처럼 주루룩 출력되고 마지막에 오류 없이 잘 된다면 성공입니다.

```docker ps```로 잘 실행되고 있는지 확인합니다. 

spring boot 이미지와 mongo 이미지가 실행되고 있는 것을 확인할 수 있습니다.

```
CONTAINER ID   IMAGE                COMMAND                  CREATED
12aef2fc4525   restful_springboot   "java -Djava.securit…"   6 minutes ago
5fadb062d505   mongo:3.4            "docker-entrypoint.s…"   47 minutes ago
```

두 개가 잘 실행되고 있습니다.

### npm start 
react 쪽으로 넘어가 ```npm start```로 서버를 실행합니다.

<img class="img-fluid" src="/img/posts/inPost/rest-13-07.png">

구현한 부분이 잘 실행 됩니다.

### docker 컨테이너 종료 후
docker-compose 실행한 terminal에서 ctrl+C로 종료할 수 있습니다.

그 후 다시 docker-compose를 하면 이전에 만들었던 todo item들이 삭제되지 않고 출력됩니다.

이전엔 임베디드 mongoDB를 이용했기 때문에 서버 종료 후엔 item들이 다 삭제 되었습니다.

### 끝
도커를 이용하므로써 환경 설정 없이 쉽게 환경 구축이 가능합니다.

배포할 때, 서버에 따로 이 프로젝트를 위해 설치했던 패키지를 설치할 필요 없이 도커를 통해 이미지를 내려 받아 이용할 수 있습니다.

이처럼 도커를 이용하면 여러 패키지 설치를 생략할 수 있습니다. 즉, 도커의 장점은 이러한 Operational Overhead를 줄일 수 있다는 것입니다.

이 프로젝트는 React와 Http API를 익히기 위한 프로젝트였기 때문에 배포 계획 없는 로컬 프로젝트였지만 도커에 대해 알게 되고, 적용해 보는 좋은 기회였습니다.

<a href="https://imasoftwareengineer.tistory.com">삐멜 소프트웨어 엔지니어 블로그</a>의 프로젝트를 매우 참조했으며(React를 제외한 부분들), 그 덕에 많이 배웠습니다.

보시는 분들도 한 번 둘러보세요!

감사합니다.

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>