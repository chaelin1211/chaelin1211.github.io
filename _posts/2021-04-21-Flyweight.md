---
layout: post
title: "[Design Pattern] Flyweight"
subtitle: "[디자인 패턴][구조 패턴] 플라이웨이트"
date: 2021-04-21 21:43:00 +0900
background: '/img/posts/design-pattern.jpg'
category: Study
tags: [designpattern]
---
### Flyweight
동일하거나 유사한 객체들 사이에 가능한 많은 데이터를 서로 **공유**하여 사용하도록 하여 **메모리 사용량을 최소화** 하는 패턴
> 모바일 기기나 임베디드 시스템 등 저용량 메모리를 지원하는 기기에서 메모리를 관리하는 것이 아주 중요합니다.

다음의 경우, 플라이웨이트를 적용하기에 적합합니다.
* 어플리케이션에 의해 생성되는 객체의 수가 많다.
* 생성된 객체가 오래도록 메모리에 상주하며, 사용되는 횟수가 많다.
* 객체의 특성을 내적(Intrinsic)/외적(Extrinsic)으로 나눴을 때, 객체의 외적 특성이 클라이언트 프로그램으로부터 정의되어야 한다.
    * 클라이언트로부터 속성을 입력 받아 생성    
        ex) Circle의 size와 color는 입력 받아 생성하기로 한다.

### 다이어그램
<img class="img-fluid" src="/img/posts/inPost/flyweight-01.png">

* FlyweightFactory: Flyweight 객체의 생성을 제어하고 공유해주는 역할
* Flyweight(Interface): 클라이언트로부터 외적 특성을 받아 생성할 객체의 공통 요소
* ConcreteFlywieght: 클라이언트로부터 외적 특성을 받아 생성할 객체의 구체적인 클래스


### 싱글톤 패턴과의 차이
싱글톤 패턴은 **클래스 자체**가 오직 1개의 인스턴스만을 가지도록 제한하지만, 플라이웨이트 패턴은 **팩토리**가 제어하는 것입니다.

즉, 인스턴스 생성을 누가 제어하느냐의 차이입니다.

### 예제와 이해
여러 도형을 생성하는 예제를 플라이웨이트 패턴으로 작성해보았습니다.

> 다음 블로그의 예시를 참조했습니다.
* <a href="https://readystory.tistory.com/137">https://readystory.tistory.com/137</a>

<img class="img-fluid" src="/img/posts/inPost/flyweight-02.png">

* Main(Client)에서 임의의 좌표, 색, 도형의 모양을 선택합니다.
    * 클라이언트에서 외적 특성 정의
* Factory의 getShape 메소드를 이용해 기존에 생성된 객체(Oval/Line)가 있다면 그 객체를, 기존에 생성한 적이 없다면 새로운 도형 객체를 가져옵니다.
* 가져온 도형 객체를 이용해 draw합니다.

#### Shape interface
<script src="https://gist.github.com/chaelin1211/0759319b215120215089200574a1d57e.js"></script>

#### Concrete Shape - Oval, Line
<script src="https://gist.github.com/chaelin1211/c61f2224310ce9e993ebce126560c004.js"></script>

생성자에서 객체 생성시, 즉 new 키워드를 통해 생성시 **출력**을 통해 확인할 수 있습니다.

#### ShapeFactory
<script src="https://gist.github.com/chaelin1211/8cc2d6c38735262599052f68a1680796.js"></script>

Factory 내의 static Hashmap을 통해 이전에 생성된 객체들을 관리할 수 있도록 하였습니다.

도형의 타입 별로 하나의 객체를 생성하도록 제한합니다.

#### Client - Main
<script src="https://gist.github.com/chaelin1211/6cde3d973ab32dc4c810da8254593fba.js"></script>

JFrame으로 화면에 창을 생성하고, 버튼을 부착합니다.

버튼에 EventListoner를 부착해 버튼이 클릭되면, Random으로 좌표, 크기, 도형 모양, 색상 값을 생성해 20개의 도형을 화면에 draw 합니다.

* 클라이언트에서 외적 특성을 결정하는 부분입니다.
* Random으로 입력받기 위해 Math.random()을 이용합니다.

#### 실행
실행하면 다음처럼 창이 뜹니다. 
<img class="img-fluid" src="/img/posts/inPost/flyweight-03.png">

버튼을 클릭할 때마다 20개의 도형이 그려집니다.
<img class="img-fluid" src="/img/posts/inPost/flyweight-04.png">

그려진 도형은 20개이지만 출력된 내용은 다음처럼 도형당 한 번씩 입니다.

```
Create Oval Object(Fill Option: true)
Create Oval Object(Fill Option: false)
Create Line Object
```

즉 도형당 한 번씩 객체를 생성하고 이후에는 공유해서 사용하는 것을 알 수 있습니다.

이 상태에서 버튼을 다시 누른다해도 출력은 발생하지 않고 이전에 생성된 객체를 공유합니다.

<img class="img-fluid" src="/img/posts/inPost/flyweight-05.png">

### 활용 예시
1. Java 래퍼 클래스의 valueOf()
    래퍼 클래스의 valueOf()는 플라이웨이트 패턴을 이용하고 있습니다. 따라서 new를 이용해 객체를 매번 생성하는 것 보다, valueOf를 통해 생성하는 것이 더 효율적입니다.

    ```
    Object ob1 = String.valueOf("abc");
    Object ob2 = new String("abc");
    ```
2. 자바의 String Pool
    Java에서는 String pool을 별도로 두어 같은 문자열이 다시 사용될 때에 새로운 메모리를 할당하는 것이 아니라 String pool에 있는지 검사해 있으면 가져오고 없으면 새로 메모리를 할당하여 String pool에 등록한 후 사용하도록 하고 있습니다.

*****

> 참조
* <a href="https://readystory.tistory.com/137">https://readystory.tistory.com/137</a>
* <a href="https://effectiveprogramming.tistory.com/entry/Flyweight-%ED%8C%A8%ED%84%B4">https://effectiveprogramming.tistory.com/entry/Flyweight-%ED%8C%A8%ED%84%B4</a>
* <a href="https://kimchanjung.github.io/design-pattern/2020/05/22/flyweight-pattern/">https://kimchanjung.github.io/design-pattern/2020/05/22/flyweight-pattern/</a>

감사합니다.

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>