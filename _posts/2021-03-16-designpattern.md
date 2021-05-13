---
layout: post
title: "Design Pattern이란?"
subtitle: "디자인 패턴 파해치기 Start"
date: 2021-03-16 19:33:00 +0900
background: '/img/posts/design-pattern.jpg'
category: Study
tags: [designpattern]
---

### 디자인 패턴이란?
자주 발생하는 문제들을 피하기 위해 사용되는 패턴.

* 소프트웨어 설계시 자주 발생하는 고질적인 문제들이 또 발생했을 때 재사용할 수 있는 해결책
* 패턴은 팀원 간 의사 소통을 원활하게 해주는 중요한 역할을 합니다.

<p class="hight-block">아래의 디자인 패턴에 대한 설명은 GoF 디자인 패턴입니다.</p>

### 디자인 패턴 분류
* 생성 패턴 - 객체 생성
* 구조 패턴 - 객체 결합
* 행위 패턴 - 객체 간 커뮤니케이션

### 생성 패턴
**인스턴스를 만드는 절차**를 추상화하는 패턴입니다.
- 객체의 **생성과 조합**을 캡슐화 -> 특정 객체가 생성되거나 변경되어도 프로그램 구조에 영향을 크게 받지 않도록 유연성을 제공합니다.

### 구조 패턴
클래스나 객체를 조합해 더 큰 **구조**를 만드는 패턴입니다.
- 다른 인터페이스를 가진 2개의 객체를 묶어 단일 인터페이스를 제공하거나, 객체들을 서로 묶어 새로운 기능을 제공합니다.

### 행위 패턴
객체나 클래스 사이의 알고리즘이나 책임 분배에 관련된 패턴입니다.
- 객체가 혼자 수행할 수 없는 작업을 여러 개의 객체로 어떻게 분배하는지, 또 그 과정에서 객체 사이의 결합도를 최소화 하는 것에 중점을 둡니다.

*****

### 분류 별 종류
<img class="img-fluid" src="/img/posts/inPost/types-of-designpattern.png">

### 생성(Creational) 패턴 
* <a href="https://chaelin1211.github.io/study/2021/03/17/Abstract-Factory.html">추상 팩토리(Abstract Factory)</a>
    - 구체적인 클래스에 의존하지 않고 **서로 연관되거나 의존적인 객체들의 조합**을 만드는 인터페이스를 제공하는 패턴

* <a href="https://chaelin1211.github.io/study/2021/03/18/factory-method.html">팩토리 메서드(Factory Method)</a>
    - **객체 생성 처리**를 서브 클래스로 분리해서 처리하도록 캡슐화하는 패턴

* <a href="https://chaelin1211.github.io/study/2021/03/28/singleton.html">싱글톤(Singleton)</a>
    - 전역 변수를 사용하지 않고 객체를 하나만 생성하도록 하며, 생성된 객체를 어디에서든 참조할 수 있도록 하는 패턴

* <a href="https://chaelin1211.github.io/study/2021/04/04/builder-pattern.html">빌더(Builder)</a>
    - 복합 객체의 생성 과정과 표현 방법을 분리하여 동일한 생성 절차에서 서로 다른 표현 결과를 만들 수 있게 하는 패턴

* <a href="https://chaelin1211.github.io/study/2021/04/05/prototype.html">프로토타입(Prototype)</a>
    - 원형이 되는 인스턴스로 새로운 인스턴스를 만드는 방식으로, 객체에 의해 생성될 객체의 타입이 결정되는 생성 디자인 패턴

### 구조(Structural) 패턴
* <a href="https://chaelin1211.github.io/study/2021/04/11/Adapter.html">어댑터(Adapter)</a>
    - 한 클래스의 인터페이스를 클라이언트에서 사용하고자 하는 다른 인터페이스로 변환시키는 패턴

* <a href="https://chaelin1211.github.io/study/2021/04/13/bridge.html">브리지(Bridge)</a>
    - 구현부에서 추상층을 분리하여 각자 독립적으로 변형이 가능하고 확장이 가능하도록 하는 패턴
    - 즉 기능과 구현에 대해 두 개를 별도의 클래스로 구현

* <a href="https://chaelin1211.github.io/study/2021/04/14/Composite.html">컴퍼지트(Composite)</a>
    - 객체들의 관계를 트리 구조로 구성하여 부분-전체 계층을 표현하는 패턴
    - 사용자가 단일 객체와 복합 객체 모두 동일하게 다루도록 한다.

* <a href="https://chaelin1211.github.io/study/2021/04/20/Decorator.html">데커레이터(Decorator)</a>
    - 주어진 상황 및 용도에 따라 어떤 객체에 책임을 덧붙이는 패턴
    - 기능 확장이 필요할 때 서브클래싱 대신 쓸 수 있는 유연한 대안

