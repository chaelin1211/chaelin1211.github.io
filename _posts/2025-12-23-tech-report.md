---
layout: post
title: "스프링 AOP, 이제 실전에서 제대로 활용해볼 시간!"
subtitle: "복잡한 횡단 관심사, 프록시 패턴으로 우아하게 해결하기"
date: 2025-12-23 00:57:33.730Z +0900
background: '/img/posts/pattern01.jpg'
category: Study
tags: [spring,aop,java,proxy_pattern]
---

안녕하세요, 개발자 여러분! 여러분의 애플리케이션 코드가 비즈니스 로직 외에 반복적인 작업들로 인해 복잡해지는 경험을 해보신 적 있나요? 로깅, 트랜잭션 관리, 보안 검사 등 여러 모듈에 걸쳐 공통적으로 필요한 기능들을 `횡단 관심사(Cross-Cutting Concerns)`라고 부릅니다. 이 문제를 깔끔하게 해결해 줄 스프링 AOP(Aspect-Oriented Programming)에 대해 실전 예제와 함께 자세히 알아보겠습니다.

### 스프링 AOP란 무엇일까요?

AOP는 횡단 관심사를 모듈화하여 핵심 비즈니스 로직과 분리하는 프로그래밍 패러다임입니다. 스프링 프레임워크는 이를 강력하게 지원하며, 주로 프록시 패턴(Proxy Pattern)을 활용하여 동작합니다. 즉, 실제 객체 대신 프록시 객체가 요청을 가로채서 Aspect(횡단 관심사를 모듈화한 단위)에 정의된 로직을 실행한 후 실제 객체의 메서드를 호출하는 방식입니다.

AOP의 주요 개념들은 다음과 같습니다.

*   **Aspect (애스펙트)**: 횡단 관심사를 모듈화한 객체. `@Aspect` 어노테이션으로 정의합니다.
*   **Advice (어드바이스)**: 특정 Join Point에서 Aspect가 수행할 실제 작업. `@Before`, `@After`, `@Around` 등으로 지정합니다.
*   **Join Point (조인 포인트)**: Advice가 적용될 수 있는 지점. 메서드 실행, 객체 초기화 등.
*   **Pointcut (포인트컷)**: Join Point의 특정 부분을 선택하는 표현식. 어떤 메서드에 Advice를 적용할지 결정합니다.
*   **Weaving (위빙)**: Aspect를 애플리케이션의 Join Point에 연결하는 과정. 스프링 AOP는 런타임에 프록시를 통해 위빙합니다.

### 왜 스프링 AOP를 활용해야 할까요?

스프링 AOP는 비즈니스 로직과 횡단 관심사를 분리함으로써 다음과 같은 장점을 제공합니다.

1.  **코드 응집도 향상**: 핵심 로직은 핵심 로직에만 집중하게 됩니다.
2.  **유지보수성 증대**: 횡단 관심사 변경 시 한 곳에서만 수정하면 됩니다.
3.  **코드 중복 제거**: 반복적인 코드를 한 곳에 모아 관리합니다.

가장 흔한 활용 사례는 로깅, 트랜잭션 관리, 권한 체크, 성능 모니터링 등입니다.

### 실전 예제: 메서드 실행 시간 로깅 Aspect 구현하기

이제 스프링 AOP를 활용하여 특정 서비스 메서드의 실행 시간을 측정하고 로깅하는 간단한 Aspect를 구현해봅시다.

먼저, 간단한 서비스 인터페이스와 구현체입니다.

```java
// UserService.java
public interface UserService {
    String getUserName(Long id);
    void createUser(String name);
}

// UserServiceImpl.java
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Override
    public String getUserName(Long id) {
        try {
            Thread.sleep(100); // Simulate some work
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return "User_" + id;
    }

    @Override
    public void createUser(String name) {
        System.out.println("Creating user with name: " + name);
        // ... 실제 사용자 생성 로직
    }
}
```

다음으로, 메서드 실행 시간을 측정하는 Aspect를 정의합니다.

```java
// LoggingAspect.java
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect // 이 클래스가 Aspect임을 나타냅니다.
@Component // 스프링 빈으로 등록하여 관리합니다.
public class LoggingAspect {

    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    // UserServiceImpl의 모든 메서드에 대한 Pointcut을 정의합니다.
    // execution(* com.example.springaop.service.*.*(..)) :
    // - * : 모든 리턴 타입
    // - com.example.springaop.service.* : service 패키지 내의 모든 클래스
    // - *.*(..) : 모든 메서드, 모든 파라미터
    @Pointcut("execution(* com.example.springaop.service.UserServiceImpl.*(..))")
    private void userServiceMethods() {}

    // @Around Advice: 메서드 실행 전후에 로직을 적용합니다.
    @Around("userServiceMethods()")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis(); // 시작 시간 기록

        // 실제 타겟 메서드를 실행합니다.
        Object result = joinPoint.proceed();

        long endTime = System.currentTimeMillis(); // 종료 시간 기록
        long executionTime = endTime - startTime;

        // 메서드 이름과 실행 시간을 로깅합니다.
        logger.info("[AOP] {} executed in {}ms", joinPoint.getSignature().toShortString(), executionTime);

        return result; // 타겟 메서드의 결과를 반환합니다.
    }
}
```

마지막으로, 스프링 애플리케이션에 AOP를 활성화합니다. 보통 `Spring Boot`를 사용한다면 `spring-boot-starter-aop` 의존성을 추가하고 `@EnableAspectJAutoProxy`를 설정 클래스에 추가하는 것으로 충분합니다. (Spring Boot는 대부분 자동 설정됩니다.)

```java
// Application.java (Spring Boot Main Class)
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@SpringBootApplication
@EnableAspectJAutoProxy // AOP 자동 프록시 생성을 활성화합니다.
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

이제 `UserService`의 `getUserName` 메서드를 호출하면 콘솔에 다음과 유사한 로그가 출력될 것입니다.

```
[AOP] UserServiceImpl.getUserName(..) executed in 102ms
```

이 예제를 통해 비즈니스 로직(`UserServiceImpl`)에는 변경 없이, 로깅이라는 횡단 관심사를 `LoggingAspect`라는 별도의 모듈로 분리했음을 알 수 있습니다.

### 결론

스프링 AOP는 애플리케이션의 횡단 관심사를 효과적으로 분리하여 코드의 응집도를 높이고 유지보수성을 향상시키는 강력한 도구입니다. 프록시 기반의 작동 방식을 이해하고 `@Aspect`, `@Pointcut`, 다양한 Advice들을 적절히 활용한다면, 더 깔끔하고 확장 가능한 아키텍처를 구축할 수 있을 것입니다. 오늘 배운 내용을 바탕으로 여러분의 프로젝트에 AOP를 적용해보시길 바랍니다!

<p class = "placeholder">Text by Chaelin & Gemini. Photographs by Chaelin, Unsplash.</p>