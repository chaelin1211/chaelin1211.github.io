---
layout: post
title: "[Design Pattern] Singleton"
subtitle: "[디자인 패턴][생성 패턴] 싱글톤 패턴"
date: 2021-03-28 14:08:00 +0900
background: '/img/posts/design-pattern.jpg'
category: Study
tags: [designpattern]
---
### 싱글톤
전역 변수를 사용하지 않고 **객체를 하나만 생성**하도록 하며, 생성된 객체를 어디에서든 참조할 수 있도록 하는 패턴
* 하나의 인스턴스를 메모리에 등록하여 여러 스레드가 동시에 해당 인스턴스를 공유하여 사용하게끔 할 수 있으므로, 요청이 많은 곳에서 사용하면 효율을 높일 수 있습니다.
* 인스턴스가 **절대적으로 한 개만 존재**하는 것을 보증하고자 사용합니다.

### 다이어그램
<img class="img-fluid" src="/img/posts/inPost/singleton-01.png">

* getInstance 메서드를 통해 모든 클라이언트에게 동일한 인스턴스를 반환합니다.

### 어떤 경우에 사용할까?
* 위에서 언급했듯이 인스턴스가 한 개만 존재하도록 제한하고자 할 때 사용합니다.
* 인스턴스의 잦은 생성으로 인한 메모리 낭비를 방지하고자 할 때 사용합니다.
* 공통된 객체를 여러 곳에서 이용할 때, 일일이 전달하기가 번거롭기 때문에 싱글톤 패턴을 이용하여 어디서든 해당 인스턴스에 접근하게 할 수 있습니다.
    - DBCP(Database Connection Pool): DB와 연결하는 커넥션을 미리 생성해두고 풀에 저장해두었다가 필요할 때 꺼내쓰고, 사용 후 반환하는 기법. 각각의 연결 요청에 따라 인스턴스를 생성하는 것은 에러 이슈가 발생합니다. 싱글톤 패턴을 이용해 구현하므로써 무분별한 객체 생성을 막을 수 있습니다.   
    - Logger(로거): 계측, 수집한 각종 데이터를 보존하는 장치. 로그를 남길 때마다 로거 객체를 생성하는 것은 비효율적이기 때문에 싱글톤 패턴으로 시스템 자원 소모를 줄일 수 있습니다.

### 장점
위에 대부분 나온 부분이지만 간단히 다시 정리해보겠습니다.
* 메모리 낭비를 줄인다.
* 두 번째 이용부터는 객체 로딩 시간이 현저히 줄어 성능이 좋아진다.
* 싱글톤 인스턴스를 이용하는 다른 클래스들의 인스턴스들이 데이터를 공유하기 쉽다.

### 단점
* 싱글톤 인스턴스에 의해 너무 많은 데이터를 공유시킬 경우 다른 클래스의 인스턴스들 간의 결합도가 높아져 **OCP**을 위반하게 된다.
    - OCP(Open-Closed Princitle): 소프트웨어 개체는 확장에 대해서는 열려있어야 하고, 수정에 대해서는 닫혀있어야 한다는 프로그래밍 원칙
    - 위와 같은 이유로 수정이 어려워지고 유지보수의 비용이 높아질 수 있습니다.
* 멀티 스레드 환경에서 동기화 처리를 하지 않을 경우, 2개 이상의 인스턴스가 생성될 수 있습니다.
    - 각 스레드마다 동일 메모리를 공유하는 것이 아닌 별도 메모리 공간에서 변수를 읽어오기 때문에 각 스레드마다 동일한 변수의 값을 다르게 기억할 수 있습니다. 
    - sychronized 키워드로 방지할 수 있습니다. 하단 예시를 참고해주세요.
* 코드가 복잡해질 수 있습니다. 

### 예시
여러 가게에서 한 물류센터에 A 신발을 받아와 판매를 한다고 할 때, 가게 객체에선 A 신발의 객체를 공유하도록 한다고 생각하고 예시를 만들어 보았습니다.