* <a href="https://chaelin1211.github.io/study/2021/04/21/Facade.html">퍼사드(Facade)</a>
    - 한 서브시스템 내의 인터페이스 집합에 대한 **획일화 된 하나의 인터페이스**를 제공하는 패턴

* <a href="https://chaelin1211.github.io/study/2021/04/21/Flyweight.html">플라이웨이트(Flyweight)</a>
    - 동일하거나 유사한 객체들 사이에 가능한 많은 데이터를 서로 공유하여 사용하도록 하여 메모리 사용량을 최소화 하는 패턴

* <a href="https://chaelin1211.github.io/study/2021/04/24/Proxy.html">프록시(Proxy)</a>
    - 실제 기능을 수행하는 객체 대신 가상의 객체를 사용해 로직의 흐름을 제어하는 디자인 패턴
    - 프록시 클래스는 Wrapper로서의 역할 수행

### 행위(Behavioral) 패턴
* <a href="https://chaelin1211.github.io/study/2021/04/26/Chain-of-Resposibility.html">책임 연쇄(Chain of Resposibility)</a>
    - 클라이언트로부터의 요청을 처리할 수 있는 **처리 객체를 집합으로** 만들어 부여함으로써 **결합도를 없애기** 위한 패턴 

* <a href="https://chaelin1211.github.io/study/2021/05/01/Command.html">커맨드(Command)</a>
    - 요청을 객체의 형태로 캡슐화하여 사용자가 보낸 요청을 나중에 이용할 수 있도록 메서드 이름, 매개변수 등 요청에 필요한 정보를 저장 또는 로깅, 취소할 수 있게하는 패턴

* <a href="https://chaelin1211.github.io/study/2021/05/02/Interpreter.html">인터프리터(Interpreter)</a>
    - **문법 규칙을 클래스화** 한 구조로, 일련의 규칙으로 정의된 문법적 언어를 해석하는 패턴
    - SQL 구문 분석, 기호 처리 엔진 등에서 사용

* <a href="https://chaelin1211.github.io/study/2021/05/05/Iterator.html">이터레이터(Iterator)</a>
    - 내부 표현부를 노출하지 않고, 집합 객체에 속한 원소들을 순차적으로 접근할 수 있는 방법을 제공하는 패턴

* <a href="https://chaelin1211.github.io/study/2021/05/06/Mediator.html">중재자(Mediator)</a>
    - 모든 클래스 간의 복잡한 로직(상호작용)을 캡슐화하여 하나의 클래스에 위임하여 처리하는 패턴
    - M:N 관계에서 M:1 관계로 복잡도를 떨어뜨려 유지 보수 및 재사용의 확장성에 유리

* <a href="https://chaelin1211.github.io/study/2021/05/07/Memento.html"> 메멘토(Memento)</a>
    - 객체의 **상태 정보를 저장**하고 사용자의 필요에 의하여 **원하는 시점의 데이터를 복원**할 수 있는 패턴

* <a href="https://chaelin1211.github.io/study/2021/05/14/Observer.html">옵저버(Observer)</a>
    - 객체의 상태가 변할 때 그와 연관된 객체들에게 알림을 보내는 패턴
    - 한 객체의 상태 변화에 따라 다른 객체의 상태도 연동되도록 1:N 객체 의존 관계를 구성하는 패턴

* 상태(State)
    - 객체의 특정 상태를 클래스로 선언하고, 클래스에서는 해당 상태에서 할 수 있는 행위들을 메서드로 정의하는 패턴 
    - 객체 내부의 상태에 따라 동작을 변경해야할 때 사용

* 전략(Strategy)
    - 객체들이 할 수 있는 행위 각각에 대해 전략 클래스를 생성하는 패턴
    - 동적으로 행위의 수정이 필요한 경우 전략을 바꾸는 것만으로 행위의 수정이 가능

* 템플릿 메서드(Template Method)
    - 어떤 작업을 처리하는 **일부분을 서브 클래스로 캡슐화**해 전체 일을 수행하는 구조는 바꾸지 않으면서 특정 단계에서 수행하는 내역을 바꾸는 패턴

* 방문자(Visitor)
    - 실제 로직을 가지고 있는 객체(Visitor)가 로직을 적용할 객체를 방문하면서 실행하는 패턴
    - 로직과 구조를 분리하는 패턴, 구조를 수정하지 않고도 새로운 동작을 기존 객체에 추가 가능

### 끝
각각의 패턴에 대해 상세하게 공부해 이 글에 각각의 링크를 추가하겠습니다.

감사합니다.

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>