---
layout: post
title: "[Java] Spring Framework"
subtitle: "Spring의 개념과 Annotation"
date: 2021-04-29 15:20:00 +0900
background: '/img/posts/jekyll-02.png'
category: Study
tags: [java, spring, interview]
---
### Framework
소프트웨어 개발에 있어 하나의 뼈대 역할을 합니다.

공통적인 개발 환경을 제공해주고, 개발에 필요한 화면 구현, DB 연동, 개발 환경들에 공통적인 부분을 제공함으로써 개발 시간과 리소스 비용을 절감해 생산성을 높여주는 것입니다.

* 종류: 스프링 프레임워크, 장고 프레임워크, ...

### Spring framework
자바 플랫폼을 위한 **오픈소스 애플리케이션 프레임워크**로서 엔터프라이즈급 애플리케이션을 개발하기 위한 모든 기능을 종합적으로 제공하는 경량화된 솔루션입니다.

> 엔터프라이즈 애플리케이션: 기업 또는 정부와 같은 기업 환경에서 작동하도록 설계된 대규모 소프트웨어 시스템 플랫폼입니다.

* EJB (Enterprise Java Beans)의 단점을 보완한 프레임워크
* DI(Dependency Injection)과 AOP(Aspect-Oriented Programming)이 지원되는 경량 컨테이너 & 프레임워크

### 경량화
스프링 자체가 가볍거나 규모가 작은 코드로 이루어진 것은 아닙니다.

오히려 스프링은 세분화되고 복잡하고 방대한 코드를 가진 프레임워크입니다. 그럼에도 경량화가 특징인 이유는 기존 자바 엔터프라이즈 기술의 불필요한 복잡함에 반대되는 개념에서 시작되었습니다.

주류 기술이었던 EJB는 고가의 무거운 자바 서버(WAS)가 필요했고, 다루기 힘든 설정파일 구조, 패키징, 불편한 배포 등의 단점이 있었습니다.

스프링은 톰캣과 같은 단순한 서버 환경에서도 동작하며, 단순한 개발환경으로도 엔터프라이즈 애플리케이션을 개발하는데 충분합니다. 또 EJB 등의 기존 프레임워크에서 만들어진 코드에 비해 코드량이 적고 단순하기도 합니다. 

즉, 기존에 비해 빠르고 간편하게 애플리케이션을 개발할 수 있어 생산성이 뛰어난 프레임워크입니다.

### Spring 기능
* 경량 컨테이너
    * 스프링은 객체를 담고 있는 컨테이너로써 자바 객체의 생성과 소멸 같은 라이프 사이클을 관리하고, 언제든 필요한 객체를 가져다 사용할 수 있도록 해줍니다.
* POJO (Plain Old Java Object) 방식의 프레임워크
    * POJO란 객체지향적인 원리에 충실하면서 환경과 기술에 종속되지 않고 필요에 따라 재활용될 수 있는 방식으로 설계된 오브젝트를 말합니다.
    * 스프링 프레임워크는 어딘가에 종속되어 결합도를 높이는 형식을 배제하기 위해 만들어진 POJO 기반의 프레임워크입니다. 즉 특정 라이브러리나 컨테이너 기술에 종속적이지 않다는 것입니다.
    * 일반적인 Java 코드를 이용하여 객체를 구성하는 방식 그대로 스프링에서 사용가능하기 때문에 가장 일반적인 형태로 코드를 작성하고 실행할 수 있기 때문에 높은 생산성과 유연한 테스트를 할 수 있단 장점을 갖게 됩니다.
* IoC (Inversion of Control): 제어 반전
    * 제어권이 사용자가 아니라 프레임워크에 있어서 필요에 따라 스프링에서 사용자의 코드를 호출합니다.
    * 따라서 스프링에서는 사용자가 아닌 컨테이너에서 객체를 생성하고, 소멸하고, 제어합니다. 
* DI (Dependency Injection): 의존성 주입
    * 소스코드 내에서 모든 것이 이루어지는 것이 아니라, 구현체를 외부에서 주입 받는 것입니다.
    * 각 계층이나 서비스 간의 의존성이 존재할 경우 프레임워크가 서로 연결시켜 줍니다.
    * 각 클래스 사이의 의존 관계를 **빈 설정 정보**를 바탕으로 컨테이너가 자동으로 연결해 주는 것입니다.
