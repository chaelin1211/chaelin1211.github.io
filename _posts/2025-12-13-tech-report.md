---
layout: post
title: "스프링 AOP, 실전에서 강력하게 활용하기"
subtitle: "애플리케이션의 횡단 관심사, AOP로 깔끔하게 분리하기"
date: 2025-12-13 00:54:15.184Z +0900
background: '/img/posts/pattern01.jpg'
category: Study
tags: [spring,aop,java]
---

## 서론: 횡단 관심사, 당신의 코드를 어지럽히고 있나요?

대부분의 엔터프라이즈 애플리케이션 개발에서, 우리는 로깅, 보안, 트랜잭션 관리와 같은 기능들이 여러 모듈과 계층에 걸쳐 반복적으로 나타나는 것을 경험합니다. 이러한 기능들은 비즈니스 로직과는 직접적인 관련이 없지만, 애플리케이션의 견고함과 안정성을 위해 필수적입니다. 우리는 이것들을 '횡단 관심사(Cross-cutting Concerns)'라고 부릅니다.

문제는 이러한 횡단 관심사들이 핵심 비즈니스 로직 코드와 뒤섞이면서 코드의 가독성을 해치고, 유지보수를 어렵게 만든다는 점입니다. 만약 로깅 정책을 변경해야 한다면, 관련된 모든 파일을 찾아 수정해야 하는 악몽 같은 상황이 발생할 수도 있습니다.

이러한 문제에 대한 우아한 해결책이 바로 **AOP(Aspect-Oriented Programming)**, 즉 관점 지향 프로그래밍입니다. 그리고 자바 개발자에게 AOP는 **스프링 AOP**를 통해 가장 강력하고 실용적인 형태로 제공됩니다. 오늘은 스프링 AOP가 무엇이며, 실제 프로젝트에서 어떻게 활용될 수 있는지 알아보겠습니다.

---

## 본문: 스프링 AOP의 핵심 개념과 실전 활용

스프링 AOP는 프록시 기반으로 동작하며, 개발자가 비즈니스 로직과 횡단 관심사를 명확히 분리할 수 있도록 돕습니다. 이를 통해 코드의 모듈성과 재사용성을 극대화할 수 있습니다.

### 스프링 AOP의 주요 용어

실전 예시를 살펴보기 전에, 스프링 AOP의 핵심 용어들을 간단히 정리해 봅시다.

*   **Aspect (애스펙트)**: 횡단 관심사를 모듈화한 단위입니다. 로깅 애스펙트, 보안 애스펙트처럼 특정 관심사를 구현하는 클래스입니다. `@Aspect` 어노테이션으로 정의합니다.
*   **Advice (어드바이스)**: 애스펙트가 '무엇'을 '언제' 수행할지를 정의합니다.
    *   `@Before`: 메서드 실행 전
    *   `@AfterReturning`: 메서드 성공적 반환 후
    *   `@AfterThrowing`: 예외 발생 후
    *   `@After`: 메서드 실행 완료 후 (성공/실패 무관)
    *   `@Around`: 메서드 실행 전후를 모두 제어하며, 가장 강력한 어드바이스입니다.
*   **Join Point (조인 포인트)**: 어드바이스가 적용될 수 있는 애플리케이션 실행 지점(예: 메서드 호출, 필드 접근, 객체 생성 등)입니다. 스프링 AOP는 메서드 실행 조인 포인트만 지원합니다.
*   **Pointcut (포인트컷)**: 조인 포인트 중에서 어드바이스를 '어디'에 적용할지 정의하는 표현식입니다. 특정 메서드 패턴이나 클래스 패턴을 지정합니다.

### 실전 예제: 메서드 실행 시간 측정 로깅

애플리케이션의 성능을 모니터링하기 위해 각 메서드의 실행 시간을 측정하는 것은 흔한 횡단 관심사입니다. 스프링 AOP를 사용하여 이를 깔끔하게 구현해봅시다.

