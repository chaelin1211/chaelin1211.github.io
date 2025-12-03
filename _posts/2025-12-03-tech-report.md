---
layout: post
title: "JVM GC 튜닝 기본: 자바 애플리케이션 성능 최적화의 첫걸음"
subtitle: "가비지 컬렉션의 이해부터 핵심 튜닝 옵션까지"
date: 2025-12-03 00:55:25.038Z +0900
background: '/img/posts/pattern01.jpg'
category: Study
tags: [jvm,garbage_collection,java,performance_tuning]
---

## JVM GC 튜닝 기본: 자바 애플리케이션 성능 최적화의 첫걸음

자바(Java) 애플리케이션을 개발하고 운영하면서 빼놓을 수 없는 중요한 과제 중 하나는 바로 성능 최적화입니다. 그 중심에는 JVM(Java Virtual Machine)의 가비지 컬렉션(Garbage Collection, GC)이 있습니다. GC는 사용하지 않는 메모리를 자동으로 회수하여 개발자가 메모리 관리에 대한 부담을 덜어주지만, 잘못 설정되거나 이해 없이 방치되면 애플리케이션의 응답 속도 저하, 스루풋 감소 등 심각한 성능 문제를 야기할 수 있습니다.

이번 포스트에서는 JVM GC 튜닝의 기본 개념을 이해하고, 실질적인 튜닝을 시작하기 위한 핵심 가이드를 제시합니다.

### 1. 가비지 컬렉션(GC)의 이해: 왜 중요할까요?

자바는 C/C++과 달리 명시적인 메모리 해제를 필요로 하지 않습니다. JVM은 가비지 컬렉터를 통해 더 이상 참조되지 않는 객체들을 자동으로 탐지하고 메모리(힙 영역)에서 제거합니다. 이 과정은 개발자에게는 편리함을 제공하지만, GC가 실행되는 동안에는 애플리케이션 스레드가 일시적으로 작업을 멈추는 'Stop-The-World'(STW) 현상이 발생합니다.

STW는 짧게는 밀리초 단위에서 길게는 수 초까지 지속될 수 있으며, 이는 사용자 경험 저하나 시스템 지연으로 이어집니다. 따라서 효율적인 GC 튜닝은 애플리케이션의 안정성과 성능을 보장하는 데 필수적입니다.

### 2. JVM 힙(Heap) 영역과 GC의 동작 방식

JVM의 힙 영역은 크게 Young Generation과 Old Generation으로 나뉩니다.

*   **Young Generation**: 새로 생성된 객체가 위치하는 공간입니다. Eden, Survivor 0 (S0), Survivor 1 (S1) 영역으로 구성됩니다.
    *   **Minor GC**: Young Generation에서 발생하는 GC입니다. 대부분의 객체는 수명이 짧으므로 Minor GC는 자주 발생하지만, STW 시간은 비교적 짧습니다. 살아남은 객체는 Survivor 영역을 오가다가 Old Generation으로 승격됩니다.
*   **Old Generation**: Young Generation에서 오랫동안 살아남은 객체들이 이동하는 공간입니다.
    *   **Major GC / Full GC**: Old Generation을 대상으로 하는 GC입니다. Major GC는 Old Generation만, Full GC는 힙 전체를 대상으로 합니다. Minor GC보다 훨씬 긴 STW 시간을 유발할 수 있어 주의가 필요합니다.

### 3. 주요 GC 알고리즘 (feat. G1GC)

JVM에는 다양한 GC 알고리즘이 존재하며, 각각의 특성과 목표가 다릅니다.

*   **Serial GC**: 하나의 스레드로 GC를 처리하며, 작은 규모의 클라이언트 애플리케이션에 적합합니다.
*   **Parallel GC**: 처리량(throughput) 향상에 중점을 둔 GC로, 여러 스레드를 사용하여 GC를 병렬로 처리합니다. 서버 애플리케이션의 기본 GC였던 시절도 있었습니다.
*   **CMS GC (Concurrent Mark-Sweep GC)**: 낮은 지연 시간(latency)을 목표로 설계되었지만, JVM 버전 9부터 사용이 중단(deprecated)되었습니다.
*   **G1GC (Garbage-First GC)**: 현재 대용량 힙(Heap)을 사용하는 서버 애플리케이션의 기본 GC로 널리 사용됩니다. 전체 힙을 영역(Region)으로 나누어 관리하며, 가장 많은 가비지를 포함한 영역을 우선적으로 수집하여 효율성과 예측 가능한 지연 시간을 제공합니다.
*   **ZGC, Shenandoah**: 매우 낮은 지연 시간을 목표로 하며, 수십 GB 이상의 대규모 힙에서 초고성능을 요구하는 환경에 적합합니다.

**G1GC**는 현대 자바 애플리케이션에서 가장 많이 사용되는 GC이므로, 이번 튜닝 가이드에서는 G1GC를 중심으로 설명하겠습니다.

### 4. GC 튜닝의 시작: 모니터링 및 목표 설정

GC 튜닝은 '측정 -> 분석 -> 조정 -> 재측정'의 반복 과정입니다. 무턱대고 옵션을 변경하기보다는 현재 애플리케이션의 GC 상태를 정확히 파악하는 것이 중요합니다.

