---
layout: post
title: "[Design Pattern] Prototype"
subtitle: "[디자인 패턴][생성 패턴] 프로토타입"
date: 2021-4-5 23:56:00 +0900
background: '/img/posts/design-pattern.jpg'
category: Study
tags: [designpattern]
---
### 프로토타입
원형이 되는 인스턴스로 새로운 인스턴스를 만드는 방식으로, 객체에 의해 생성될 객체의 타입이 결정되는 생성 디자인 패턴
* Original 객체를 새로운 객체에 **복사**하여 필요에 따라 수정하는 메커니즘을 제공합니다.
* Java의 clone()을 이용합니다. (Override 필요) 

프로토타입 패턴은 주로 다음과 같은 경우 사용됩니다.
* 프로토타입 패턴은 일반적인 방법, 즉 new 키워드를 사용해 객체를 생성하면 비용(시간과 자원)이 많이 드는 경우
* 비슷한 객체가 이미 있는 경우

### 프로토타입 이해 및 예제
DB로부터 가져온 데이터를 여러 차례 수정해야 하는 코드가 있을 때, 매번 new 키워드를 통해 객체를 생성하여 DB 데이터를 가져오는 것은 비효율적입니다. 

DB로 접근해서 데이터를 가져오는 행위는 비용이 크기 때문입니다.

따라서 한 번 DB에 접근하여 데이터를 가져온 객체를 필요에 따라 새로운 객체에 복사하여 데이터 수정 작업을 하는 것이 더 좋은 방법입니다.

> 깊은 복사로 할 지, 얕은 복사로 할 지에 대해선 선택적으로 수행하면 됩니다.

### 다이어그램
<img class="img-fluid" src="/img/posts/inPost/prototype-01.png">

* Client에서 clone을 호출하면 해당 원형의 복제된 객체가 생성됩니다.
* Prototype은 복제에 필요한 인터페이스를 정의합니다.
* ConcretePrototype은 복제하는 구체적인 연산을 구현합니다.

*****

### Java로 보는 예시 - ArrayList
클래스를 직접 만들기 전에 자주 사용되는 ArrayList로 한 번 살펴볼게요. 

ArrayList class 정의 부분을 보면 Cloneable을 구현하고 있습니다. 그래서 ArrayList를 쓸 때 따로 clone을 정의하지 않아도 clone을 통해 복제할 수 있습니다.

<script src="https://gist.github.com/chaelin1211/b3a9bd984b1c8d22d34c97c5c3fe2fe9.js"></script>

위의 주석 부분을 읽어보면 Shallow copy를 return한다고 나와있습니다.
* Shallow copy = 얕은 복사
* Deep copy = 깊은 복사

즉, 원본 ArrayList 내의 객체와 같은 객체들을 참조한다는 것입니다.

확인해 보았습니다.

<script src="https://gist.github.com/chaelin1211/c8abb1b8870df143946a47583dc796b5.js"></script>

원본 ArrayList와 clone된 ArrayList 내의 객체의 hashCode를 출력했더니 다음과 같이 출력되었습니다.

```
Origin-----------
1421795058
1555009629
41359092
Copy-----------
1421795058
1555009629
41359092
```

ArrayList는 얕은 복사를 수행하니 같은 원본, 복사 두 ArrayList는 같은 객체들을 참조함을 확인할 수 있습니다.

### Java로 보는 예시 - 직접 작성
그럼 직접 작성해보는 예시로는 깊은 복사를 수행해 봅시다.

우선 위에서 언급한 Cloneable을 구현해야 합니다.

<script src="https://gist.github.com/chaelin1211/81792ba80bc25cb2bc80ab2845ef3288.js"></script>

보시면 override로 clone을 구현했습니다. 객체 내부의 리스트를 깊은 복사로 복사합니다.

main을 봅시다. 원본 객체를 복사한 객체를 두 개 생성하고 수정해주었습니다.

