---
layout: post
title: "스프링 AOP, 핵심 로직과 부가 기능 분리하기: 깔끔한 코드의 비결"
subtitle: "Aspect-Oriented Programming으로 유지보수성과 확장성을 높이는 방법"
date: 2025-12-31 00:59:16.821Z +0900
background: '/img/posts/pattern01.jpg'
category: Study
tags: [spring,aop,java]
---

## 서론

애플리케이션을 개발하다 보면 여러 모듈에 걸쳐 반복적으로 적용해야 하는 기능들이 있습니다. 로깅, 보안, 트랜잭션 관리 등이 대표적인 예시죠. 이러한 기능들은 비즈니스 로직과 직접적인 관련이 없음에도 불구하고 코드 곳곳에 흩어져 있어, 핵심 로직의 가독성을 해치고 유지보수를 어렵게 만듭니다. 스프링 AOP(Aspect-Oriented Programming, 관점 지향 프로그래밍)는 이러한 "횡단 관심사(Cross-cutting Concerns)"를 깔끔하게 분리하여 코드의 모듈성, 가독성, 유지보수성을 극대화하는 강력한 방법론입니다. 이번 포스팅에서는 스프링 AOP가 무엇인지, 어떻게 적용하는지에 대해 알아보겠습니다.

## 본문

### AOP란 무엇인가?

AOP는 흩어진 부가 기능(횡단 관심사)들을 `관점(Aspect)`이라는 별도의 모듈로 분리하여 관리하는 프로그래밍 패러다임입니다. 이를 통해 핵심 비즈니스 로직은 자신의 역할에만 집중하고, 부가 기능은 필요한 시점에 자동으로 적용되도록 할 수 있습니다. 스프링 AOP는 프록시 기반으로 동작하며, 주로 메서드 실행 시점을 가로채서 부가 기능을 주입하는 방식으로 구현됩니다.

핵심 용어는 다음과 같습니다.

*   **Aspect (애스펙트)**: 횡단 관심사를 모듈화한 단위입니다. `@Aspect` 어노테이션으로 정의하며, 어드바이스(Advice)와 포인트컷(Pointcut)의 조합으로 이루어집니다.
*   **Advice (어드바이스)**: 애스펙트가 특정 조인 포인트에서 수행할 실제 동작을 의미합니다. `@Before`, `@After`, `@Around` 등으로 정의합니다.
*   **Join Point (조인 포인트)**: 어드바이스를 적용할 수 있는 프로그램 실행 지점입니다. 메서드 실행, 객체 생성 등 다양한 지점이 될 수 있지만, 스프링 AOP에서는 주로 메서드 실행 지점만 지원합니다.
*   **Pointcut (포인트컷)**: 조인 포인트 중에서 어드바이스를 적용할 실제 지점을 필터링하는 표현식입니다. `execution(* com.example..*.*(..))`와 같이 정규식 형태로 정의합니다.
*   **Weaving (위빙)**: 애스펙트를 핵심 로직에 적용하는 과정입니다. 스프링 AOP는 런타임에 프록시 객체를 생성하여 위빙을 수행합니다.

### 스프링 AOP 적용하기

이제 간단한 로깅 기능을 AOP로 구현하는 예제를 통해 스프링 AOP의 동작 방식을 살펴보겠습니다.

먼저, 간단한 서비스 클래스를 정의합니다.

```java
// src/main/java/com/example/service/MyService.java
package com.example.service;

import org.springframework.stereotype.Service;

@Service
public class MyService {

    public String performTask(String data) {
        System.out.println("[Service] Executing performTask with data: " + data);
        if (data.contains("error")) {
            throw new IllegalArgumentException("Error data detected!");
        }
        return "Processed: " + data.toUpperCase();
    }

    public void doSomethingElse() {
        System.out.println("[Service] Executing doSomethingElse.");
    }
}
```

다음으로, 로깅 기능을 담당할 애스펙트를 생성합니다.

