---
layout: post
title: "[Thymeleaf] ajax를 이용해 비동기식 화면 수정"
# subtitle: "[디자인 패턴][구조 패턴] 컴퍼지트"
date: 2021-04-15 06:20:00 +0900
background: '/img/posts/design-pattern.jpg'
category: Study
tags: [Thymeleaf, ajax, spring]
---
### Ajax로 비동기 화면 수정
스프링 부트 프로젝트가 전체 동기식이라 부분 부분 비동기식으로 고치는 중이었습니다.

우선 댓글 작성의 경우입니다. 댓글 작성할 때마다 화면을 reload하면 불편하고 수행 능력이 떨어지기 때문에 이 부분을 수정하고자 했습니다.

### Ajax란?
Asynchronos Javascript And XML의 약자로 비동기식으로 서버와 통신하는 방식을 의미합니다.

### 환경
* Spring Boot
* Thymeleaf
* ajax

### Spring Boot에서 Ajax로 통신하기 (Thymeleaf)
#### view
<script src="https://gist.github.com/chaelin1211/01443383d1fe5d9343ff327b33e75279.js"></script>
서버에서 댓글 리스트를 받아와서 th:each로 각각을 출력하는 코드입니다.

* 저는 commentTable의 내부에서 이용되는 값들을 ajax로 가져올겁니다.
    * commentList
    * userInform
    * 이 부분은 controller에서 넣어줄 겁니다.

#### ajax
<script src="https://gist.github.com/chaelin1211/b0fadc4567c61f7c589ee6ab50f212f3.js"></script>
각각의 value를 가져오는 방법은 더 다양하지만 일단은 id로 value를 가져오는 방법으로 했습니다.

* $.ajax로 url과 data, type을 지정합니다. 
    * 여기서 url, type은 연결을 원하는 controller과 동일해야 합니다.
* .done에서 값을 받아와 replaceWith로 값을 바꿔줄겁니다. 비동기식으로 변환되는 부분입니다.
    * 변환되는 값을 출력할 부분의 id를 가져옵니다.
    * 저의 경우, 위의 view에서 확인할 수 있듯이 commentTable입니다.

#### Controller
<script src="https://gist.github.com/chaelin1211/e1217dacbcbc39ded095dd365bbd16d9.js"></script>

> CSS와 기타 멤버 필드는 생략하고 가져왔습니다.

* RequestMapping: 위에 ajax에서 입력했던 url, type과 같아야 합니다.
* Model: View로 전달할 데이터를 저장합니다.
    * 위에서 보이듯이 addAttribute로 저장합니다.
    * view에서 사용할 commentList와 userInform을 저장해줍니다.
* RequestParam: HTTP 요청 파라미터를 메소드 파라미터에 넣어주는 어노테이션
    * $.ajax에서 작성해서 보낸 data를 받습니다.
* 추가적으로 ResponseBody 어노테이션은 쓰지 않습니다!
    * 저는 썼다가 return 값의 String이 고대로 출력되는 일을 겪었습니다.

##### @RequestMapping
* DefaultAnnotationHandlerMapping에서 **Controller를 선택할 때 사용**되는 어노테이션입니다.
* 어떤 Controller, 어떤 메소드가 요청을 처리할 지 매핑을 위한 어노테이션 입니다.
* url당 하나의 Controller에 매핑되던 다른 핸들러 매핑과 달리 메서드 단위까지 세분화하여 적용할 수 있으며, url 뿐 아니라 파라미터, 헤더 등 더욱 넓은 범위를 적용할 수 있습니다.

##### @RequsetBody
서버에서 클라이언트로 응답 데이터를 전송하기 위해서 @ResponseBody 를 사용하여 자바 객체를 HTTP 응답 본문의 객체로 변환하여 클라이언트로 전송시키는 역할을 합니다.

### 작동
이제 view에서 버튼을 만들어 onclick으로 ajax 메소드를 호출합니다.

그럼 다음처럼 commentList가 비동기식으로 갱신됩니다.

<img class="img-fluid" src="/img/posts/inPost/ajax-01.gif">

*****

> 참조
* Model: <a href="https://memories95.tistory.com/109">https://memories95.tistory.com/109</a>
* RequestMapping, RequestParam: <a href="https://sarc.io/index.php/development/1139-requestmapping">https://sarc.io/index.php/development/1139-requestmapping</a>
* ResponseBody: <a href="https://webdevtechblog.com/reqeustbody%EC%99%80-responsebody-%EC%96%B8%EC%A0%9C-%EC%82%AC%EC%9A%A9%ED%95%A0%EA%B9%8C-2efcab364edb">https://webdevtechblog.com/reqeustbody</a>

감사합니다.

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>