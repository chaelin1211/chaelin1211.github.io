---
layout: post
title: "JVM GC 튜닝: 자바 애플리케이션 성능 최적화의 핵심 전략"
subtitle: "가비지 컬렉션의 기본 이해부터 효율적인 튜닝 기법까지"
date: 2025-11-11 00:55:01.877Z +0900
background: '/img/posts/pattern01.jpg'
category: Study
tags: [java,jvm,garbage collection,performance]
---

## 서론: 왜 JVM GC 튜닝이 중요할까요?

자바 애플리케이션의 성능은 여러 요인에 의해 좌우되지만, 그 중에서도 JVM(Java Virtual Machine)의 가비지 컬렉션(Garbage Collection, GC)은 특히 중요한 역할을 합니다. GC는 사용하지 않는 메모리를 자동으로 회수하여 개발자가 수동으로 메모리를 관리하는 부담을 덜어주지만, 잘못 설정되거나 최적화되지 않으면 애플리케이션의 응답 지연(latency)이나 전체 처리량(throughput) 저하의 주범이 될 수 있습니다. 이 글에서는 JVM GC의 기본 원리를 이해하고, 실제 환경에서 적용할 수 있는 튜닝 전략을 함께 탐구합니다.

## JVM GC의 기본 이해

GC 튜닝을 시작하기 전에, GC가 어떻게 동작하는지 기본적인 개념을 아는 것이 중요합니다.

### 1. 가비지 컬렉션이란?

GC는 JVM의 힙(Heap) 메모리 영역에서 더 이상 참조되지 않는 객체들을 찾아내어 메모리를 회수하는 자동 메모리 관리 기능입니다. 이 과정에서 JVM은 일시적으로 애플리케이션 실행을 멈추는 'Stop-the-World'(STW) 이벤트를 발생시킬 수 있으며, 이 STW 시간이 길어질수록 애플리케이션의 응답성이 저하됩니다.

### 2. 세대(Generational) 가비지 컬렉션

대부분의 JVM GC는 '세대 가설(Generational Hypothesis)'을 기반으로 합니다.
*   **Young 영역**: 새로 생성된 객체가 위치합니다. 대부분의 객체는 금방 사라진다는 가설을 따릅니다. Minor GC가 발생합니다.
*   **Old 영역**: Young 영역에서 오랫동안 살아남은 객체들이 이동하는 공간입니다. Major GC 또는 Full GC가 발생합니다.
*   **Metaspace**: 클래스 메타데이터, 메서드 정보 등을 저장하는 네이티브 메모리 영역입니다(Java 8 이전에는 Permanent Generation).

### 3. 주요 GC 알고리즘

*   **Serial GC**: 단일 스레드로 GC 작업을 수행합니다. CPU 코어가 하나인 환경에 적합하지만, STW 시간이 깁니다.
*   **Parallel GC**: Young 영역 GC를 여러 스레드로 병렬 처리하여 처리량을 높입니다. 서버 환경의 기본 GC로 사용되기도 했습니다.
*   **CMS GC (Concurrent Mark-Sweep)**: STW 시간을 최소화하는 것을 목표로 합니다. Mark-Sweep 단계를 애플리케이션 스레드와 동시에 실행하지만, Old 영역에 조각화(Fragmentation)를 남길 수 있습니다.
*   **G1 GC (Garbage-First)**: Java 9+ 버전의 기본 GC입니다. 힙을 여러 개의 Region으로 나누어 관리하며, STW 시간을 예측 가능하게 유지하면서 처리량과 지연 시간 요구 사항을 모두 충족하도록 설계되었습니다. 대규모 힙에 적합합니다.
*   **ZGC / Shenandoah GC**: 매우 낮은 지연 시간을 목표로 설계된 최신 GC입니다. 대부분의 GC 작업을 애플리케이션 스레드와 동시에 수행하며, 매우 큰 힙(수 테라바이트)에서도 일관된 낮은 STW 시간을 제공합니다.

## JVM GC 튜닝 전략

효과적인 GC 튜닝은 애플리케이션의 특성(예: 처리량 중심, 지연 시간 중심)과 하드웨어 환경을 고려하여 접근해야 합니다.

### 1. GC 로그 분석 및 모니터링

