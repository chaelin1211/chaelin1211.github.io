---
layout: post
title: "[Design Pattern] Template method"
subtitle: "[디자인 패턴][행위 패턴] 템플릿 메소드 패턴"
date: 2021-05-22 05:34:00 +0900
background: '/img/posts/design-pattern.jpg'
category: Study
tags: [designpattern]
---
### Template method
어떤 작업을 처리하는 **일부분을 서브 클래스로 캡슐화**해 전체 일을 수행하는 구조는 바꾸지 않으면서 특정 단계에서 수행하는 내역을 바꾸는 패턴
* 전체적인 알고리즘은 상위 클래스에서 작성하고 세부적인 부분은 서브 클래스에서 작성하므로써 코드 재사용을 용이하게 합니다.

전체의 구조는 유사하고 일부가 다른 경우 코드의 중복을 최소화할 수 있도록 사용하는 패턴입니다.

* 알고리즘이 단계별로 나누어지거나, 같은 역할을 하는 메소드이지만 여러 곳에서 다른 형태로 사용되는 경우 유용합니다.

### 다이어그램
<img class="img-fluid" src="/img/posts/inPost/template-method-01.png">

* hook의 경우 abstract로 작성되거나 일부 default 구현을 가질 수 있습니다.
* hook의 경우 ConcreteClass에서 재정의될 수 있으나 템플릿 메소드 자체는 재정의할 수 없습니다.

다만 조건에 따랄 변동되는 루틴이 필요하면 다음처럼 작성할 수 있습니다.

```
hook1()
if(hook2) {
    hook3()
}
else {
    hook4()
}
```
템플릿 메서드는 재사용되는 전체 구조이고 hook은 변경될 수 있는 세부 부분입니다.

### 예시와 이해
라면을 끓이는 루틴을 가지고 예시를 작성했습니다.

* 끓이기 - 면 넣기 - 물 따라내기 - 스프 넣고 젓기 - 끝
* 끓이기 - 면 넣기 - 스프 넣고 젓기 - 끝

중간까지는 유사하나 물을 따라낸다는 차이점이 존재합니다.

<img class="img-fluid" src="/img/posts/inPost/template-method-02.png">

### MakeNoodle & Noodle1 & Noodle2 - Abstract Class, Concrete Class
<script src="https://gist.github.com/chaelin1211/5022d3fc8dbb261e051b81f2fa92e658.js"></script>

* 몇 몇 메소드가 같은 기능을 하지만 재정의 하는 것을 담고 싶어서 일부러 오버라이드 했습니다.
* 기본 틀을 가지고 있는 makeNoodleMethod는 기존의 상위 클래스의 것을 재사용하면서 알고리즘의 변화를 줄 수 있습니다.
* Noodle1엔 없는 noodleType은 default 값이 있는 메소드로 abstract 메소드가 아닙니다. drainWater도 마찬가지입니다.
* >이들은 필요한 경우 서브 클래스에서 재정의 해주어 변화를 줄 수 있습니다.

### Main
<script src="https://gist.github.com/chaelin1211/152363e558270982f9b718bc9c363980.js"></script>
MakeNoodle 객체를 만들어 서브 클래스로 다운캐스팅 합니다.

### 출력
```
국물 있는 라면------
물을 끓입니다.
면을 넣습니다.
스프를 넣고 잘 저어줍니다.
국물 없는 라면------
물을 끓입니다.
면을 넣습니다.
물을 따라버립니다.
스프를 넣고 잘 저어줍니다.

```

### 템플릿 메소드 장단점
#### 장점
* 코드의 중복을 줄일 수 있습니다.
* 서브 클래스의 역할을 줄이고, 핵심 로직을 상위 클래스에서 관리하므로서 관리가 용이해집니다.
* 객체지향적으로 코드를 구성할 수 있습니다.

#### 단점
* 추상 메소드가 많아지면서 클래스의 생성, 관리가 어려워질 수 있습니다. 
* 추상 클래스와 구현 클래스 간의 사이에 혼선이 생길 수 있습니다.
    * 추상 클래스에서 구현 클래스의 메소드를 호출하는 식을 유지해야 합니다.
* 핵심 로직에 변화가 생겨 상위 클래스를 수정할 때, 모든 서브 클래스의 수정이 필요한 경우가 있습니다.

*****
> 참조
* <a href="https://gmlwjd9405.github.io/2018/07/13/template-method-pattern.html">https://gmlwjd9405.github.io/2018/07/13/template-method-pattern.html</a>
* <a href="https://yaboong.github.io/design-pattern/2018/09/27/template-method-pattern/">https://yaboong.github.io/design-pattern/2018/09/27/template-method-pattern/</a>
* <a href="https://refactoring.guru/design-patterns/template-method">https://refactoring.guru/design-patterns/template-method</a>
* <a href="https://coding-factory.tistory.com/712">https://coding-factory.tistory.com/712</a>

감사합니다.

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>