즉 A 신발을 파는 모든 가게에선 물류 센터 내의 신발 개수를 공유합니다.

> 사실 실제 이런 경우라면 당연히 다른 방법을 쓰겠지만.. 싱글톤 특성인 요소 간 공유 위주로 설명하기 위한 단순한 예를 가져왔습니다.

<img class="img-fluid" src="/img/posts/inPost/singleton-02.png">

##### Shoes
```
interface Shoes{
    public int getNumberOfShoes();
    public String getShoesId();
    public void setNumberOfShoes(int numberOfShoes);
    public void setShoesId(String shoesId);
}
```

##### ShoesA
```
class ShoesA implements Shoes{
    private static ShoesA shoesA = new ShoesA();
    private String shoesId;
    private int numberOfShoes;
    private ShoesA(){}

    public static ShoesA getInstance(){
        return ShoesA.shoesA;
    }

    public int getNumberOfShoes(){
        return this.numberOfShoes;
    }

    public String getShoesId(){
        return this.shoesId;
    }
    
    public void setNumberOfShoes(int numberOfShoes){
        this.numberOfShoes = numberOfShoes;
    }

    public void setShoesId(String shoesId) {
    	this.shoesId = shoesId;
    }
}
```

##### Store
```
class Store{
    ArrayList<Shoes> shoeses;
    public Store(){
    	this.shoeses = new ArrayList<Shoes>();
    }
    public void addShoes(Shoes shoes) {
        // 한 신발에 대한 객체는 한 번만 저장
    	if(!shoeses.contains(shoes))
    	    shoeses.add(shoes);
    }
    public void sellShoes(Shoes shoes, int number){
        shoes.setNumberOfShoes(shoes.getNumberOfShoes()-number);
    }
    public void printShoeses(){
        System.out.println(this);
        for(Shoes shoes:shoeses){
            System.out.println(shoes.getShoesId()+": "+shoes.getNumberOfShoes());
        }
    }
}
``` 

##### Main
```
class Main {
	public static void main(String[] args) {
		Store ShoesMarket = new Store();
		Store ShoesWorld = new Store();

		// 물류센터
		ShoesA.getInstance().setShoesId("asd1234");
		ShoesA.getInstance().setNumberOfShoes(1024);
		
		// 가게에서 신발A 판매 시작
		ShoesMarket.addShoes(ShoesA.getInstance());
		ShoesWorld.addShoes(ShoesA.getInstance());
		
		// 재고 확인
		ShoesMarket.printShoeses();
		ShoesWorld.printShoeses();
	
		// 신발 판매
		ShoesA shoesA = ShoesA.getInstance();
		ShoesMarket.sellShoes(shoesA, 3);
		
		// 재고 확인
		System.out.println("----------ShoesMarket에서 신발A 3켤레 판매 후----------");
		ShoesMarket.printShoeses();
		ShoesWorld.printShoeses();
	}
}
```

##### 출력
```
Store@27716f4
asd1234: 1024
Store@8efb846
asd1234: 1024
----------ShoesMarket에서 신발A 3켤레 판매 후----------
Store@27716f4
asd1234: 1021
Store@8efb846
asd1234: 1021
```

한 가게에서 신발A를 팔았을 때 다른 가게에서도 신발A에 대한 수량이 바뀐 것을 확인할 수 있습니다.

### 멀티 스레드 환경에서 싱글톤
위와 다르게 멀티 스레드에서의 싱글톤을 알아보기 위해 더 단순한 형태로 두 클래스를 만들었습니다.

##### Person - 싱글톤 인스턴스를 호출할 스레드
```
class Person extends Thread {
	int id;

	public Person(int id) {
		this.id = id;
	}

	public void run() {
		Apple.getInstance().print("Person ID: " + this.id + " / Apple: " + Apple.getInstance().toString());
	}
}
```

