---
layout: post
title: "[Design Pattern] Factory Method"
subtitle: "[디자인 패턴][생성 패턴] 팩토리 메소드"
date: 2021-03-19 02:21:00 +0900
background: '/img/posts/design-pattern.jpg'
category: Study
tags: [designpattern]
---
### 팩토리 메소드
객체 **생성 처리를 서브 클래스로 분리**해서 처리하도록 캡슐화하는 패턴입니다.

* 객체 생성을 캡슐화하는 패턴입니다.
* 객체의 생성 코드를 별도의 클래스/메서드로 분리함으로써 **객체 생성의 변화**에 대비하는데 유용합니다.
* 특정 기능의 구현은 별개의 클래스로 제공되는 것이 바람직한 설계입니다.
    * **기능의 변경**이나 **상황에 따른 기능의 선택**은 해당 객체를 생성하는 코드의 변경을 초래합니다.
    * 상황에 따라 적절한 객체를 생성하는 코드는 자주 중복될 수 있습니다.
    * 객체 **생성 방식의 변화**는 해당되는 모든 코드 부분을 변경해야 하는 문제가 발생합니다.

<p class="hight-block">객체를 생성하기 위해 인터페이스를 정의하지만, 어떤 클래스의 인스턴스를 생성할지에 대한 결정은 서브클래스가 내리도록 합니다.</p>

> GoF에서 밝힌 팩토리 메소드의 의도

### 다이어그램
<img class="img-fluid" src="/img/posts/inPost/factory-method-01.png">

* Creator: 팩토리 메소드를 갖는 클래스
    * ConcreteCreator: 팩토리 메소드를 구현하는 클래스로 ConcreteProduct 객체를 생성
* Product: 팩토리 메소드로 생성될 객체의 공통 인터페이스
    * ConcreteProduct: 구체적으로 객체가 생성되는 클래스

* Creator의 서브 클래스에 팩토리 메소드를 정의하여, 팩토리 메소드 호출로 적절한 ConcreteProduct 인스턴스를 반환합니다.

### 어떤 경우에 사용할까?
* 클래스 생성과 사용의 처리 로직을 분리하여 **결합도를 낮추고자** 할 때
    - 객체의 생성을 서브 클래스에 위임함으로써 보다 효율적인 코드 제어가 가능하며 의존성을 제거합니다.
* 어떤 클래스가 자신이 생성해야 하는 객체의 클래스를 예측할 수 없을 때
* 객체 생성의 책임을 몇 개의 서브 클래스 가운데 하나에게 위임하고, **어떤 서브 클래스가 위임자인지에 대한 정보를 최소화**하고 싶을 때

### 장점
* 하위 클래스에서 생성될 객체가 결정됩니다.
    - 확장에 용이합니다.
* 확장성 있는 전체 프로젝트 구성이 가능합니다.
* 추상적인 클래스를 통해 실제 구현 대상인 Concrete Product와 Client의 결합도를 낮추어 줍니다.

### 단점
* 객체가 늘어날 때마다 하위 클래스 재정의로 인한 불필요한 많은 클래스 생성이 필요할 수 있습니다.

### 예시
저번 <a href="https://chaelin1211.github.io/study/2021/03/17/Abstract-Factory.html">추상 팩토리</a> 예제에서 클라이언트 부분을 조금 수정해 가져왔습니다.

<img class="img-fluid" src="/img/posts/inPost/factory-method-02.png">

```
// 피자 가게
public class AmericanPizzaStore extends PizzaStore{
    public Pizza getPizza(String pizzaName){
        if(pizzaName == "AmericaPizza") 
            return new AmericaPizza();
        //else if(pizzaName == "~~")
    }
}

public class SeoulPizzaStore extends PizzaStore{
    public Pizza getPizza(String pizzaName){
        if(pizzaName == "SeoulPizza") 
            return new SeoulPizza();
        //else if(pizzaName == "~~")
    }
}
```

```
// 피자 클래스
public class Pizza{
    private Dough dough;
    private Source source;
    public Pizza(){
        this.dough = pizzaFactory.getDough();
        this.source = pizzaFactory.getSource();
    }
}

// 피자 클래스 (구체)
public class AmericaPizza extends Pizza{
    public AmericaPizza() {
        super();
    }
}
public class SeoulPizza extends Pizza{
    public SeoulPizza() {
        super();
    }
}
```

위의 예제에선 하나의 종류 피자만 생성하지만 확장하면 다이어그램처럼 다양한 피자를 만들 수 있습니다.

### 여기서 드는 궁금증! 추상 팩토리와 팩토리 메소드의 공통점, 차이점은?
둘의 다이어그램을 같이 보며 비교해보겠습니다.

#### 추상 팩토리
<img class="img-fluid" src="/img/posts/inPost/abstractFactory.png">

#### 팩토리 메소드
<img class="img-fluid" src="/img/posts/inPost/factory-method-01.png">

### 공통점
1. Template Method Pattern을 사용합니다.
    - 어떤 작업을 처리하는 **일부분을 서브 클래스로 캡슐화**해 전체 일을 수행하는 구조는 바꾸지 않으면서 특정 단계에서 수행하는 내역을 바꾸는 패턴
2. Factory Method Pattern을 사용합니다.
    - Factory를 통해실제 구현 대상인 Concrete와 Client 간 결합도를 낮춰줍니다.
    - 인자에 따라 생성되는 객체가 결정됩니다.
3. 객체 생성을 캡슐화 합니다.
4. 의존성 주입(DI, Dependency Injection): 객체 생성을 캡슐화 하고 외부로 부터 필요한 객체를 받아 사용하므로써 결합도가 낮아지고 유연한 코드가 생성될 수 있습니다.

### 차이점
1. Factory 클래스에서 객체에 대한 생성을 지원하는 범위가 다릅니다.
    * 추상 팩토리: 한 Factory에서 서로 연관된 **여러 종류의 객체 생성**을 지원합니다. (**제품군** 생성 지원)
    * 팩토리 메소드: 한 Factory당 **한 종류의 객체 생성** 지원합니다.
2. 인자에 따라 선택되는 것이 다릅니다.
    * 추상 팩토리: 인자에 따라 객체들을 생성하는 Factory의 종류가 결정됩니다. (다수의 Factory 존재)
    * 팩토리 메소드: 인자에 따라 생성되는 객체의 종류가 결정됩니다.
3. 포커스
    * 추상 팩토리: 클래스(Factory) 레벨에서 포커스를 맞춤으로써, Product들이 다른 클래스와 사용될 때의 **제약사항을 강제**할 수 있습니다. 새로운 ConcreteFactory를 추가할 때 많은 작업이 필요합니다.
    * 팩토리 메소드: 메소드 레벨에서 포커스를 맞춤으로써, Client의 **ConcreteProduct 인스턴스**의 생성 및 구성에 대한 책임을 덜어줍니다.

*****

감사합니다.

> 참조   
> <a href="https://velog.io/@wlsdud2194/what-is-di">https://velog.io/@wlsdud2194/what-is-di</a>   
><a href="https://defacto-standard.tistory.com/42"> https://defacto-standard.tistory.com/42</a>   
> <a href="https://woovictory.github.io/2019/02/07/Design-Pattern-Factory-Pattern/">https://woovictory.github.io/2019/02/07/Design-Pattern-Factory-Pattern/</a> 

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>