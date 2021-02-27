---
layout: post
title: "[REST] TO-DO List 만들기(1)"
subtitle: "프로젝트 구성과 Spring Boot 설정"
date: 2021-02-18 22:33:00 +0900
background: '/img/posts/rest-02.jpg'
category: Study
tags: [rest, restful, miniproject, spring]
---
> 참고: <a src="https://imasoftwareengineer.tistory.com/34?category=772561">https://imasoftwareengineer.tistory.com/34?category=772561</a>

위 글을 참조해 TO-DO List를 작성해보았습니다!

목표: Spring Boot, HTML, CSS, javaScript, ~~mySQL~~mongoDB를 이용해 웹에서 사용 가능한 TO-DO List 작성

> mySQL은 다뤄본 적이 있기 때문에 mongoDB로 변경하였습니다.
*****

1. 프로젝트 구성
2. Spring Boot 설정

*****

### 1. 프로젝트 구성
<img class="img-fluid" src="/img/posts/inPost/rest-02-01.png">

어플리케이션 서버와 데이터베이스 서버는 같은 컴퓨터에 있을 수도, 다른 컴퓨터에 있을 수도 있습니다.

**서버 컴퓨터는 유저 컴퓨터가 아닙니다!**
- 유저는 자신의 브라우저를 이용해 Request를 서버 컴퓨터로 보냅니다.
- Request를 받은 어플리케이션 서버는 요청에 따라 DB 서버에 쿼리를 전달해 저장된 정보를 가져옵니다.
- 혹은 내부적으로 요청을 처리한 후 Response를 인터넷 브라우저에 보냅니다. 
- 인터넷 브라우저는 이 Response를 해석하고 알맞게 브라우저에 출력한다.

이렇게 유저의 브라우저 코드 + 어플리케이션 서버 + 데이터베이스 서버로 나누어져 있는 어플리케이션의 아키텍처를 3-tier 아키텍처라고 부릅니다.

### 2. Spring Boot 설정
1. Git 생성
2. Visual Studio Code에서 clone 
3. command palette > Spring initailizr: Create a Maven Project

    하단 톱니바퀴 버튼 혹은 ctrl+shift+P를 눌러 선택해주세요!   만약 Spring initializr가 없다면 Extension(ctrl+shift+x)을 눌러 다음 툴들을 추가해주세요.

    * Spring Boot Tools
    * Spring initializr Java Support
    * Spring Boot Extension Pack
    * Java Extension Pack

    dependency 체크도 해주세요! 아래의 것들이고 나중에 pom.xml 파일에서 추가 가능합니다.

    * Spring Boot DevTools
    * Lombok
    * Spring Web

4. 다음 디렉토리에 test용 controller를 만들어 테스트
<img class="img-fluid" src="/img/posts/inPost/rest-02-03.png">

```
package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class MainController {
    @RequestMapping("/")
    @ResponseBody
    public String index(){
        return "Hello, Spring";
    }

}
```
*****
**Annotation**
- @Controller: 해당 클래스가 Controller로 사용됨을 Spring framework에 알린다.
- @RequestMapping: 컨트롤러를 선택할 때 사용된다. 메서드 단위까지 세분화하여 적용할 수 있다.
- @ResponseBody: 자바 객체를 Http Request의 body 내용으로 매핑하는 역할이다.

*****

위의 내용을 수행하고 실행하여 localhost:8080에 들어가면 정상적인 수행의 경우 다음 화면을 확인할 수 있습니다.

<img class="img-fluid" src="/img/posts/inPost/rest-02-02.png">

여기까지 Spring Boot 설정 확인 했습니다.

감사합니다.
<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>