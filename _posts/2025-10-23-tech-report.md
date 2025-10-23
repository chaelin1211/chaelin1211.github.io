---
layout: post
title: "자바 GC 튜닝: 애플리케이션 성능 최적화의 핵심 전략"
subtitle: "JVM 가비지 컬렉션 깊이 이해하고 실전 튜닝으로 서비스 안정성 확보하기"
date: 2025-10-23 00:52:31.646Z +0900
background: '/img/posts/pattern01.jpg'
category: Study
tags: [java,jvm,garbage collection,performance]
---

## 서론: 왜 자바 GC 튜닝이 중요한가?

자바 가상 머신(JVM) 위에서 동작하는 애플리케이션은 메모리 관리를 직접 하지 않아도 되기에 개발 생산성이 높습니다. 하지만 이 편리함 뒤에는 JVM의 가비지 컬렉터(Garbage Collector, GC)가 숨어 있습니다. GC는 더 이상 사용되지 않는 객체를 자동으로 회수하여 메모리를 확보하는 역할을 수행하지만, 이 과정이 애플리케이션의 성능에 병목이 되기도 합니다.

특히 대규모 트래픽을 처리하거나 낮은 지연 시간을 요구하는 시스템에서는 GC의 미묘한 동작 하나하나가 사용자 경험이나 서비스 안정성에 지대한 영향을 미칠 수 있습니다. 따라서 자바 개발자에게 GC 튜닝은 선택이 아닌 필수적인 역량입니다. 이 글에서는 JVM의 가비지 컬렉션 원리를 간단히 살펴보고, 실제 애플리케이션 성능을 향상시키기 위한 GC 튜닝 전략과 방법을 제시합니다.

## 본문: JVM 가비지 컬렉션 이해와 실전 튜닝 가이드

### 1. JVM 힙(Heap) 메모리와 가비지 컬렉션 기본

JVM 힙 메모리는 크게 두 영역으로 나뉩니다:

*   **Young Generation (新生代)**: 새로 생성된 객체가 할당되는 공간입니다. Eden 영역과 두 개의 Survivor 영역(S0, S1)으로 구성됩니다. 대부분의 객체는 여기서 빠르게 생성되고 소멸됩니다. 여기서 발생하는 GC를 Minor GC라고 부릅니다.
*   **Old Generation (老年代)**: Young Generation에서 오랫동안 살아남은 객체들이 이동하는 공간입니다. 상대적으로 수명이 긴 객체들이 여기에 할당됩니다. 여기서 발생하는 GC를 Major GC 또는 Full GC라고 부르며, 일반적으로 애플리케이션에 미치는 영향이 큽니다.

가비지 컬렉션의 주된 목표는 'Stop-The-World (STW)' 시간을 최소화하는 것입니다. STW는 GC가 동작하는 동안 애플리케이션 스레드가 모두 멈추는 현상을 의미하며, 이 시간이 길어지면 서비스 지연이나 응답 없음 현상이 발생할 수 있습니다.

### 2. 주요 GC 알고리즘의 특징

자바는 다양한 GC 알고리즘을 제공하며, 각기 다른 특성을 가집니다.

*   **Serial GC**: 단일 스레드로 GC를 수행합니다. 가장 단순하며 자원 소모가 적어 클라이언트 환경이나 소규모 애플리케이션에 적합합니다. (Java 8까지 기본)
*   **Parallel GC**: 다수의 스레드로 Young Generation GC를 병렬 처리하여 처리량(Throughput)을 높입니다. 대규모 서버 환경에서 처리량 극대화가 목표일 때 사용됩니다. (Java 8 서버 기본)
*   **Concurrent Mark Sweep (CMS) GC**: STW 시간을 최소화하는 데 중점을 둡니다. Old Generation을 GC할 때 애플리케이션 스레드와 동시에(Concurrent) 동작하여 STW 시간을 줄이지만, CPU 자원을 더 사용하고 메모리 단편화 문제를 일으킬 수 있습니다.
*   **G1 (Garbage-First) GC**: Java 9부터 기본 GC로 채택되었습니다. Region 기반으로 힙을 관리하며, 목표 응답 시간을 설정하여 STW 시간을 제어하는 데 강점이 있습니다. 대규모 힙에서 효율적입니다.
*   **ZGC / Shenandoah GC**: 매우 짧은 STW 시간을 목표로 합니다 (일반적으로 10ms 미만). 최신 GC 알고리즘으로, 매우 큰 힙(수 TB)에서도 낮은 지연 시간을 제공합니다. Java 11부터 정식 도입되었습니다.

### 3. 실전 GC 튜닝 가이드

GC 튜닝의 핵심은 애플리케이션의 특성(처리량 vs. 지연 시간)을 이해하고, 모니터링을 통해 병목을 찾아 적절한 GC 알고리즘과 옵션을 적용하는 것입니다.

#### 3.1. GC 로그 분석 및 모니터링

튜닝의 시작은 현황 파악입니다. GC 로그를 통해 어떤 GC가 얼마나 자주 발생하고, STW 시간은 어느 정도인지 파악해야 합니다.

```java
// GC 로그 활성화 (Java 9 이후)
java -Xlog:gc*=info,heap*=debug:file=gc.log ...
// Java 8 이하
java -XX:+PrintGCDetails -XX:+PrintGCDateStamps -Xloggc:gc.log ...
```