먼저, 스프링 부트 프로젝트에서 AOP를 사용하려면 `spring-boot-starter-aop` 의존성을 추가해야 합니다.

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```

그리고 `@EnableAspectJAutoProxy` 어노테이션을 설정 클래스에 추가하여 AOP 자동 프록시 생성을 활성화합니다. 스프링 부트는 보통 이 설정을 자동으로 해줍니다.

```java
// Application.java 또는 별도의 Configuration 클래스
@SpringBootApplication
@EnableAspectJAutoProxy // 보통 Spring Boot에서는 명시적으로 추가하지 않아도 됩니다.
public class YourApplication {
    public static void main(String[] args) {
        SpringApplication.run(YourApplication.class, args);
    }
}
```

이제, 메서드 실행 시간을 측정하는 `PerformanceAspect`를 정의하겠습니다.

```java
// src/main/java/com/example/aop/aspect/PerformanceAspect.java
package com.example.aop.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect // 이 클래스가 Aspect임을 나타냅니다.
@Component // 스프링 빈으로 등록하여 관리합니다.
public class PerformanceAspect {

    private static final Logger log = LoggerFactory.getLogger(PerformanceAspect.class);

    // com.example.aop.service 패키지 및 하위 패키지에 있는 모든 Public 메서드에 적용되는 Pointcut 정의
    @Pointcut("execution(* com.example.aop.service.*.*(..))")
    public void serviceMethods() {}

    // serviceMethods 포인트컷에 Around 어드바이스 적용
    @Around("serviceMethods()")
    public Object measurePerformance(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis(); // 시작 시간 기록

        try {
            // 실제 타겟 메서드 실행
            Object result = joinPoint.proceed();
            return result;
        } finally {
            long endTime = System.currentTimeMillis(); // 종료 시간 기록
            long executionTime = endTime - startTime;

            // 메서드 이름과 실행 시간 로깅
            log.info("메서드 '{}' 실행 시간: {}ms", joinPoint.getSignature().toShortString(), executionTime);
        }
    }
}
```

그리고 이 애스펙트가 적용될 서비스 클래스를 생성합니다.

```java
// src/main/java/com/example/aop/service/MyService.java
package com.example.aop.service;

import org.springframework.stereotype.Service;

@Service
public class MyService {

    public String doSomething(String input) {
        try {
            Thread.sleep(100); // 작업 시뮬레이션
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        System.out.println("MyService.doSomething() 실행 중: " + input);
        return "Processed: " + input;
    }

    public void doAnotherThing() {
        try {
            Thread.sleep(50); // 또 다른 작업 시뮬레이션
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        System.out.println("MyService.doAnotherThing() 실행 중");
    }
}
```

이제 `MyService`의 `doSomething`이나 `doAnotherThing` 메서드를 호출하면, `PerformanceAspect`의 `measurePerformance` 어드바이스가 자동으로 실행되어 해당 메서드의 실행 시간을 로깅할 것입니다. 이로써 비즈니스 로직에 성능 측정 코드를 일일이 추가하지 않고도, 횡단 관심사를 효과적으로 분리하고 관리할 수 있게 됩니다.

---

## 결론: AOP, 우아한 코드 분리의 예술

스프링 AOP는 횡단 관심사를 비즈니스 로직으로부터 분리하여 코드의 모듈성, 재사용성, 그리고 유지보수성을 크게 향상시키는 강력한 도구입니다. 로깅, 보안, 트랜잭션, 성능 측정 등 애플리케이션 전반에 걸쳐 적용되어야 하는 기능들을 깔끔하게 '관점'으로 분리함으로써, 개발자는 핵심 비즈니스 로직에만 집중할 수 있게 됩니다.

물론 AOP를 과도하게 사용하면 코드의 흐름을 추적하기 어려워질 수도 있으므로, 신중하게 필요한 곳에만 적용하는 지혜가 필요합니다. 하지만 올바르게 사용한다면, 스프링 AOP는 당신의 애플리케이션을 더욱 견고하고 관리하기 쉽게 만들어 줄 것입니다. 지금 바로 당신의 프로젝트에 AOP를 적용해보고, 우아한 코드 분리의 아름다움을 경험해 보세요!

<p class = "placeholder">Text by Chaelin & Gemini. Photographs by Chaelin, Unsplash.</p>