* AOP (Aspect-Oriented Programming): 관점 지향 프로그래밍
    * 여러 모듈에서 공통적으로 사용하는 기능의 경우 해당 기능을 분리하여 관리할 수 있습니다.
    * 프록시 패턴을 이용해 AOP 효과를 냅니다. 프록시 패턴을 이용해 기존 코드를 변경하지 않고 기능으르 추가할 수 있습니다.
* 확장성이 높습니다.
    * **다른 프레임워크들과의 통합**을 지원하기 때문에 이미 수많은 라이브러리가 스프링에서 지원되고 있고 라이브러리를 **별도로 분리하기에도 용이**합니다.
    * ex: 정부 표준 프레임워크
* 트랜잭션 지원
    * 트랜잭션의 관리를 어노테이션이나 XML로 설정할 수 있기 때문에 개발자가 별도의 소스코드를 개발할 필요가 없습니다.
    
### 어노테이션이란?
@를 이용한 주석을 통해 특별한 의미를 부여하는 것입니다.

주석처럼 코드에 달아 클래스, 메소드, 변수 등에 특별한 의미와 기능을 주입합니다. 또 해석되는 시점을 정할 수도 있습니다.

어노테이션은 메타 데이터로서의 기능을 주로 목적으로 사용합니다. 프로그램 실행 관점에서 보면 프로그램이 처리할 메인 데이터가 아니라 실행 과정에서 데이터를 어떻게 처리할 것인지에 대해 알려주는 서브 데이터라고 볼 수 있습니다.

> 메타 데이터: 데이터를 위한 데이터를 의미하며, 테이터에 대한 설명을 의미하는 데이터입니다.

어노테이션의 용도는 크게 다음과 같이 정리할 수 있습니다.
* 컴파일러에게 코드 작성 문법 에러를 체크하도록 정보 제공
* 소프트웨어 개발툴이 빌드나 배치시 **코드를 자동으로 생성**할 수 있도록 정보 제공
* 실행시 특정 기능을 실행하도록 정보 제공

어노테이션은 유효성 검사를 쉽게 할 수 있도록하며, 코드를 깔끔하게 합니다.

#### 어노테이션이 생겨난 이유
프로그래머들에게 자신의 코드에 대한 정보를 코드에 직접 기술할 기회를 제공하기 위함입니다.

> 어노테이션으로 메타데이터를 기술하기 이전엔 주석을 이용한다던지 transient 키워드를 이용한다던지 여러 방법이 일관성 없이 사용되었습니다.

> 그 중 주로 XML이 사용되었는데 그 방법 또한 좋은 방법은 아니었습니다.

> 프로그램의 규모가 방대해지면서 XML이 가지는 설정 정보의 양이 많아지고 또 코드와 XML 사이의 디커플링이 발생되며 어플리케이션의 유지보수를 어렵게 했습니다.

#### 어노테이션의 종류
* Built-in Annotation: 자바에서 기본으로 제공하는 어노테이션
    * @Override, @Deprecated, @SuppressWarnings, ...
* Meta Annotation: 이 메타 어노테이션으로 커스텀 어노테이션을 생성할 수 있습니다.
    * @Retention, @Documented, @Target, ...
* Declare Custom Annotation: 직접 선언하는 어노테이션 입니다.

스프링에서도 제공해주는 어노테이션이 있으며, 직접 만들 수 있습니다.

*****

>참고
* <a href="https://www.castingn.com/sourcing/kkultip_detail/110">https://www.castingn.com/sourcing/kkultip_detail/110</a>
* <a href="https://www.techopedia.com/definition/24804/enterprise-application-ea">https://www.techopedia.com/definition/24804/enterprise-application-ea</a>
* <a href="https://hyunc87.tistory.com/10">https://hyunc87.tistory.com/10</a>
* <a href="https://ssad.tistory.com/51">https://ssad.tistory.com/51</a>
* <a href="https://m.blog.naver.com/PostView.nhn?blogId=m1nsuk&logNo=221572976740&proxyReferer=https:%2F%2Fwww.google.com%2F">https://m.blog.naver.com/PostView.nhn?blogId=m1nsuk&logNo=221572976740&proxyReferer=https:%2F%2Fwww.google.com%2F</a>   
* <a href="https://hamait.tistory.com/315">https://hamait.tistory.com/315</a>
* <a href="https://freestrokes.tistory.com/79">https://freestrokes.tistory.com/79</a>

감사합니다.

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>