---
layout: post
title: "Spring Boot Actuator: 당신의 애플리케이션을 살아 숨 쉬게 하는 눈과 귀"
subtitle: "운영 환경에서 Spring Boot 애플리케이션 모니터링 및 관리를 위한 필수 도구"
date: 2025-11-17 00:55:53.719Z +0900
background: '/img/posts/pattern01.jpg'
category: Study
tags: [spring_boot,actuator,java,monitoring]
---

## 서론: 프로덕션 레디 애플리케이션의 핵심, 모니터링

성공적인 애플리케이션 개발은 코드를 작성하고 배포하는 것 이상을 의미합니다. 특히 운영 환경에서는 애플리케이션이 얼마나 건강하게 동작하는지, 어떤 문제가 발생하고 있는지 실시간으로 파악하는 것이 매우 중요합니다. 이때 필요한 것이 바로 강력한 모니터링 및 관리 도구입니다. Spring Boot 개발자라면 이 문제를 해결해 줄 해답을 이미 손에 쥐고 있습니다. 바로 **Spring Boot Actuator**입니다.

오늘은 Spring Boot Actuator가 무엇인지, 어떻게 활용하여 애플리케이션의 내부를 들여다보고 더욱 안정적으로 운영할 수 있는지 자세히 알아보겠습니다.

## Spring Boot Actuator란 무엇인가?

Spring Boot Actuator는 Spring Boot 애플리케이션에 프로덕션 레디(Production-ready) 기능을 추가해주는 모듈입니다. 이 모듈을 통해 개발자는 애플리케이션의 상태, 메트릭, 정보 등 다양한 내부 데이터를 손쉽게 확인하고 관리할 수 있습니다. 별도의 복잡한 코드를 작성할 필요 없이, Actuator가 제공하는 다양한 엔드포인트(Endpoint)를 통해 애플리케이션의 '심장 박동'을 들을 수 있게 됩니다.

Actuator는 크게 두 가지 방식으로 데이터를 제공합니다:
*   **HTTP 엔드포인트:** 웹 브라우저나 `curl`과 같은 도구를 사용하여 접근할 수 있는 RESTful API 형태입니다.
*   **JMX:** Java Management Extensions를 통해 관리 도구와 연동하여 데이터를 제공합니다.

### Actuator 의존성 추가하기

Spring Boot 프로젝트에 Actuator를 적용하는 것은 매우 간단합니다. `pom.xml` 또는 `build.gradle`에 다음 의존성을 추가하기만 하면 됩니다.

```xml
<!-- Maven -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

```gradle
// Gradle
implementation 'org.springframework.boot:spring-boot-starter-actuator'
```

의존성을 추가하고 애플리케이션을 실행하면, Actuator 엔드포인트가 자동으로 활성화됩니다. 기본적으로 `/actuator` 경로 아래에 다양한 엔드포인트들이 제공됩니다.

## 주요 Actuator 엔드포인트와 그 활용

Actuator는 애플리케이션의 다양한 측면을 모니터링하고 관리하는 데 필요한 여러 엔드포인트를 제공합니다. 몇 가지 핵심적인 엔드포인트를 살펴보겠습니다.

### 1. `/actuator/health`

애플리케이션의 전반적인 건강 상태를 보여줍니다. 데이터베이스 연결 상태, 디스크 공간, 메모리 사용량 등 다양한 컴포넌트의 상태를 집계하여 `UP` 또는 `DOWN`으로 표시합니다. 이는 로드 밸런서나 컨테이너 오케스트레이션 도구(Kubernetes 등)에서 애플리케이션 인스턴스의 가용성을 판단하는 데 중요한 지표로 활용됩니다.

```json
{
    "status": "UP",
    "components": {
        "db": {
            "status": "UP",
            "details": {
                "database": "H2",
                "validationQuery": "isValid()"
            }
        },
        "diskSpace": {
            "status": "UP",
            "details": {
                "total": 250550508544,
                "free": 139170324480,
                "threshold": 10485760
            }
        },
        "ping": {
            "status": "UP"
        }
    }
}
```

### 2. `/actuator/info`

애플리케이션의 일반적인 정보를 제공합니다. 빌드 정보, Git 커밋 정보, 임의로 정의한 사용자 정의 정보 등을 포함할 수 있습니다. 이는 배포된 애플리케이션의 버전을 확인하거나 특정 환경 설정을 검증하는 데 유용합니다.

`application.yml`에 다음과 같이 정보를 추가할 수 있습니다.

```yaml
info:
  app:
    name: My Spring Boot App
    version: 1.0.0
    description: A sample application using Spring Boot Actuator
  git:
    commit: ${git.commit.id.full} # git-commit-id-plugin 사용 시 자동 삽입
