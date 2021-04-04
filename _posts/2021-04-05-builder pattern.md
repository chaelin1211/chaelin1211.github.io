---
layout: post
title: "[Design Pattern] Builder"
subtitle: "[디자인 패턴][생성 패턴] 빌더"
date: 2021-4-5 00:07:00 +0900
background: '/img/posts/design-pattern.jpg'
category: Study
tags: [designpattern]
---
### 빌더
복합 객체의 **생성 과정**과 **표현 방법**을 분리하여 동일한 생성 절차에서 서로 다른 표현 결과를 만들 수 있게 하는 패턴   
(표현 방법: 조립이라는 의미로 생각하면 됩니다.)
* 생성되어야 하는 객체가 Optional한 속성을 많이 가질 때 빛을 발휘합니다.

*****
팩토리 패턴이나 추상 팩토리 패턴에서 생성해야 하는 클래스에 대한 속성 값이 많을 때 발생하는 이슈는 다음과 같습니다.

* 클라이언트 프로그램으로부터 팩토리 클래스로 많은 파라미터를 넘겨줄 때 - 타입, 순서 등에 대한 관리가 어려워져 에러가 발생할 확률이 높아집니다.
* 경우에 따라 필요 없는 파라미터에 대해 팩토리 클래스에 일일이 null 값을 넘겨줘야 합니다.
* 생성해야 하는 Sub Class가 무거워지고 복잡해짐에 따라 팩토리 클래스 또한 복잡해집니다.

위 문제를 해결하기 위해 빌더 패턴은 별도의 Builder 클래스를 만들어 필수적인 값은 생성자를 통해 입력받은 후, 선택적인 값들에 대해서는 메소드를 통해 입력받아 최종적으로 하나의 인스턴스를 리턴하는 방식입니다.

빌더 패턴은 복잡한 객체의 단계별 생성에 중점을 둔 반면에, 추상 팩토리 패턴은 객체의 집합이 존재할 때 유연한 설계에 중점을 둔 것입니다.

**Builder 클래스를 만들어 필수적인 값은 생성자를 통해 입력받은 후, 선택적인 값들에 대해서는 메소드를 통해 입력받아 최종적으로 하나의 인스턴스를 리턴**

*****

### 다이어그램
<img class="img-fluid" src="/img/posts/inPost/builder-01.png">
**Director**는 복합 객체(Product)를 생성하는 절차를 구현하고 (construct), **Builder** 인터페이스를 구현하는 **ConcreteBuilder**는 이 절차로부터 요청 받아 생성할 객체를 만들고 표현하는 책임 위임 받습니다.

ConcreteBuilder 클래스들은 복잡한 객체를 생성하고 조립하는데 필요한 메커니즘을 Builder 인터페이스에 정의된 각 연산에서 구현합니다.

---

##### Director와 Builder를 통해 각자 책임을 분리 했습니다.

Builder 인터페이스에는 Product를 생산하기 위한 여러 연산이 있는데 (builderPartA, builderPartB, ...), Director에서는 이런 연산들 중 필요 없는 연산이 있으면 호출하지 않을 수 있고, 순서를 바꿀 수도 있습니다.

따라서 Director 입장에서는 Product를 생성하는 절차를 세밀하게 조정할 수 있습니다.

객체 생성 방식이 바뀌면 (파라미터의 종류나 개수가 달라지는 경우) 다른 Director를 사용하면 되고, 필요한 객체가 바뀌면 Builder를 바꿔줍니다.

Builder: 부품 생산
Director: 조립

**여러 객체의 생성 방식을 유연하게 결정할 수 있습니다**

### 코드로 보는 예제
<script src="https://gist.github.com/chaelin1211/d7a9e406306b4177bfc045ddf3597822.js"></script>

Builder를 Client(Main)에서 입력받아 특정 Product를 생성합니다.

Director의 부분을 Main에서 입력하고, Builder를 Product 클래스에 Static Nested Class로 작성할 수도 있습니다. 이 방법이 좀 더 간단하고 많이 사용하는 것 같아요.

Director 클래스의 생성을 생략할 수 있기 때문이죠!

위에서 언급했듯이, 파라미터 종류, 개수가 달라지면 Director를 바꿔주어야 하는데 이는 너무 번거롭습니다.