*   `jstat -gc <pid> 1000`: 실시간으로 GC 통계를 확인합니다.
*   `jvisualvm`: 시각적으로 JVM의 상태(힙, GC 활동 등)를 모니터링합니다.
*   GCViewer: GC 로그 파일을 분석하여 그래프 형태로 시각화해줍니다.

#### 3.2. 힙 메모리 사이즈 조정 (`-Xms`, `-Xmx`)

가장 기본적인 튜닝입니다. 애플리케이션이 사용하는 메모리 양에 따라 힙 크기를 적절히 설정해야 합니다.

*   `-Xms<size>`: JVM 시작 시 할당되는 초기 힙 메모리 크기.
*   `-Xmx<size>`: JVM이 사용할 수 있는 최대 힙 메모리 크기.

일반적으로 `-Xms`와 `-Xmx`를 동일하게 설정하여 힙 크기 변경으로 인한 오버헤드를 줄이는 것이 좋습니다. 너무 작은 힙은 잦은 GC를 유발하고, 너무 큰 힙은 GC 한 번에 걸리는 시간을 길게 만들 수 있습니다.

```java
java -Xms4g -Xmx4g ...
```

#### 3.3. 적절한 GC 알고리즘 선택

애플리케이션의 목표에 따라 GC 알고리즘을 선택합니다.

*   **낮은 지연 시간(Low Latency)이 중요**: G1 GC (Java 9 이상 기본), ZGC, Shenandoah GC
    ```java
    // G1 GC 사용 (Java 9+ 기본이지만 명시 가능)
    java -XX:+UseG1GC ...
    // ZGC 사용 (Java 11+)
    java -XX:+UseZGC ...
    ```
*   **높은 처리량(High Throughput)이 중요**: Parallel GC (Java 8 서버 기본)
    ```java
    java -XX:+UseParallelGC ...
    ```

#### 3.4. Young Generation 크기 조정 (`-Xmn` 또는 `-XX:NewRatio`)

Young Generation은 객체가 빠르게 생성되고 소멸되는 공간이므로, 이 영역이 너무 작으면 객체가 빠르게 Old Generation으로 이동하여 Major GC를 더 자주 유발할 수 있습니다. 반대로 너무 크면 Minor GC 한 번의 시간이 길어집니다.

*   `-Xmn<size>`: Young Generation의 크기를 직접 지정합니다.
*   `-XX:NewRatio=<value>`: Old Generation과 Young Generation의 비율을 `1:<value>`로 설정합니다. (예: `-XX:NewRatio=2`는 Old : Young = 2 : 1)

#### 3.5. 주요 GC 옵션 튜닝

*   **`MaxGCPauseMillis` (G1, ZGC 등)**: GC 일시 정지 시간의 목표치를 밀리초 단위로 설정합니다. 이 값을 낮게 설정하면 GC가 더 자주 발생할 수 있지만, 한 번의 STW 시간은 짧아집니다.
    ```java
    java -XX:+UseG1GC -XX:MaxGCPauseMillis=200 ... // G1 GC의 목표 STW 시간 200ms
    ```
*   **`InitiatingHeapOccupancyPercent` (G1 GC)**: G1 GC가 concurrent cycle을 시작하는 힙 점유율(%)을 지정합니다. 이 값이 너무 높으면 Full GC로 이어질 가능성이 있고, 너무 낮으면 너무 자주 concurrent GC가 발생할 수 있습니다.
    ```java
    java -XX:+UseG1GC -XX:InitiatingHeapOccupancyPercent=70 ... // 힙 70% 점유 시 G1 GC 시작
    ```

#### 3.6. 애플리케이션 레벨 최적화

GC 튜닝은 JVM 옵션 조정뿐만 아니라 애플리케이션 코드 레벨에서의 최적화도 중요합니다.

*   **객체 생성 최소화**: 불필요한 객체 생성을 줄이고, String 객체의 잦은 생성은 `StringBuilder`나 `StringBuffer`를 사용합니다.
*   **객체 재활용 (Object Pooling)**: 재사용 가능한 객체를 미리 만들어두고 필요할 때 빌려 쓰고 반환하는 패턴을 적용합니다.
*   **적절한 자료구조 사용**: 캐시 구현 시 `SoftReference`나 `WeakReference`를 활용하여 메모리 부족 시 GC가 객체를 회수하도록 유도합니다.

## 결론: 지속적인 모니터링과 분석이 핵심

자바 GC 튜닝은 마법 같은 일회성 설정이 아닙니다. 애플리케이션의 생애 주기 동안 지속적인 모니터링, 분석, 그리고 최적화 작업을 통해 이루어지는 과정입니다. 각 애플리케이션의 특성과 요구사항은 다르므로, 벤치마크 테스트와 실제 운영 환경에서의 GC 로그 분석을 통해 최적의 JVM 옵션을 찾아나가야 합니다.

최신 JVM 버전은 G1 GC를 기본으로 제공하며, ZGC, Shenandoah와 같은 혁신적인 GC 알고리즘들이 매우 낮은 지연 시간을 가능하게 합니다. 이러한 기술 발전을 적극 활용하면서도, 기본적인 힙 구조 이해와 GC 메커니즘에 대한 깊이 있는 통찰이 병행될 때 비로소 우리는 애플리케이션의 잠재력을 최대한으로 끌어낼 수 있을 것입니다. GC 튜닝은 복잡할 수 있지만, 그만큼 애플리케이션 성능 향상에 큰 기여를 할 수 있는 강력한 도구임을 기억합시다.

<p class = "placeholder">Text by Chaelin & Gemini. Photographs by Chaelin, Unsplash.</p>