```java
// src/main/java/com/example/aop/LoggingAspect.java
package com.example.aop;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect // 이 클래스가 애스펙트임을 선언
@Component // 스프링 빈으로 등록
public class LoggingAspect {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    // com.example.service 패키지 내의 모든 클래스, 모든 메서드에 대한 포인트컷 정의
    @Pointcut("execution(* com.example.service.*.*(..))")
    public void serviceMethods() {}

    // serviceMethods() 포인트컷이 지정하는 메서드 실행 전
    @Before("serviceMethods()")
    public void logBefore(JoinPoint joinPoint) {
        logger.info("----> [Before] Method: {} arguments: {}", 
                    joinPoint.getSignature().toShortString(), 
                    joinPoint.getArgs());
    }

    // serviceMethods() 포인트컷이 지정하는 메서드 성공적 실행 후 (리턴 값 있을 때)
    @AfterReturning(pointcut = "serviceMethods()", returning = "result")
    public void logAfterReturning(JoinPoint joinPoint, Object result) {
        logger.info("<---- [AfterReturning] Method: {}, result: {}", 
                    joinPoint.getSignature().toShortString(), result);
    }

    // serviceMethods() 포인트컷이 지정하는 메서드 실행 후 (예외 발생 여부와 관계없이)
    @After("serviceMethods()")
    public void logAfter(JoinPoint joinPoint) {
        logger.info("----- [After] Method: {} finished.", 
                    joinPoint.getSignature().toShortString());
    }

    // serviceMethods() 포인트컷이 지정하는 메서드 실행 중 예외 발생 시
    @AfterThrowing(pointcut = "serviceMethods()", throwing = "ex")
    public void logAfterThrowing(JoinPoint joinPoint, Throwable ex) {
        logger.error("!!!!! [AfterThrowing] Method: {}, exception: {}", 
                     joinPoint.getSignature().toShortString(), ex.getMessage());
    }

    // serviceMethods() 포인트컷이 지정하는 메서드 실행 전/후를 모두 처리 (성능 측정 등에 유용)
    @Around("serviceMethods()")
    public Object logAround(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        String methodName = joinPoint.getSignature().toShortString();
        logger.info(">>>>> [Around] Entering method: {}", methodName);

        Object result = null;
        try {
            result = joinPoint.proceed(); // 원본 메서드 실행
        } catch (Throwable e) {
            logger.error("<<<<< [Around] Exception in method: {}, error: {}", methodName, e.getMessage());
            throw e;
        } finally {
            long endTime = System.currentTimeMillis();
            logger.info("<<<<< [Around] Exiting method: {}, execution time: {}ms", methodName, (endTime - startTime));
        }
        return result;
    }
}
```

마지막으로, 스프링 부트 애플리케이션에 AOP를 활성화해야 합니다. 보통 `@SpringBootApplication`에 `@EnableAspectJAutoProxy` 어노테이션을 추가하거나, 설정 파일에 `<aop:aspectj-autoproxy/>`를 선언하여 활성화합니다. 스프링 부트에서는 `spring-boot-starter-aop` 의존성만 추가하면 별도의 설정 없이 자동으로 활성화되는 경우가 많습니다.

```java
// src/main/java/com/example/DemoApplication.java
package com.example;

import com.example.service.MyService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@SpringBootApplication
@EnableAspectJAutoProxy // AOP 자동 프록시 생성 활성화 (starter-aop 포함 시 생략 가능)
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @Bean
    public CommandLineRunner run(MyService myService) {
        return args -> {
            System.out.println("\n--- Calling performTask normally ---");
            myService.performTask("Hello AOP");

            System.out.println("\n--- Calling doSomethingElse ---");
            myService.doSomethingElse();

            System.out.println("\n--- Calling performTask with error ---");
            try {
                myService.performTask("contains error data");
            } catch (IllegalArgumentException e) {
                System.out.println("Caught expected exception: " + e.getMessage());
            }
        };
    }
}
```

위 코드를 실행하면 `MyService`의 메서드가 호출될 때마다 `LoggingAspect`에 정의된 로깅 어드바이스들이 자동으로 실행되는 것을 확인할 수 있습니다.

## 결론

스프링 AOP는 핵심 비즈니스 로직과 횡단 관심사를 명확하게 분리하여 코드의 모듈성을 높이고, 유지보수성을 크게 향상시킵니다. 로깅, 보안, 트랜잭션 관리 등 반복적인 부가 기능들을 애스펙트 하나로 관리함으로써 개발자는 핵심 기능 구현에 더욱 집중할 수 있게 됩니다. 깔끔하고 확장 가능한 아키텍처를 구축하고자 한다면 스프링 AOP는 필수적인 도구입니다. 여러분의 프로젝트에도 AOP를 적용하여 더욱 견고하고 관리하기 쉬운 애플리케이션을 만들어 보세요!

<p class = "placeholder">Text by Chaelin & Gemini. Photographs by Chaelin, Unsplash.</p>