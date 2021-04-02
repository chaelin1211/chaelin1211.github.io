---
layout: post
title: "[Project] TO-DO List"
subtitle: "To Do List 프로젝트에 대해 (목표, 스택, 구현)"
date: 2021-04-02 21:07:00 +0900
background: '/img/posts/rest-02.jpg'
category: Study
tags: [rest, restful, miniproject, spring, reactjs, nodejs, mongodb, docker]
---
## 개인 프로젝트
## To Do List 애플리케이션
### 목표
* ~~REST API~~ HTTP API 구현하기
* Spring Boot를 통해 Back end, React를 통해 Front end 구현하기

#### RESTful
처음 RESTful이란 것에 개념을 확실히 알지 못하고 위와 같은 목표를 잡았었는데, 아래 영상을 보고 나서야 제가 진짜 목표 했던 것은 REST API가 아님을 알게 되었습니다.

제가 목표로 한 것은 긴 시간에 걸쳐 유지/보수 할 프로그램이 아니고, HTTP method를 익히기 위한 개인적인 프로젝트 수행이었기 때문에 REST의 제약 조건을 맞추는 것에 대한 난이도를 떠나서 다른 목적을 향한다고 결론 내렸습니다.

결론적으로 제 프로젝트는 REST API의 Self-Descriptive와 HATEOAS를 만족하지 않기에 REST API라 할 수 없습니다.

> 많은 애플리케이션이 REST를 만족하지 않음에도 REST API라고 지칭한다네요. 저는 엄격한 기준으로 보아서 REST API가 아님을 알려드립니다.

**결론적으로 제 목표 자체는 HTTP API를 구현하는 것이었고 초기의 목표 설정에 실수가 있었습니다.**

### Stack
1.  Back end
* Framework: Spring Boot
* Database: Mongo DB
* Library: Lombok

2. Front end
* Server: Node.js
* Framework: React

### 구현
#### GET
* <a href="https://chaelin1211.github.io/study/2021/03/01/todo-project-03.html"> [Project] TO-DO List 만들기(2) - GET</a>
* <a href="https://chaelin1211.github.io/study/2021/03/15/todo-project-06.html"> [Project] TO-DO List 만들기(6) - React.js/Node.js 앱에서 API Call 하기</a>

#### POST
<img class="img-fluid" src="/img/posts/inPost/TodoList-POST.gif">

* <a href="https://chaelin1211.github.io/study/2021/03/01/todo-project-03.html"> [Project] TO-DO List 만들기(3) - POST</a>
* <a href="https://chaelin1211.github.io/study/2021/03/19/todo-project-08.html">
[Project][React] TO-DO List 만들기(8) - POST </a>

#### UPDATE
* <a href="https://chaelin1211.github.io/study/2021/03/18/todo-project-07.html"> [Project] TO-DO List 만들기(7) - UPDATE, DELETE </a>

<img class="img-fluid" src="/img/posts/inPost/TodoList-Update-01.gif">

* <a href="https://chaelin1211.github.io/study/2021/03/30/todo-project-11.html"> 
[Project][React] TO-DO List 만들기(11) - UPDATE(2) </a>

<img class="img-fluid" src="/img/posts/inPost/TodoList-Update-02.gif">

* <a href="https://chaelin1211.github.io/study/2021/03/29/todo-project-10.html"> 
[Project][React] TO-DO List 만들기(10) - UPDATE(1)</a>

#### DELETE
* <a href="https://chaelin1211.github.io/study/2021/03/18/todo-project-07.html"> [Project] TO-DO List 만들기(7) - UPDATE, DELETE </a>

<img class="img-fluid" src="/img/posts/inPost/TodoList-Delete.gif">

* <a href="https://chaelin1211.github.io/study/2021/03/27/todo-project-09.html"> 
[Project][React] TO-DO List 만들기(9) - DELETE </a>

### docker
이 프로젝트는 React와 Http API를 익히기 위한 프로젝트였기 때문에 배포 계획 없는 로컬 프로젝트였지만 도커에 대해 알게 되고, 적용해 보는 좋은 기회였습니다.

추가적으로 Mongo DB를 로컬에 저장하지 않는다는 이점도 얻을 수 있었습니다.

* <a href="https://chaelin1211.github.io/study/2021/03/12/todo-project-05.html"> [Project] TO-DO List 만들기(5) - 도커 활용: 도커에 스프링 부트 올리기</a>
* <a href="https://chaelin1211.github.io/study/2021/04/02/todo-project-12.html">[Project] TO-DO List 만들기(12) - Docker에 올리기 - 도커에 Spring boot + Mongo DB 올리기</a>

### 전체 포스트
* <a href="https://chaelin1211.github.io/study/2021/02/18/todo-project-01.html">프로젝트 구성과 Spring Boot 설정</a>
* <a href="https://chaelin1211.github.io/study/2021/02/19/todo-project-02.html">서버 어플리케이션 디자인 - GET 구현을 위한 클래스 생성</a>
* <a href="https://chaelin1211.github.io/study/2021/03/01/todo-project-03.html">서버 어플리케이션 디자인 - POST 구현을 위한 클래스 생성 & Spring과 mongoDB</a>
* <a href="https://chaelin1211.github.io/study/2021/03/04/todo-project-04.html">[설정]React.JS와 Node.JS를 이용해 프론트엔드 개발</a>
* <a href="https://chaelin1211.github.io/study/2021/03/12/todo-project-05.html">도커 활용: 도커에 스프링 부트 올리기</a>
* <a href="https://chaelin1211.github.io/study/2021/03/15/todo-project-06.html">React.js/Node.js 앱에서 API Call 하기</a>
* <a href="https://chaelin1211.github.io/study/2021/03/18/todo-project-07.html">서버 어플리케이션 디자인 - 기능 추가하기 (UPDATE, DELETE)</a>
* <a href="https://chaelin1211.github.io/study/2021/03/19/todo-project-08.html">React로 기능 추가하기 - POST</a>
* <a href="https://chaelin1211.github.io/study/2021/03/27/todo-project-09.html">React로 기능 추가하기 - DELETE / input field 체크 & 리셋</a>
* <a href="https://chaelin1211.github.io/study/2021/03/29/todo-project-10.html">React로 기능 추가하기 - UDPATE</a>
* <a href="https://chaelin1211.github.io/study/2021/03/30/todo-project-11.html">React로 기능 추가하기 - UDPATE(2)</a>
* <a href="https://chaelin1211.github.io/study/2021/04/02/todo-project-12.html">도커에 Spring boot + Mongo DB 올리기</a>

### 끝
Spring Boot를 체계적으로 디자인 해 작성하는 경험을 통해 기존에 사용해 본 경험이 있지만 새로운 툴을 쓰는 듯한 느낌을 많이 받았습니다.

엄첨 큰 규모의 프로젝트는 아니었지만 혼자서 BE, FE를 다 구현한 경험이 많지 않은 저에게 큰 배움을 주었던 프로젝트였고, 그 사이 많은 오류와 무지 사이에서 고민한 시간도 길었습니다. 그 시간이 헛되지 않았음을 이 글을 정리하며 많이 느꼈습니다.

프로젝트를 진행하며 틈틈이 모르는 부분에 대한 공부를 병행했습니다. 최대한 깊게 공부하려는 생각이 있었지만 쉽지는 않았습니다. 부족한 부분을 느끼셨다면 꼭 댓글 달아주세요!

다음 프로젝트에선 이 프로젝트 이상의 무언가를 얻을 수 있을 거란 확신을 가지며 추가적으로 배포까지 할 수 있길 바라며 이번 프로젝트는 마무리 합니다.

감사합니다.

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>