---
layout: post
title: "[Design Pattern] Chain of Resposibility"
subtitle: "[디자인 패턴][행위 패턴] 책임 연쇄"
date: 2021-04-26 19:47:00 +0900
background: '/img/posts/design-pattern.jpg'
category: Study
tags: [designpattern]
---
### 책임 연쇄 - Chain of Resposibility
클라이언트로부터의 요청을 처리할 수 있는 **처리 객체**를 집합으로 만들어 부여함으로써 결합도를 없애기 위한 패턴

* 요청을 처리할 수 있는 객체를 찾을 때까지 집합 안에서 요청을 전달합니다.
* 요청 보내는 객체와 처리하는 객체 간 결합도를 느슨하게 합니다.

### 책임 연쇄 패턴이 적용되는 경우
* 요청의 발신자와 수신자가 분리되는 경우
* 요청을 처리할 수 있는 객체가 여러 개일 때 그 중 하나에 요청을 보내려는 경우
* 코드에서 처리 객체를 명시적으로 지정하고 싶지 않은 경우 - 런타임에서 처리 객체를 지정해야 하는 경우

### 다이어그램
<img class="img-fluid" src="/img/posts/inPost/chainOfResponsibility-01.png">

* Handler: 요청을 수신해 처리 객체들의 집합에 전달하는 인터페이스입니다. 집합의 첫 번째 핸들러에 대한 정보만 가지고 있으면 그 이후의 핸들러에 대해서는 알 수 없고, 알 필요도 없습니다.
* Concrete Handlers: 요청을 처리하는 실제 처리 객체입니다.
* Client: 요청을 전달하는 클라이언트입니다.

### 예제와 이해
책임연쇄 패턴의 대표적인 예시는 Java의 try-catch 문 입니다.

```
try{
    ~~~
}catch(NumberFormatException e) {
    ~~~
}catch(ArrayIndexOutOfBoundsException e) {
    ~~~
}catch(ArithmeticException e) { 
    ~~~
}
```

요청을 처리할 수 있는 catch 블록을 만날 때까지 다음 catch 블록으로 넘깁니다.

이와 비슷한 느낌의 예제를 작성했습니다.

#### Request - Error
<script src="https://gist.github.com/chaelin1211/6d03a088618275e0d5b764b430df3820.js"></script>

Error 자체를 다 클래스로 만들기엔 예제 특성에 안 맞을 거 같아 Error 클래스 하나로 통일 했습니다.

#### Handler - ErrorHandler
<script src="https://gist.github.com/chaelin1211/13feb98ecee0006e858e04b145db7208.js"></script>

Next Handler를 설정해 객체 내에 저장하므로써 요청을 다음 Handler로 전달할 수 있습니다.

#### Concrete Handler
<script src="https://gist.github.com/chaelin1211/a6413d16f79bfebf8729db6f6c637511.js"></script>

받은 Request(Error)를 확인하고 해당 Request에 맞는 Handler라면 특정 수행을 하고, 아니면 Next Handler에 Request를 전달합니다.

setNextHandler에서 ```return this;```를 하는 이유는 다음 Client에서 확인할 수 있습니다.

#### Client - Main
<script src="https://gist.github.com/chaelin1211/d6cf46587bf13c0a86a07f7c9f511aa1.js"></script>

setNextHandler에서 ```return this;```으로 객체 자신을 반환하기 때문에 위처럼 객체를 따로 main에서 작성하지 않고 체인을 줄줄이 작성할 수 있습니다.

#### 출력
```
Error: NullPointerException
Error: ArithmeticException
Error: InterruptedException
```

위처럼 알맞은 handler에 맞춰 출력됩니다. 

디버깅 해보면 체인을 타고 Request를 넘기는 모습을 볼 수 있습니다.

### 장점
* **결합도**를 낮추며, 요청의 발산자와 수신자를 분리시킬 수 있습니다.
* 클라이언트는 처리 객체의 집합 내부의 구조를 알 필요가 없습니다.
* 집합 내의 **처리 순서를 변경**하거나 **처리 객체를 추가 또는 삭제**할 수 있어 **유연성**이 향상됩니다. 
* 새로운 요청에 대한 처리 객체 생성이 매우 편리합니다.

### 단점
* 충분한 디버깅을 거치지 않았을 경우 집합 내부에서 **사이클**이 발생할 수 있습니다.
* 디버깅 및 테스트가 쉽지 않습니다.

*****

> 참조
* <a href="https://always-intern.tistory.com/1">https://always-intern.tistory.com/1</a>

감사합니다.

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>