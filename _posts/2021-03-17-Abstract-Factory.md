---
layout: post
title: "[Design Pattern] Abstract Factory"
subtitle: "[디자인 패턴][생성 패턴] 추상 팩토리"
date: 2021-03-17 21:18:00 +0900
background: '/img/posts/design-pattern.jpg'
category: Study
tags: [designpattern]
---
### 추상 팩토리
구체적인 클래스에 의존하지 않고 **서로 연관되거나 의존적인 객체들의 조합**을 만드는 인터페이스를 제공하는 패턴

- 관련성 있는 여러 종류의 객체를 일관된 방식으로 생성하는 경우에 유용합니다.
- 상세화된 서브 클래스를 정의하지 않고도 서로 관련성 있거나 독립적인 **여러 객체의 군을 생성**하기 위한 인터페이스를 제공합니다.

### 다이어그램
<img class="img-fluid" src="/img/posts/inPost/abstractFactory.png">

* Abstract Factory: 팩토리 클래스의 공통 인터페이스
    - Concrete Factory: 구체적인 팩토리 클래스, Abstract Factory를 오버라이드 함으로써 구체적인 제품을 생성한다.
* Abstract Product: 제품의 공통 인터페이스
    - Product: 구체적인 제품

### 어떤 경우에 사용할까?
* 제품에 대한 클래스 라이브러리를 제공하고, 그들의 인터페이스를 노출시키고 싶을 때
* 관련된 제품 객체들이 함께 사용되도록 설계되었고, 이 부분에 대한 제약이 외부에서도 지켜지도록 하고 싶을 때

### 장점
* 제품 사이의 일관성을 증가시킵니다.
* 객체를 생성하는 코드를 분리하여 클라이언트 코드와 결합도를 낮추어줍니다.
    - 객체의 추가/수정시에 객체를 생성하는 코드만 수정하면 됩니다.

### 단점
* 기존 추상 팩토리의 세부 사항이 변경되면 모든 팩토리에 대해 수정이 필요합니다.
    - 추상 팩토리를 상속하고 있는 모든 팩토리에도 새로운 부분에 대해 추가되어야 하기 때문입니다.

### 예시
개인적으로 이해가 가장 잘 되는 피자를 들고 왔습니다.

<img class="img-fluid" src="/img/posts/inPost/abstractFactory-02.png">

피자 스타일(America, Seoul 버전)에 따른 도우와 소스 객체를 생성하는 추상 팩토리입니다. 

```
public interface PizzaFactory{
    public Dough CreateDough();
    public Source CreateSource();
    public Pizza CreatePizza();
}
```

```
public class AmericaPizzaFactory implements PizzaFactory{
    public Dough CreateDough(){
        return new WheatDough();
    }
    public Source CreateSource(){
        return new SweetChiliSource();
    }
    public Pizza CreatePizza(){
        return new AmericaPizza();
    }
}
```

```
public class SeoulPizzaFactory implements PizzaFactory{
    public Dough CreateDough(){
        return new GreenTeaDough();
    }
    public Source CreateSource(){
        return new HotChiliSource();
    }
    public Pizza CreatePizza(){
        return new SeoulPizza();
    }
}
```

### 클라이언트 코드
```
// 피자 가게
public class AmericanPizzaStore extends PizzaStore{
    PizzaFactory pizzaFactory = new AmericaPizzaFactory();
    public Pizza getPizza(){
        return new AmericaPizza(pizzaFactory);
    }
}

public class SeoulPizzaStore extends PizzaStore{
    PizzaFactory pizzaFactory = new SeoulPizzaFactory();
    public Pizza getPizza(){
        return new SeoulPizza(pizzaFactory);
    }
}
```

```
// 피자 클래스
public class Pizza{
    private Dough dough;
    private Source source;
    private PizzaFactory pizzaFactory;
    public Pizza(PizzaFactory pizzaFactory){
        this.pizzaFactory = pizzaFactory;
        this.dough = pizzaFactory.getDough();
        this.source = pizzaFactory.getSource();
    }
}

// 피자 클래스 (구체)
public class AmericaPizza extends Pizza{
    public AmericaPizza(PizzaFactory pizzaFactory) {
        super(pizzaFactory);
    }
}
public class SeoulPizza extends Pizza{
    public SeoulPizza(PizzaFactory pizzaFactory) {
        super(pizzaFactory);
    }
}
```

클라이언트에서 어떤 팩토리를 이용하는지는 실행 단계에서 결정됩니다. 

여기까지의 다이어그램을 보면 다음과 같습니다.

<img class="img-fluid" src="/img/posts/inPost/abstractFactory-03.png">

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
4. 의존성 주입(DI, Dependency Injection): 객체 생성을 캡슐화 하고 인자에 의해 생성될 객체가 정해지는 것에 의해 결합도가 낮아지고 유연한 코드가 생성될 수 있습니다.

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

### 끝
추상 팩토리 패턴은 연관된 객체들의 **집합**을 형성할 때 이용하는 디자인 패턴입니다.

객체들의 집합을 추상화하고 클라이언트에게 추상화된 인터페이스를 제공합니다. 이렇게 하면 클라이언트는 일관되게 객체를 전달 받아 사용할 수 있게 됩니다.

* 추상 팩토리는 인스턴스의 생성을 서브클래스에게 위임함으로써 의존성을 낮춥니다.

* 객체 생성을 캡슐화 하여 객체 간 느슨한 결합 관계를 만들고 특정 구현에 의존하지 않는 설계를 할 수 있습니다.

*****

감사합니다.

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>