**주요 모니터링 지표:**

*   **GC Pause Time**: GC로 인해 애플리케이션이 멈추는 시간 (평균, 최대). 가장 중요한 지표입니다.
*   **GC Frequency**: GC가 얼마나 자주 발생하는지.
*   **Heap Usage Pattern**: 힙 영역의 사용량이 어떻게 변하는지. Old Generation으로 승격되는 객체의 양은 적절한지.
*   **Throughput vs. Latency**: 애플리케이션의 목적에 따라 처리량(단위 시간당 처리량)과 지연 시간(응답 시간) 중 어느 쪽에 더 중점을 둘 것인지 결정해야 합니다.

**GC 로그 활성화:**

가장 기본적인 모니터링 방법은 GC 로그를 활성화하는 것입니다.

```bash
# JVM 9 이상 버전 (추천)
-Xlog:gc*:file=gc.log:time,level,tags

# JVM 8 이하 버전
-XX:+PrintGCDetails -XX:+PrintGCDateStamps -Xloggc:gc.log
```

생성된 `gc.log` 파일은 GCViewer, gceasy.io와 같은 도구를 사용하여 시각적으로 분석할 수 있습니다.

### 5. 핵심 GC 튜닝 옵션 (G1GC 중심)

GC 로그 분석을 통해 문제점을 파악했다면, 다음 옵션들을 활용하여 튜닝을 시도할 수 있습니다.

1.  **힙 메모리 크기 설정**: `Initial Heap Size`와 `Maximum Heap Size`를 설정합니다.
    *   `-Xms<size>`: JVM 시작 시 할당되는 힙 메모리 크기 (Initial Heap Size).
    *   `-Xmx<size>`: JVM이 사용할 수 있는 최대 힙 메모리 크기 (Maximum Heap Size).
    *   **팁**: 일반적으로 `-Xms`와 `-Xmx` 값을 동일하게 설정하여 런타임 중 힙 크기를 조절하는 오버헤드를 줄이는 것을 권장합니다.
        ```bash
        java -Xms4g -Xmx4g -XX:+UseG1GC ...
        ```

2.  **G1GC 활성화**:
    *   `-XX:+UseG1GC`: G1GC를 명시적으로 사용하도록 설정합니다. (최신 JVM에서는 기본값이기도 합니다.)

3.  **최대 GC 일시정지 시간 목표 설정**:
    *   `-XX:MaxGCPauseMillis=<ms>`: G1GC가 STW 시간을 이 시간 내로 맞추려고 노력합니다. 이는 '목표'일 뿐, 항상 보장되는 것은 아닙니다. 너무 작은 값은 GC를 더 자주 발생시키거나 힙 사용률을 낮출 수 있습니다.
        ```bash
        java -Xmx4g -XX:+UseG1GC -XX:MaxGCPauseMillis=200 ... # 200ms 이하의 일시정지 목표
        ```

4.  **Young Generation 크기 조절 (G1GC에서는 간접적)**:
    *   G1GC는 Young Generation 크기를 동적으로 조절하지만, `NewRatio`나 `Xmn`을 통해 힌트를 줄 수 있습니다. 그러나 대부분의 경우 `MaxGCPauseMillis` 설정으로 충분하며, G1GC가 최적의 Young/Old 비율을 찾아가도록 두는 것이 좋습니다.

5.  **Concurrent GC 시작 임계값**:
    *   `-XX:InitiatingHeapOccupancyPercent=<percent>`: Old Generation이 이 비율만큼 찼을 때 G1GC가 백그라운드에서 동시(concurrent) GC를 시작합니다. 기본값은 45%입니다. 이 값을 조정하여 Full GC를 방지할 수 있습니다. 너무 낮으면 불필요한 GC가 자주 발생하고, 너무 높으면 Full GC가 발생할 확률이 높아집니다.

**예시: 간단한 JVM 실행 명령어**

```bash
java -Xms4g -Xmx4g \
     -XX:+UseG1GC \
     -XX:MaxGCPauseMillis=150 \
     -XX:InitiatingHeapOccupancyPercent=70 \
     -Xlog:gc*:file=gc.log:time,level,tags \
     -jar your-application.jar
```

### 6. 결론: 반복적인 측정과 분석의 중요성

JVM GC 튜닝은 정답이 정해져 있는 작업이 아닙니다. 애플리케이션의 특성, 트래픽 패턴, 하드웨어 사양 등 다양한 요인에 따라 최적의 설정은 달라질 수 있습니다. 핵심은 현재 시스템의 GC 상태를 정확히 이해하고, 합리적인 목표를 세운 뒤, 반복적인 측정과 분석을 통해 점진적으로 개선해 나가는 것입니다.

GC 로그를 꾸준히 모니터링하고, 변경된 설정이 실제로 어떤 영향을 미치는지 면밀히 분석하세요. 이 과정을 통해 여러분의 자바 애플리케이션은 더욱 안정적이고 빠르게 동작할 것입니다.

<p class = "placeholder">Text by Chaelin & Gemini. Photographs by Chaelin, Unsplash.</p>