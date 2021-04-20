---
layout: post
title: "[Design Pattern] Decorator"
subtitle: "[디자인 패턴][구조 패턴] 데커레이터"
date: 2021-04-20 11:47:00 +0900
background: '/img/posts/design-pattern.jpg'
category: Study
tags: [designpattern]
---
### Decorator
주어진 상황 및 용도에 따라 어떤 객체에 책임을 덧붙이는 패턴
* 기능 확장이 필요할 때 서브클래싱 대신 쓸 수 있는 유연한 대안

객체의 결합을 통해 기능을 동적으로 유연하게 확장할 수 있게 해주는 패턴
* 추가할 기능을 Decorator 클래스로 정의한 후 필요한 객체를 조합함으로써 추가 기능의 조합을 설계하는 방식입니다.

데코레이터 패턴을 이용해 필요한 추가 기능의 조합을 동적으로 생성할 수 있습니다.

### 다이어그램
<img class="img-fluid" src="/img/posts/inPost/decorator-01.png">

* Component: CocreteComponent와 Decorator의 공통 기능을 정의
    * Client가 사용하는 실제 객체
* ConcreteComponent: 기본 기능을 구현하는 클래스
* Decorator: 추가 기능인 ConcreteDecorator의 공통 기능을 제공
* ConcreteDecorator: 구체적인 추가 기능의 클래스

Component와 Deocrator의 조합(Composition)을 통해 ConcreteComponent, ConcreteDecorator 사이의 참조 관계가 이루어집니다.

### 데코레이터 예시와 이해
전자제품과 기타 기기를 가지고 예시를 만들었습니다.

<img class="img-fluid" src="/img/posts/inPost/decorator-03.png">

* Component: 전자제품
* ConcreteComponent: 컴퓨터
* Decorator: 기타 기기
* ConcreteDecorator: 블루투스 키보드, 마우스, 추가 모니터, 등등

만약 Decorator 패턴을 적용하지 않는다면 Component 밑에 ConcreteComponent로 다 구현해서 다양한 경우의 수가 생길 수 있습니다.

키보드만 쓰는 경우, 키보드-마우스를 쓰는 경우, 키보드-추가 모니터를 쓰는 경우 등등 다양한 경우가 있고 다양한 서브클래스가 발생합니다.

서브클래스가 잦으면 관리가 어렵고, 작성 시 오류가 발생할 확률이 많아집니다.

조합을 이용한 Decorator를 이용할 경우, ConcreteComponent에서 필요한 Decorator를 뽑아쓰는 것으로 대체하여 쉽게 생성, 관리가 가능해집니다.

#### Component, ConcreteComponent
<script src="https://gist.github.com/chaelin1211/249bbb5219e400c0f13d5a589c2371db.js"></script>

#### Decorator
<script src="https://gist.github.com/chaelin1211/9325927513026f3a05c612583b9af4cf.js"></script>

#### ConcreteDecorator - Monitor, Keyboard
<script src="https://gist.github.com/chaelin1211/8a09b979052b84375895318ca099fb22.js"></script>

#### Main
<script src="https://gist.github.com/chaelin1211/2c98a5df3be31f346fcecbc7efe2f7a0.js"></script>

#### 출력
```
기본 ConcreteComponent
Computer: LG Laptop
Decorated ConcreteComponent - Computer with Keyboard
Computer: SAMSUNG tablet
Keyboard
Decorated ConcreteComponent - Computer with Keyboard, Monitor
Computer: Macbook
Keyboard
Monitor
```

위 출력된 부분을 확인하면 
```
Product MonitorKeyboardComputer =
				new Monitor(
				new Keyboard(
				new Computer("Macbook")));
```

이 경우 다음처럼 가장 안쪽부터 출력됩니다.

```
Computer: Macbook
Keyboard
Monitor
```

이는 Decorator의 operation에서 ```super.operation()```을 한 후, ```addOperation()```을 하기 때문입니다.

*****

> 참고
* <a href="https://gmlwjd9405.github.io/2018/07/09/decorator-pattern.html">https://gmlwjd9405.github.io/2018/07/09/decorator-pattern.html</a>

감사합니다.

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>