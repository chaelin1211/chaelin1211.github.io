---
layout: post
title: "Spring Boot AOP, 핵심을 꿰뚫는 강력한 기법"
subtitle: "관점 지향 프로그래밍(AOP)으로 더욱 유연하고 확장 가능한 애플리케이션 구축하기"
date: 2025-11-25 00:53:30.690Z +0900
background: '/img/posts/pattern01.jpg'
category: Study
tags: [spring,spring_boot,java,aop]
---

## 서론

현대 웹 애플리케이션 개발에서 코드를 깔끔하게 유지하고 모듈성을 높이는 것은 매우 중요합니다. Spring Boot는 이러한 목표 달성을 위해 다양한 도구를 제공하며, 그중 관점 지향 프로그래밍(AOP)은 횡단 관심사(Cross-Cutting Concerns)를 효과적으로 분리하는 강력한 메커니즘입니다. 오늘은 Spring Boot에서 AOP가 어떻게 작동하며, 실제 프로젝트에 어떻게 적용할 수 있는지 심층적으로 살펴보겠습니다.

## 본문

### AOP란 무엇인가?

AOP는 로깅, 보안, 트랜잭션 관리와 같이 여러 모듈에 걸쳐 공통적으로 발생하는 기능들을 핵심 비즈니스 로직과 분리하여 관리할 수 있게 해주는 프로그래밍 패러다임입니다. 이를 통해 코드의 응집도를 높이고 유지보수성을 향상시킬 수 있습니다.

Spring AOP는 프록시 기반으로 동작하며, 런타임에 동적으로 Advice를 적용합니다. 주요 개념으로는 다음과 같습니다:

*   **Aspect (애스펙트)**: 횡단 관심사를 모듈화한 객체입니다. 여러 Join Point에 걸쳐 적용될 Advice와 Pointcut의 조합을 의미합니다.
*   **Join Point (조인 포인트)**: Advice를 적용할 수 있는 프로그램 실행 지점(메서드 호출, 필드 접근 등)입니다. Spring AOP는 메서드 실행에만 Join Point를 제공합니다.
*   **Pointcut (포인트컷)**: Join Point를 선택하기 위한 표현식입니다. 특정 패턴에 맞는 Join Point들을 필터링합니다.
*   **Advice (어드바이스)**: 특정 Join Point에서 실행될 코드입니다. `@Before`, `@After`, `@Around` 등 다양한 타입이 있습니다.

### Spring Boot AOP 구현하기

Spring Boot에서 AOP를 구현하는 것은 매우 간단합니다. 먼저 `spring-boot-starter-aop` 의존성을 `pom.xml`에 추가해야 합니다.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```

이제 간단한 로깅 AOP를 구현하여 메서드 실행 시간을 측정해 보겠습니다.

#### 1. Aspect 정의

```java
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect // 이 클래스가 Aspect임을 선언
@Component // 스프링 빈으로 등록
public class LoggingAspect {

    private static final Logger log = LoggerFactory.getLogger(LoggingAspect.class);

    // com.example.service 패키지 내 모든 클래스의 모든 메서드 실행을 Pointcut으로 지정
    @Pointcut("execution(* com.example.service.*.*(..))")
    public void serviceMethods() {} // Pointcut 시그니처

    @Around("serviceMethods()") // serviceMethods() Pointcut에 Around Advice 적용
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        String methodName = joinPoint.getSignature().toShortString();
        log.info("--> Starting method: {}", methodName);

        Object result = joinPoint.proceed(); // 대상 메서드 실행

        long endTime = System.currentTimeMillis();
        long executionTime = endTime - startTime;
        log.info("<-- Finished method: {} in {}ms", methodName, executionTime);

        return result;
    }
}
```

위 코드에서 `@Pointcut("execution(* com.example.service.*.*(..))")`는 `com.example.service` 패키지 내 모든 클래스의 모든 메서드에 대해 Advice를 적용하겠다는 의미입니다. `@Around`는 대상 메서드 실행 전후에 로직을 삽입하여, 메서드 실행 시간 측정을 가능하게 합니다.

#### 2. 대상 서비스 정의

이제 `UserService`를 하나 정의하고 이 AOP가 어떻게 적용되는지 확인해 봅시다.

```java
import org.springframework.stereotype.Service;

@Service
public class UserService {

    public String createUser(String name) {
        // 실제 사용자 생성 비즈니스 로직
        try {
            Thread.sleep(150); // 작업 시뮬레이션
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt(); // 인터럽트 상태 복원
            throw new RuntimeException("User creation interrupted", e);
        }
        return "User " + name + " created successfully.";
    }

    public String getUserInfo(String userId) {
        // 사용자 정보 조회 로직
        try {
            Thread.sleep(50); // 작업 시뮬레이션
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Getting user info interrupted", e);
        }
        return "Info for user: " + userId;
    }
}
```

#### 3. 결과 확인

`UserService`의 `createUser`나 `getUserInfo` 메서드를 호출하면, `LoggingAspect`가 자동으로 실행되어 메서드의 시작과 종료, 그리고 실행 시간을 로그로 남기게 됩니다. 핵심 비즈니스 로직인 `UserService`의 메서드에서는 로깅에 대한 코드가 전혀 없죠? 이것이 바로 AOP의 힘입니다.

콘솔 출력 예시:

```
INFO com.example.aspect.LoggingAspect - --> Starting method: UserService.createUser(..)
INFO com.example.aspect.LoggingAspect - <-- Finished method: UserService.createUser(..) in 152ms
INFO com.example.aspect.LoggingAspect - --> Starting method: UserService.getUserInfo(..)
INFO com.example.aspect.LoggingAspect - <-- Finished method: UserService.getUserInfo(..) in 51ms
```

## 결론

Spring Boot AOP는 횡단 관심사를 효과적으로 분리하여, 비즈니스 로직에 집중할 수 있도록 돕는 강력한 도구입니다. 이를 통해 더 깔끔하고, 유지보수가 용이하며, 확장 가능한 애플리케이션을 구축할 수 있습니다. 로깅, 보안, 트랜잭션, 캐싱 등 다양한 영역에서 AOP를 활용하여 여러분의 Spring Boot 프로젝트를 한 단계 업그레이드해 보세요.

<p class = "placeholder">Text by Chaelin & Gemini. Photographs by Chaelin, Unsplash.</p>