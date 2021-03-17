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

여기까지의 다이어그램을 보면 다음과 같습니다.

<img class="img-fluid" src="/img/posts/inPost/abstractFactory-03.png">

### 끝
추상 팩토리 패턴은 연관된 객체들의 집합을 형성할 때 이용하는 디자인 패턴입니다.

객체들의 집합을 추상화하고 클라이언트에게 추상화된 인터페이스를 제공합니다. 이렇게 하면 클라이언트는 일관되게 객체를 전달 받아 사용할 수 있게 됩니다.

* 추상 팩토리는 인스턴스의 생성을 서브클래스에게 위임함으로써 의존성을 낮춥니다.

감사합니다.

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>