##### Apple - 싱글톤 클래스
```
class Apple{
	private static Apple apple = new Apple();
	private Apple() {}
	public static Apple getInstance() {
		return apple;
	}
	public void print(String str) {
		System.out.println(str);
	}
}
```

##### Main
```
class Main {
	public static void main(String[] args){
		int maxStore = 10;
		Person[] People = new Person[maxStore];
		
		for (int i = 0; i < maxStore; i++) {
			People[i] = new Person(i);
			People[i].start();
		}
	}
}
```

##### 출력
```
Person ID: 6 / Apple: Apple@c7b723d
Person ID: 1 / Apple: Apple@c7b723d
Person ID: 9 / Apple: Apple@c7b723d
Person ID: 5 / Apple: Apple@c7b723d
Person ID: 2 / Apple: Apple@c7b723d
Person ID: 4 / Apple: Apple@c7b723d
Person ID: 8 / Apple: Apple@c7b723d
Person ID: 3 / Apple: Apple@c7b723d
Person ID: 7 / Apple: Apple@c7b723d
Person ID: 0 / Apple: Apple@c7b723d
```

여러 스레드에서 호출했지만 싱글톤 특성에 맞게 같은 객체가 반환됨을 확인할 수 있습니다. 

이때 Apple 내의 공통적인 필드를 여러 스레드에서 수정한다면 어떻게 될까요?

##### Apple - count 변수 공유
```
class Apple {
	private static Apple apple = new Apple();
	private int count = 0;

	private Apple() {
	}

	public static Apple getInstance() {
		return apple;
	}

	public void print(String str) {
		count++;
		System.out.println(str + " / Count: " + this.count);
	}
}
```
count 변수를 추가하고 print 메소드에서 수정 후 함께 출력해줍니다.

위와 동일한 Main을 돌리면 다음처럼 출력됩니다.

```
Person ID: 0 / Apple: Apple@1db55e5d / Count: 1
Person ID: 1 / Apple: Apple@1db55e5d / Count: 5
Person ID: 3 / Apple: Apple@1db55e5d / Count: 4
Person ID: 4 / Apple: Apple@1db55e5d / Count: 4
Person ID: 5 / Apple: Apple@1db55e5d / Count: 6
Person ID: 2 / Apple: Apple@1db55e5d / Count: 2
Person ID: 6 / Apple: Apple@1db55e5d / Count: 7
Person ID: 9 / Apple: Apple@1db55e5d / Count: 8
Person ID: 8 / Apple: Apple@1db55e5d / Count: 8
Person ID: 7 / Apple: Apple@1db55e5d / Count: 9
```

Count 부분을 보면 같은 Apple 객체를 사용하지만 전혀 동기화가 되지 않는 모습을 볼 수 있습니다.
 
#### sychronized
synchronized 키워드를 여러 스레드가 동시에 접근하지 못하게 할 곳 (동기화가 필요한 부분)에 추가합니다. 

저는 count에 대한 수정이 있는 print 메소드에 추가했습니다.

##### Apple
```
class Apple {
	private static Apple apple = new Apple();
	private int count = 0;

	private Apple() {
	}

	public static Apple getInstance() {
		return apple;
	}

	public synchronized void print(String str) {
		count++;
		System.out.println(str + " / Count: " + this.count);
	}
}
```

다시 동일한 Main을 run하면 다음처럼 출력 됩니다.

##### 출력
```
Person ID: 2 / Apple: Apple@73c124cd / Count: 1
Person ID: 9 / Apple: Apple@73c124cd / Count: 2
Person ID: 8 / Apple: Apple@73c124cd / Count: 3
Person ID: 1 / Apple: Apple@73c124cd / Count: 4
Person ID: 5 / Apple: Apple@73c124cd / Count: 5
Person ID: 4 / Apple: Apple@73c124cd / Count: 6
Person ID: 6 / Apple: Apple@73c124cd / Count: 7
Person ID: 7 / Apple: Apple@73c124cd / Count: 8
Person ID: 3 / Apple: Apple@73c124cd / Count: 9
Person ID: 0 / Apple: Apple@73c124cd / Count: 10
```