*****

Static Nested Class로 Builder를 가지면 어떤 식인지 코드로 먼저 보겠습니다.

<script src="https://gist.github.com/chaelin1211/6b9bc82c691c4926d1a02372bbe66d5a.js"></script>

Product 내부에 Product를 위한 Builder를 만들어서 사용합니다.

주의하실 부분은 ProductBuilder에서 ```필수적인 부분은 생성자로``` 받는다는 것과, ```선택적인 부분은 Method로 받는데 return this로 Builder 객체``` 자체를 return 해주어야 합니다.

또 Product에는 Setter가 없고 Getter만 있어서 생성은 Builder를 통해서만 가능합니다.

이제 Client인 Main을 봅시다.

<script src="https://gist.github.com/chaelin1211/497cefbaeaf81021e4c6983819cf9048.js"></script>

빌더 패턴을 이용한 Main을 통해 확인할 수 있는 이점은 다음과 같습니다.

1. 선택적으로 추가할 인자들의 의미를 분명히 확인해 오류를 줄일 수 있습니다.
2. build() 메소드 실행시 한 번에 객체가 생성되므로 일관성이 유지됩니다.
3. setter 메소드를 생성하거나 추가할 필요가 없어집니다.

*****

많이 익숙해보이네요. 저번 프로젝트에서 이용한 Lombok의 @Builder 기능입니다.

Lombok 플러그인을 이용하면 Setter, Getter, ToString 등등 자주 생성하는 메소드를 어노테이션 하나로 쉽게 생성할 수 있습니다.

> Lombok을 모르시면 링크를 참조해주세요.
<a href="https://chaelin1211.github.io/study/2021/02/19/lombok-start.html">[Lombok] 소개와 설정</a>

Lombok의 @Builder를 이용하면 Product가 다음처럼 확 줄어듭니다.

<script src="https://gist.github.com/chaelin1211/1cf3a871b1c288d115c1d61418f9b941.js"></script>

> 이전에 사용했었는데 이게 빌더 패턴을 이용한 것인지도 몰랐네요... 부끄럽습니다...

### 장점
* 생성에 필요한 파라미터가 추가될 때마다 생성자를 오버로딩하지 않아도 됩니다.
    - 생성자 종류를 여러가지 만들 필요 없어집니다.
* 객체 생성에 필요한 파라미터의 의미를 코드 단(클라이언트)에서 명확히 알 수 있습니다.

### 단점
* 추가적인 Builder 클래스의 구현이 필요합니다.
    - Lombok을 사용한다면 쉽게 구현할 수 있습니다. (Lombok 설치를 하신다면!)

*****

> 참고
- <a href="https://medium.com/@sangw0804/gof-%EB%94%94%EC%9E%90%EC%9D%B8-%ED%8C%A8%ED%84%B4-2-%EB%B9%8C%EB%8D%94-%ED%8C%A8%ED%84%B4-3c56dc766d3b">https://medium.com/@sangw0804/gof-%EB%94%94%EC%9E%90%EC%9D%B8-%ED%8C%A8%ED%84%B4-2-%EB%B9%8C%EB%8D%94-%ED%8C%A8%ED%84%B4-3c56dc766d3b</a>
- <a href="https://readystory.tistory.com/121">https://readystory.tistory.com/121</a>
- <a href="https://dhsim86.github.io/programming/2019/07/28/design_patterns_02-post.html">https://dhsim86.github.io/programming/2019/07/28/design_patterns_02-post.html</a>
- <a href="https://medium.com/@sangw0804/gof-%EB%94%94%EC%9E%90%EC%9D%B8-%ED%8C%A8%ED%84%B4-2-%EB%B9%8C%EB%8D%94-%ED%8C%A8%ED%84%B4-3c56dc766d3b">https://medium.com/@sangw0804/gof-%EB%94%94%EC%9E%90%EC%9D%B8-%ED%8C%A8%ED%84%B4-2-%EB%B9%8C%EB%8D%94-%ED%8C%A8%ED%84%B4-3c56dc766d3b</a>
- <a href="https://dailyheumsi.tistory.com/187">https://dailyheumsi.tistory.com/187</a> 

감사합니다.

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>