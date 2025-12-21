---
layout: post
title: "Java 가상 스레드 입문: 동시성 프로그래밍의 새 지평을 열다"
subtitle: "Project Loom이 가져온 혁신, 스케일링과 생산성을 동시에 잡는 법"
date: 2025-12-21 01:01:17.890Z +0900
background: '/img/posts/pattern01.jpg'
category: Study
tags: [java,concurrency,virtual_threads]
---

## 서론: 동시성 프로그래밍, 더 이상 어렵지 않다!

현대 애플리케이션은 높은 처리량과 낮은 지연 시간을 요구하며, 이는 필연적으로 동시성 프로그래밍의 중요성을 증대시킵니다. 하지만 기존 Java의 스레드 모델은 운영체제 스레드(Platform Threads)에 직접 매핑되어 있어, 수십만 개 이상의 동시 연결을 처리하거나 I/O 바운드 작업이 많은 경우 성능 저하와 리소스 고갈이라는 한계에 부딪히곤 했습니다. 복잡한 비동기 프레임워크나 퓨처(Future), 콜백(Callback) 패턴은 코드의 가독성을 해치고 디버깅을 어렵게 만들었죠.

여기서 Java 가상 스레드(Virtual Threads)가 등장합니다. Project Loom의 결과물인 가상 스레드는 동시성 프로그래밍의 패러다임을 바꿀 혁신적인 기능으로, 개발자가 더 이상 복잡한 동시성 모델에 얽매이지 않고도 높은 확장성과 생산성을 누릴 수 있도록 돕습니다. 이제 이 강력한 기능이 무엇이며, 어떻게 활용할 수 있는지 자세히 알아보겠습니다.

## 본문: 가상 스레드, 무엇이고 왜 필요한가?

### 1. 가상 스레드란 무엇인가?

가상 스레드는 JVM이 관리하는 매우 가벼운 사용자 모드 스레드입니다. 기존의 플랫폼 스레드가 운영체제 스레드와 1:1로 매핑되어 무거운 리소스를 사용하는 반면, 가상 스레드는 소수의 플랫폼 스레드 위에서 수많은 가상 스레드가 실행되는 M:N 매핑 방식을 채택합니다. 즉, JVM이 가상 스레드를 플랫폼 스레드에 마운트(mount)하고 언마운트(unmount)하면서 실행을 전환합니다.

이러한 특성 덕분에 가상 스레드는 다음과 같은 특징을 가집니다.

*   **경량성**: 수백만 개의 가상 스레드를 생성해도 메모리 오버헤드가 매우 낮습니다.
*   **빠른 문맥 전환**: 운영체제 개입 없이 JVM 내부에서 빠르게 스레드를 전환할 수 있습니다.
*   **플랫폼 스레드 재활용**: I/O 대기 등으로 블록된 가상 스레드는 플랫폼 스레드를 점유하지 않고, 해당 플랫폼 스레드는 다른 가상 스레드를 실행하는 데 사용됩니다.

### 2. 왜 가상 스레드가 필요한가? 기존 스레드의 한계와 문제점

전통적인 "스레드-당-요청(thread-per-request)" 모델은 동시 요청 수가 늘어날수록 다음과 같은 문제점을 야기했습니다.

*   **높은 리소스 소비**: 각 플랫폼 스레드가 상당한 메모리(스택)를 차지하며, 운영체제도 스레드 관리에 리소스를 소모합니다. 이는 동시 연결 수의 상한선을 만듭니다.
*   **I/O 바운드 병목 현상**: 웹 요청, 데이터베이스 쿼리, 외부 API 호출 등 I/O 작업은 대부분의 시간을 대기 상태로 보냅니다. 이 시간 동안 플랫폼 스레드는 아무것도 하지 않고 대기하며 다른 작업을 할 수 없습니다.
*   **복잡한 비동기 프로그래밍**: 위 문제를 해결하기 위해 Non-blocking I/O, Reactor 패턴, CompletableFuture 같은 비동기 모델이 도입되었지만, 이는 코드의 복잡성을 증가시키고 순차적 로직을 비선형적으로 만들어 개발 생산성을 저하시켰습니다.

가상 스레드는 이 모든 문제를 '동기 코드처럼 작성하면서 비동기적인 이점을 얻는' 방식으로 해결합니다. I/O 대기 중인 가상 스레드는 플랫폼 스레드를 반납하므로, 마치 비동기적으로 동작하는 것처럼 보이지만 개발자는 익숙한 순차적 코드를 작성할 수 있습니다.

### 3. 가상 스레드 사용법 (코드 예시)

가상 스레드를 사용하는 방법은 매우 간단합니다. 기존 `Thread` API와 거의 동일하며, `Thread.ofVirtual()` 팩토리 메서드를 사용하거나 `ExecutorService`를 통해 손쉽게 생성할 수 있습니다.

#### 3.1. `Thread.ofVirtual()`을 이용한 생성

가장 기본적인 방법입니다.