count가 접근되는 순서대로 수정되었고, 동기화가 잘 되어 중복이 없음을 확인할 수 있습니다.

### 싱글톤 vs 정적 클래스 (C#)
정적 클래스란 인스턴스를 만들 수 없는 클래스로, 모든 멤버를 static으로 선언해야 합니다.

전역적으로 접근해야 하는 유틸리티 클래스의 경우 정적 클래스로 만들면 유용하게 사용할 수 있습니다. 

인스턴스를 가질 수 없고 메소드만 사용하기 때문에 절차지향적인 함수에 더 가깝습니다. 즉, OOP(Object Oriented Programming)의 원칙을 따라가지 않습니다.

||싱글톤|정적 클래스|
|---|---|---|
|원리|하나의 인스턴스를 생성해 재사용|인스턴스를 생성하지 않고 정적 멤버에 접근|
|인터페이스 구현|가능|불가능|
|OOP|O|X|
|Override|가능|불가능|
|Load|필요할 때 Lazy Initialization 가능|정적 바인딩되어 컴파일 시간에 Load|
|성능|상대적으로 느림|정적 바인딩을 이용해 빠름|

* 싱글톤의 Early Initialization: 클래스가 로드될 때 인스턴스가 생성되는 것으로, 위의 예시는 다 이 방법을 사용했습니다.
    - 가장 간단하지만 클라이언트에서 사용하지 않더라도 인스턴스가 항상 생성되는 것이 단점입니다.
```
class SingltonEarly{
    private static SingltonEarly singltonEarly = new SingltonEarly();
    ...
}
```

* 싱글톤의 Lazy Initialization: getInstance를 호출할 때 객체를 생성하는 것으로 인스턴스가 필요할 때 생성하므로써, Early Initialization의 단점을 보완합니다.
    - 이 방법은 멀티 스레드에서 2개 이상의 인스턴스가 생성될 수 있으니 동기화를 해주어야 합니다.
    - 아래는 동기화가 되지 않은 상태입니다.
```
class SingltonLazy{
    private static SingltonLazy singltonLazy;
    public static SingltonLazy getInstance(){
        if(singltonLazy == null){
            singltonLazy = new SingltonLazy();
        }
        return singltonLazy;
    }
    ...
}
```

### 끝
싱글톤 패턴은 제약이 확실해야 하는 만큼 구현이 복잡하고 다양한 방법이 있네요. 

직렬화/역직렬화 관련 내용은 빼고 정리했는데도 글이 엄청 길어졌습니다.

직렬화/역직렬화 자체에 대한 이해가 부족해 다음에 다시 보기로 하고 넘겼지만 관련 내용은 참고 링크 중 가장 마지막 링크로 가시면 보실 수 있습니다.

*****

> 참고  
- <a href="https://jeong-pro.tistory.com/86">https://jeong-pro.tistory.com/86</a>   
- <a href="https://webdevtechblog.com/%EC%8B%B1%EA%B8%80%ED%84%B4-%ED%8C%A8%ED%84%B4-singleton-pattern-db75ed29c36">https://webdevtechblog.com/%EC%8B%B1%EA%B8%80%ED%84%B4-%ED%8C%A8%ED%84%B4-singleton-pattern-db75ed29c36</a>   
- <a href="https://mygumi.tistory.com/265">https://mygumi.tistory.com/265</a> 
- <a href="https://javaplant.tistory.com/21">https://javaplant.tistory.com/21</a>  
- <a href="https://twpower.github.io/227-singleton-pattern-concept-and-example">https://twpower.github.io/227-singleton-pattern-concept-and-example</a>   
- <a href="https://yaboong.github.io/design-pattern/2018/09/28/thread-safe-singleton-patterns/">https://yaboong.github.io/design-pattern/2018/09/28/thread-safe-singleton-patterns/</a>   

감사합니다.

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>