```

### 3. `/actuator/metrics`

애플리케이션의 성능 메트릭을 수집하고 제공합니다. JVM 메모리 사용량, CPU 사용량, HTTP 요청 처리 시간, 데이터베이스 풀 통계 등 다양한 수치를 확인할 수 있습니다. 이 데이터는 Prometheus와 같은 시계열 데이터베이스와 연동하여 Grafana와 같은 대시보드에서 시각화하는 데 활용됩니다.

특정 메트릭의 상세 정보를 얻으려면 `/actuator/metrics/{metricName}` 형태로 요청할 수 있습니다. 예를 들어, `system.cpu.usage`를 확인하려면 `/actuator/metrics/system.cpu.usage`로 접근합니다.

### 4. `/actuator/beans`

애플리케이션 컨텍스트에 로드된 모든 Spring Bean들의 목록과 그 의존성을 보여줍니다. 애플리케이션의 구성이 예상대로 동작하는지 확인하거나 특정 Bean의 존재 여부를 디버깅할 때 유용합니다.

### 5. `/actuator/loggers`

애플리케이션의 모든 로거(logger)와 그 레벨을 보여주고, 런타임에 로거 레벨을 변경할 수 있게 해줍니다. 특정 모듈의 로그를 일시적으로 `DEBUG` 또는 `TRACE` 레벨로 높여 문제를 진단할 때 매우 편리합니다.

### 6. `/actuator/threaddump`

현재 애플리케이션에서 실행 중인 모든 스레드의 덤프를 생성합니다. 교착 상태(deadlock)를 진단하거나 특정 스레드가 어떤 작업을 수행하고 있는지 분석하는 데 사용됩니다.

## Actuator 엔드포인트 노출 및 보안 설정

기본적으로 Spring Boot Actuator는 `/health`와 `/info` 엔드포인트만 웹으로 노출합니다. 이는 보안상의 이유 때문입니다. 모든 엔드포인트를 노출하려면 `application.yml`에 다음과 같은 설정을 추가해야 합니다.

```yaml
management:
  endpoints:
    web:
      exposure:
        include: "*" # 모든 엔드포인트를 노출
        # include: "health,info,metrics" # 특정 엔드포인트만 노출
  endpoint:
    health:
      show-details: always # health 엔드포인트에서 상세 정보를 항상 표시
```

**주의:** 프로덕션 환경에서는 모든 엔드포인트를 외부에 노출하는 것은 매우 위험할 수 있습니다. 반드시 적절한 인증 및 권한 부여 메커니즘을 통해 엔드포인트에 대한 접근을 제한해야 합니다. `spring-boot-starter-security`를 함께 사용하여 Actuator 엔드포인트에 대한 접근을 보호하는 것이 권장됩니다.

## 결론: 안정적인 서비스 운영을 위한 필수 도구

Spring Boot Actuator는 개발자가 애플리케이션의 내부 상태를 쉽게 파악하고, 성능을 모니터링하며, 문제가 발생했을 때 신속하게 진단할 수 있도록 돕는 강력한 도구입니다. 단순히 코드를 실행하는 것을 넘어, 애플리케이션을 '관리 가능한' 상태로 만들어준다는 점에서 그 가치는 매우 큽니다.

오늘 살펴본 내용을 바탕으로 여러분의 Spring Boot 애플리케이션에 Actuator를 적극적으로 도입하고 활용하여 더욱 견고하고 안정적인 서비스를 구축하시길 바랍니다. Actuator와 함께라면 여러분의 애플리케이션은 항상 최적의 상태를 유지할 것입니다.

<p class = "placeholder">Text by Chaelin & Gemini. Photographs by Chaelin, Unsplash.</p>