```java
import java.time.Duration;
import java.util.concurrent.Executors;
import java.util.stream.IntStream;

public class VirtualThreadExample {
    public static void main(String[] args) throws InterruptedException {
        Runnable task = () -> {
            try {
                System.out.println("가상 스레드 시작: " + Thread.currentThread());
                Thread.sleep(Duration.ofSeconds(1)); // I/O 대기 시뮬레이션
                System.out.println("가상 스레드 종료: " + Thread.currentThread());
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        };

        // 가상 스레드 10개 생성 및 실행
        IntStream.range(0, 10).forEach(i ->
            Thread.ofVirtual()
                  .name("MyVirtualThread-" + i)
                  .start(task)
        );

        // 메인 스레드가 모든 가상 스레드가 종료될 때까지 대기
        Thread.sleep(Duration.ofSeconds(2));
        System.out.println("모든 가상 스레드 작업 완료.");
    }
}
```
**실행 결과 예시:**
```
가상 스레드 시작: VirtualThread[#21]/MyVirtualThread-0
가상 스레드 시작: VirtualThread[#22]/MyVirtualThread-1
가상 스레드 시작: VirtualThread[#23]/MyVirtualThread-2
... (다른 가상 스레드 시작)
가상 스레드 종료: VirtualThread[#21]/MyVirtualThread-0
가상 스레드 종료: VirtualThread[#22]/MyVirtualThread-1
... (다른 가상 스레드 종료)
모든 가상 스레드 작업 완료.
```

`Thread.currentThread()`를 출력해보면 `VirtualThread`라는 접두사가 붙는 것을 확인할 수 있습니다. 중요한 점은 `Thread.sleep()` 같은 블로킹 호출이 발생해도 플랫폼 스레드를 효율적으로 반환하고 재사용한다는 것입니다.

#### 3.2. `ExecutorService`를 이용한 생성

대부분의 실제 시나리오에서는 `ExecutorService`를 통해 스레드 풀을 관리합니다. 가상 스레드도 전용 `ExecutorService`를 제공합니다.

```java
import java.time.Duration;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.IntStream;

public class VirtualThreadExecutorExample {
    public static void main(String[] args) {
        Runnable task = () -> {
            try {
                System.out.println("Executor 가상 스레드 시작: " + Thread.currentThread());
                Thread.sleep(Duration.ofSeconds(1)); // I/O 대기 시뮬레이션
                System.out.println("Executor 가상 스레드 종료: " + Thread.currentThread());
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        };

        // 가상 스레드 전용 ExecutorService 생성
        try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
            IntStream.range(0, 10).forEach(i ->
                executor.submit(task)
            );
        } // try-with-resources 블록을 벗어나면 executor가 자동으로 종료됩니다.

        System.out.println("모든 가상 스레드 작업이 제출되었습니다. 종료까지 잠시 대기.");
        // 실제 애플리케이션에서는 shutdown() 후 awaitTermination()을 사용합니다.
        // 여기서는 예시를 위해 메인 스레드 잠시 대기
        try {
            Thread.sleep(Duration.ofSeconds(2));
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
```

`Executors.newVirtualThreadPerTaskExecutor()`는 제출되는 각 작업마다 새로운 가상 스레드를 생성하는 `ExecutorService`입니다. 이는 기존 `newCachedThreadPool()`과 유사하게 보이지만, 가상 스레드의 경량성 덕분에 훨씬 더 많은 작업을 효율적으로 처리할 수 있습니다.

### 4. 가상 스레드의 핵심 이점과 고려사항

**핵심 이점:**

*   **확장성(Scalability)**: 적은 리소스로 수백만 개의 동시 작업을 처리할 수 있어, 높은 처리량이 요구되는 웹 서버, 마이크로서비스 등에 적합합니다.
*   **생산성(Productivity)**: 복잡한 비동기 로직 대신 직관적이고 순차적인 코드를 작성할 수 있어 개발 시간을 단축하고 버그를 줄입니다.
*   **성능(Performance)**: I/O 바운드 애플리케이션의 처리량(throughput)을 크게 향상시킵니다.
*   **친숙한 API**: 기존 `java.lang.Thread` 및 `java.util.concurrent` API와 높은 호환성을 가집니다.

**고려사항:**

*   **CPU 바운드 작업**: 가상 스레드는 I/O 바운드 작업에 최적화되어 있습니다. 순수하게 CPU를 많이 사용하는 작업에는 여전히 플랫폼 스레드나 적절한 스레드 풀 전략이 필요합니다. 가상 스레드는 CPU 코어 수 이상으로 동시에 실행될 수 없기 때문입니다.
*   **모니터링 및 디버깅**: 초기에는 가상 스레드에 대한 도구 지원이 부족할 수 있지만, 점차 개선되고 있습니다.
*   **레거시 코드**: `synchronized` 블록이나 `ThreadLocal` 사용 시 주의가 필요할 수 있습니다. 특히 `synchronized`는 플랫폼 스레드를 고정(pinning)시킬 수 있어 가상 스레드의 이점을 감소시킬 수 있습니다.

## 결론: 동시성 프로그래밍의 미래

Java 가상 스레드는 동시성 프로그래밍에 대한 우리의 접근 방식을 근본적으로 변화시킬 잠재력을 가지고 있습니다. 더 이상 스레드의 리소스 제약 때문에 아키텍처를 비틀거나 복잡한 비동기 로직에 시달릴 필요가 없습니다. 익숙한 동기 코드 스타일을 유지하면서도 뛰어난 확장성과 효율성을 달성할 수 있게 된 것이죠.

물론 모든 문제의 만능 해결책은 아니지만, 대부분의 현대 I/O 바운드 애플리케이션에서 가상 스레드는 단순성과 성능이라는 두 마리 토끼를 모두 잡을 수 있는 강력한 도구가 될 것입니다. 지금 바로 가상 스레드를 탐구하고 여러분의 애플리케이션에 적용하여 차세대 동시성 프로그래밍의 이점을 경험해 보세요!

<p class = "placeholder">Text by Chaelin & Gemini. Photographs by Chaelin, Unsplash.</p>