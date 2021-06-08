---
layout: post
title: "[Java] Spring Framework"
subtitle: "@Controller와 @RestController의 차이"
date: 2021-06-08 19:48:00 +0900
background: '/img/posts/jekyll-02.png'
category: Study
tags: [java, spring, interview]
---
이전에 To Do List 프로젝트에서 한 번 알아보고 넘어갔었는데 안 본지 좀 되기도 하고 면접에서 받은 질문 정리도 할 겸 찾아보았습니다.

### 어노테이션
@를 이용한 주석을 통해 특별한 의미를 부여하는 것입니다.

주석처럼 코드에 달아 클래스, 메소드, 변수 등에 특별한 의미와 기능을 주입합니다. 또 해석되는 시점을 정할 수도 있습니다.

어노테이션은 메타 데이터로서의 기능을 주로 목적으로 사용합니다. 프로그램 실행 관점에서 보면 프로그램이 처리할 메인 데이터가 아니라 실행 과정에서 **데이터를 어떻게 처리할 것인지에 대해 알려주는 서브 데이터**라고 볼 수 있습니다.

> * <a href="https://chaelin1211.github.io/study/2021/04/29/Spring-and-annotation.html">https://chaelin1211.github.io/study/2021/04/29/Spring-and-annotation.html</a>

### @Controller
컨트롤러 클래스에 적용되는 어노테이션으로 Spring Framework에 Controller임을 명시하는 어노테이션 입니다.

일반적으로 @RequstMapping을 통해 컨트롤러가 처리할 URI가 무엇인지 정의합니다.

### @RestController
RestController의 기본 동작 방식은 Controller 어노테이션과 ReponseBody 어노테이션으로 수행할 수 있습니다.

RestController와 Controller의 정의를 보면 다음과 같습니다.

```
@Target(value=TYPE)
@Retention(value=RUNTIME)
@Documented
@Component
public @interface Controller
```

> @Component: Component 어노테이션을 사용하면 Bean Configuration에 Bean을 따로 등록하지 않아도 사용할 수 있습니다.

```
@Target(value=TYPE)
@Retention(value=RUNTIME)
@Documented
@Controller
@ResponseBody
public @interface RestController
```

RestController는 **Controller와 ResponseBody** 어노테이션을 포함하고 있는 것을 볼 수 있습니다.

@ResponseBody: 서버에서 클라이언트로 응답할 때, View를 통해서 출력되는 것이 아니라 JSON 또는 XML 형식으로 Http Response Body에 직접 쓰여지게 됩니다. 

즉 RestController를 사용하면 Controller처럼 View에 표시될 모델을 구성하거나 View를 명시하는 것이 아닌 클라이언트에서 요청한 데이터를 응답하는 것입니다.

Controller와 ResponseBody의 동작을 조합한 RestController은 Spring framework에서 RESTful 웹 서비스를 쉽게 개발할 수 있도록 Spring 4.0에서 추가됐습니다.

### 예시
다음 두 코드 블록은 동일하게 작동합니다.

```
@Controller
@RequestMapping("books")
public class SimpleBookController {

    @GetMapping("/{id}", produces = "application/json")
    public @ResponseBody Book getBook(@PathVariable int id) {
        return findBookById(id);
    }

    private Book findBookById(int id) {
        // ...
    }
}
```

```
@RestController
@RequestMapping("books-rest")
public class SimpleBookRestController {
    
    @GetMapping("/{id}", produces = "application/json")
    public Book getBook(@PathVariable int id) {
        return findBookById(id);
    }

    private Book findBookById(int id) {
        // ...
    }
}
```

같은 동작을 하지만, 위는 Controller + ResponseBody를 사용했고 아래는 RestController만 사용한 예시입니다.

### 실행 흐름

#### Controller
<img class="img-fluid" src="/img/posts/inPost/controller-01.png">

#### Controller + ResponseBody
<img class="img-fluid" src="/img/posts/inPost/controller-02.png">

#### RestController
<img class="img-fluid" src="/img/posts/inPost/controller-03.png">

### 정리
* Controller: View에 표시될 데이터가 있는 Model을 생성하고, View를 선택
* RestController: 요청한 데이터를 Http Response Body에 담아 응답

*****

> 참고

> * <a href="https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/bind/annotation/RestController.html">https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/bind/annotation/RestController.html</a>
> * <a href="https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Controller.html">https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Controller.html</a>
> * 예시 출처: <a href="https://www.baeldung.com/spring-controller-vs-restcontroller">https://www.baeldung.com/spring-controller-vs-restcontroller</a>
> * 이미지 참조: <a href="https://www.genuitec.com/spring-frameworkrestcontroller-vs-controller/">https://www.genuitec.com/spring-frameworkrestcontroller-vs-controller/</a>

*****

감사합니다.

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>