<script src="https://gist.github.com/chaelin1211/fd092fc72649a8975a6dc0894d458f7d.js"></script>

출력은 다음과 같습니다.
```
origin
James
Potter
Lin

NewTeam-1
Potter
Lin

NewTeam-2
James
Potter
Lin
```

만약 이 리스트가 DB에서 받아오는 것이라면, clone이 없이는 여러번 DB를 조회해야 합니다.

객체를 복사하는 것이 네트워크 접근이나 DB의 접근보다 훨씬 비용이 적은 것을 감안할 때, 한 번의 조회로 여러 수행을 할 수 있으니 큰 비용을 절약할 수 있었습니다.

*****

### 프로토타입의 장점
* 객체를 생성하기 위한 별도의 객체 생성 클래스가 불필요 합니다.
    * 팩토리 메소드 패턴과는 다르게 Creator가 필요 없음
* 객체의 각 부분을 조합해서 생성되는 형태에도 적용 가능합니다.

### 프로토타입의 단점
* clone을 이용할 객체들의 자료형인 class에 clone() 메서드를 구현해야 합니다.

### 프로토타입 활용 용도
* run-time에 새로운 제품을 추가하고 삭제할 수 있다.
    * 프로토타입 패턴을 이용하면 사용자에게 원형으로 생성되는 인스턴스를 등록하는 것만으로도 시스템에 새로운 제품 클래스를 추가할 수 있게 됩니다. run-time에 새로운 프로토타입을 넣고 빼기가 쉽다는 점에서 다른 생성 패턴에 비해 유연성을 지니고 있습니다.
* 구조를 다양화 함으로써 새로운 객체를 명세할 수 있다.
    * 많은 응용프로그램은 구성요소와 부분 구성요소의 복합을 통해 객체를 구축합니다. 예를 들어, 회로설계를 위한 편집기는 세부 회로를 모아서 큰 회로를 만듭니다. 이런 응용프로그램에서는 편의를 위한 복잡한 사용자 정의 구조를 사용자가 인스턴스화 하여 그 상황에 맞는 세부 회로를 계속 이용할 수 있도록 배려해 줄 때가 많습니다. 복합 회로 객체가 Clone() 연산을 구현함으로써 다른 구조를 갖는 회로의 기본 골격을 만듭니다.
* 서브클래스의 수를 줄일수 있다.
    * 팩토리 메서드를 보면 Creator 클래스의 계통이 처리할 제품 관련 클래스의 계통과 병렬로 복합되는 것을 알 수 있습니다. 프로토타입 패턴에서는 팩토리 메서드에 새로원 객체를 만들어 달라고 요청하는 것이 아니라 원형을 복제하는 것으로, Creator 클래스에 따른 새로운 상속 계층이 필요 없습니다.
* 동적으로 클래스에 따라 응용프로그램을 설정할 수 있다.
    * 몇몇 런타임 환경에서는 동적으로 클래스들을 응용프로그램으로 등록할 수 있도록 해 줍니다. 동적으로 로드 된 클래스의 인스턴스를 생성하고 싶은 응용프로그램은 정적으로 그 클래스의 생성자를 참조할 수 없습니다.   
    그 대신 런타임 환경이 그 클래스의 인스턴스를 자동으로 생성하고 원형 관리자에게 등록하면 응용프로그램은 이 원형 관리자에게서 필요한 클래스의 인스턴스를 얻을 수 있게 됩니다.

****

> 참조
* <a href="https://readystory.tistory.com/122">https://readystory.tistory.com/122</a>
* <a href="https://m.blog.naver.com/PostView.nhn?blogId=lhs860226&logNo=137674583&proxyReferer=https:%2F%2Fwww.google.com%2F">https://m.blog.naver.com/PostView.nhn?blogId=lhs860226&logNo=137674583&proxyReferer=https:%2F%2Fwww.google.com%2F</a>
* <a href="https://leetaehoon.tistory.com/55">https://leetaehoon.tistory.com/55</a>

감사합니다.

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>