튜닝의 시작은 현재 상태를 정확히 파악하는 것입니다.
*   **GC 로그 활성화**: `JVM` 시작 옵션에 `-Xlog:gc*`를 추가하여 상세 GC 로그를 기록합니다.
*   **도구 활용**: `Jstat`, `JConsole`, `VisualVM`, `GCViewer` 등을 사용하여 실시간 모니터링 및 로그 분석을 수행합니다. GC 로그를 통해 Minor/Major GC 발생 빈도, STW 시간, 힙 사용량 등을 분석할 수 있습니다.

```bash
java -Xlog:gc* -jar your-application.jar
```

### 2. 힙(Heap) 메모리 크기 설정

힙 크기는 GC 성능에 가장 큰 영향을 미치는 요소 중 하나입니다.
*   **초기/최대 힙 크기 설정**: `-Xms` (초기 힙 크기)와 `-Xmx` (최대 힙 크기)를 적절히 설정합니다. 일반적으로 두 값을 동일하게 설정하여 힙 크기 변경에 따른 오버헤드를 줄이는 것이 권장됩니다.
*   **주의 사항**: 너무 작은 힙은 잦은 GC를 유발하고, 너무 큰 힙은 한 번의 GC 시간이 길어질 수 있습니다. 적절한 크기를 찾기 위해 모니터링하며 조절해야 합니다.

```bash
java -Xms4g -Xmx4g -jar your-application.jar
```

### 3. GC 알고리즘 선택

애플리케이션의 요구사항에 맞는 GC 알고리즘을 선택하는 것이 중요합니다.
*   **G1 GC**: 대부분의 경우 좋은 선택입니다. 처리량과 지연 시간의 균형을 잘 맞춥니다.
    ```bash
    java -XX:+UseG1GC -jar your-application.jar
    ```
*   **ZGC / Shenandoah GC**: 매우 낮은 지연 시간이 핵심적인 요구사항인 경우 고려합니다. (JDK 11+ 필요)
    ```bash
    # ZGC 예시
    java -XX:+UseZGC -jar your-application.jar
    # Shenandoah GC 예시 (JDK 12+ 필요, 오픈JDK에서는 별도 플러그인 필요할 수 있음)
    java -XX:+UseShenandoahGC -jar your-application.jar
    ```

### 4. Young/Old 영역 비율 조정 (G1 GC 미사용 시 또는 특정 상황)

G1 GC는 Young/Old 영역을 동적으로 조절하므로 명시적인 비율 설정이 덜 필요하지만, 다른 GC를 사용하거나 특정 튜닝 시에는 고려할 수 있습니다.
*   **Young Ratio**: `-XX:NewRatio=N` (Old:Young = N:1) 또는 `-XX:NewSize`, `-XX:MaxNewSize`를 통해 Young 영역 크기를 조절합니다. 일반적으로 Young 영역이 클수록 Minor GC 횟수는 줄지만, 한 번의 Minor GC 시간은 길어질 수 있습니다.

### 5. 기타 튜닝 팁

*   **Promotion Failure 방지**: Old 영역으로 객체 승격(promotion) 시 공간이 부족하여 Full GC가 발생하는 상황을 방지하도록 힙 크기를 충분히 확보하거나 GC 옵션을 조절합니다.
*   **Explicit GC 비활성화**: `System.gc()`와 같은 명시적 GC 호출은 JVM의 GC 스케줄링을 방해하여 성능 저하를 유발할 수 있습니다. `-XX:+DisableExplicitGC` 옵션으로 비활성화하는 것이 좋습니다.
*   **코드 최적화**: 메모리 누수 방지, 객체 생성 최소화, `ThreadLocal` 등 자원 관리 최적화 등 GC 튜닝 이전에 애플리케이션 코드 자체를 최적화하는 것이 근본적인 해결책입니다.

## 결론: 지속적인 측정과 반복적인 최적화

JVM GC 튜닝은 한 번의 설정으로 끝나는 작업이 아닙니다. 애플리케이션의 부하 패턴, 데이터 증가량, 코드 변경 등에 따라 GC 성능은 달라질 수 있습니다. 따라서 지속적인 모니터링, 로그 분석, 그리고 목표에 맞는 옵션 조정을 통해 반복적으로 최적화하는 과정이 중요합니다. 이 글에서 제시된 기본적인 지식과 전략들을 바탕으로 여러분의 자바 애플리케이션이 최고의 성능을 발휘하도록 GC 튜닝 여정을 시작해보세요.

<p class = "placeholder">Text by Chaelin & Gemini. Photographs by Chaelin, Unsplash.</p>