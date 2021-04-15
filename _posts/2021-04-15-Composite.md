---
layout: post
title: "[Design Pattern] Composite"
subtitle: "[디자인 패턴][구조 패턴] 컴퍼지트"
date: 2021-04-15 06:20:00 +0900
background: '/img/posts/design-pattern.jpg'
category: Study
tags: [designpattern]
---
### Composite
객체들의 관계를 **트리 구조**로 구성하여 부분-전체 **계층**을 표현하는 패턴
* 사용자가 단일 객체와 복합 객체 모두 동일하게 다루도록 한다.
* 전체-부분의 관계를 갖는 객체들 사이의 관계를 정의할 때 유용합니다.
    * ex: Directory - File
* 클라이언트는 전체와 부분을 구분하지 않고 동일한 인터페이스를 사용할 수 있습니다.

### 다이어그램
<img class="img-fluid" src="/img/posts/inPost/composite-01.png">

* 클라이언트는 Component를 참조합니다.
* Component
    * 모든 요소들의 추상적인 Interface
    * Leaf와 Compsite가 구현해야 하는 Interface
* Leaf
    * 단일 객체로 Composite의 부분 객체로 Component의 형태로 들어갑니다.
* Composite
    * Component 객체를 자식으로 가집니다.

* 즉 전체 클래스는 Component를 구현하며, Composite란 전체에 Leaf의 부분이 속하는 형태입니다.

### 컴포지트 이해와 예제
위에서 예로 들었던 Directory와 File만한게 없을 것 같아요.

Unix 수업을 들을 때, Directory와 File 모두 File로 취급한다는 내용이 기억이 납니다.

ls 명령어를 쓰면 일괄적으로 출력되는데 이 기능을 예시로 작성해보았습니다.

#### Component - Node
<script src="https://gist.github.com/chaelin1211/06c73bf5936f5bb9939132509a054ec3.js"></script>

#### Composite - Directory
<script src="https://gist.github.com/chaelin1211/1a454b78232a4e9acc95341df42b2c0b.js"></script>

조금 복잡해보이지만 출력할 때 계층적으로 나타내고 싶어서 print를 Overload해서 두 가지로 만들었습니다.

#### Leaf - File
<script src="https://gist.github.com/chaelin1211/5f5a3032aa8d305dde222cd5fac81af1.js"></script>
위와 같은 이유로 print를 두 가지로 만들었습니다.

#### Main
<script src="https://gist.github.com/chaelin1211/63384af531b782bef8808188830b1f56.js"></script>

#### 출력
```
Directory 올빼미(Depth: 1)
    Directory 오리(Depth: 2)
        File photo1.jpg
        File photo2.jpg
        File photo3.jpg
    File test01.txt
    File test02.txt
    File test03.txt
```

위처럼 계층적으로 출력됩니다.

Directory(Composite) 또한 Node(Component)를 구현하므로써 File(Leaf)에 Directory도 저장할 수 있으며, print로 한 번에 출력할 수 있습니다.

위에서 말한 전체와 부분을 구분하지 않고 동일한 인터페이스 이용하기 + 계층 표현을 확인할 수 있었습니다.

### 장점
* 새로운 객체 추가나 삭제에 있어서 종류에 관계없이 동일한 메서드로 가능합니다.
* 전체-부품 관계일 때, 부품 부분의 확장이 용이합니다. (Leaf 클래스를 추가하면 됩니다.)

### 단점
* 설계가 지나치게 범용성을 갖기 때문에 새로운 요소를 추가할 때 복합 객체에서 구성 요소에 제약을 갖기 힘듭니다.
    * 예를들어, 복합 객체가 가지는 부분 객체의 종류를 제한하기 까다롭습니다.

***** 

> 참고
* <a href="https://jdm.kr/blog/228">https://jdm.kr/blog/228</a>
* <a href="https://sup2is.github.io/2020/06/25/composite-pattern.html">https://sup2is.github.io/2020/06/25/composite-pattern.html</a>

감사합니다.

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>