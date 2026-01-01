---
layout: post
title: "자바 비동기 프로그래밍의 핵심: CompletableFuture 마스터하기"
subtitle: "복잡한 동시성 코드를 깔끔하고 효율적으로 관리하는 방법"
date: 2026-01-01 01:04:51.665Z +0900
background: '/img/posts/pattern01.jpg'
category: Study
tags: [java,concurrency,async,completablefuture]
---

## 서론: 비동기 세상에서 살아남기

현대의 애플리케이션은 사용자 경험을 저해하지 않으면서 빠르게 응답해야 합니다. 네트워크 호출, 데이터베이스 쿼리, 복잡한 계산 등 시간이 오래 걸리는 작업들을 메인 스레드에서 처리하면 애플리케이션이 멈추거나 느려질 수 있죠. 이러한 문제를 해결하기 위해 비동기 프로그래밍은 선택이 아닌 필수가 되었습니다.

자바에서는 `Future` 인터페이스를 통해 비동기 작업의 결과를 다룰 수 있었지만, 여러 비동기 작업을 조합하거나 오류를 처리하는 데는 한계가 있었습니다. 이른바 '콜백 헬'에 빠지거나 코드가 복잡해지기 일쑤였죠. 자바 8에 도입된 `CompletableFuture`는 이러한 비동기 프로그래밍의 난제를 해결하며, 더욱 선언적이고 유연하게 비동기 작업을 구성할 수 있도록 돕는 강력한 도구입니다.

이번 포스팅에서는 `CompletableFuture`가 무엇인지, 어떻게 활용하여 복잡한 비동기 로직을 우아하게 처리할 수 있는지 핵심적인 내용들을 살펴보겠습니다.

## 본문: CompletableFuture, 비동기 작업의 새로운 지평을 열다

### CompletableFuture란 무엇인가?

`CompletableFuture`는 `Future` 인터페이스를 구현하며, 비동기 작업의 완료 시점에 특정 동작을 수행할 수 있도록 콜백 기능을 제공합니다. 또한, 여러 `CompletableFuture`를 조합하여 더 복잡한 비동기 파이프라인을 구축할 수 있게 해줍니다. 전통적인 `Future`가 "읽기 전용"의 비동기 결과라면, `CompletableFuture`는 "쓰기 가능"하며 "조합 가능"한 비동기 결과라고 할 수 있습니다.

### 1. CompletableFuture 생성 및 기본 활용

`CompletableFuture`를 생성하는 가장 기본적인 방법은 즉시 완료된 `CompletableFuture`를 만들거나, 비동기적으로 실행될 작업을 제공하는 것입니다.

*   **`runAsync(Runnable runnable)`**: 결과를 반환하지 않는 비동기 작업을 실행합니다.
*   **`supplyAsync(Supplier<T> supplier)`**: 결과를 반환하는 비동기 작업을 실행합니다.

```java
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executors;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.TimeUnit;

public class CompletableFutureBasic {

    public static void main(String[] args) throws Exception {
        // 1. 결과를 반환하지 않는 비동기 작업 (runAsync)
        CompletableFuture<Void> future1 = CompletableFuture.runAsync(() -> {
            try {
                TimeUnit.SECONDS.sleep(1); // 1초 대기 시뮬레이션
                System.out.println("작업 1 완료: Hello, CompletableFuture!");
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });

        // 2. 결과를 반환하는 비동기 작업 (supplyAsync)
        CompletableFuture<String> future2 = CompletableFuture.supplyAsync(() -> {
            try {
                TimeUnit.SECONDS.sleep(2); // 2초 대기 시뮬레이션
                System.out.println("작업 2 수행 중...");
                return "결과 값: Data from Async Operation";
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return "Error";
            }
        });

        // 작업 1이 완료될 때까지 기다림
        future1.get(); 
        System.out.println("Future 1이 완료되었습니다.");

        // 작업 2의 결과 가져오기
        String result = future2.get(); 
        System.out.println("Future 2 결과: " + result);

        // 기본적으로 ForkJoinPool.commonPool()을 사용하지만,
        // 특정 Executor를 지정할 수도 있습니다.
        ExecutorService executor = Executors.newFixedThreadPool(2);
        CompletableFuture<String> futureWithCustomExecutor = CompletableFuture.supplyAsync(() -> {
            System.out.println("커스텀 Executor에서 실행 중: " + Thread.currentThread().getName());
            return "Custom Executor Result";
        }, executor);

        System.out.println(futureWithCustomExecutor.get());
        executor.shutdown(); // Executor 종료
    }
}
```

### 2. 콜백 체이닝: 작업 간의 연결

`CompletableFuture`의 진정한 강점은 비동기 작업들이 완료될 때 후속 작업을 연결할 수 있다는 점입니다.

*   **`thenApply(Function<T, R> fn)`**: 이전 작업의 결과를 받아 변환하여 새로운 `CompletableFuture`를 반환합니다.
*   **`thenAccept(Consumer<T> action)`**: 이전 작업의 결과를 받아 소비하고, 결과를 반환하지 않습니다.
*   **`thenRun(Runnable action)`**: 이전 작업이 완료되면 실행되며, 이전 작업의 결과에 접근할 수 없고 결과를 반환하지 않습니다.

```java
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

public class CompletableFutureChaining {

    public static void main(String[] args) {
        CompletableFuture.supplyAsync(() -> {
            System.out.println("1단계: 초기 데이터 로드 시작...");
            try {
                TimeUnit.MILLISECONDS.sleep(500);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            return "원본 데이터";
        })
        .thenApply(data -> {
            System.out.println("2단계: 데이터 처리: " + data);
            try {
                TimeUnit.MILLISECONDS.sleep(300);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            return data.toUpperCase() + " 처리됨";
        })
        .thenAccept(processedData -> {
            System.out.println("3단계: 결과 사용: " + processedData);
        })
        .thenRun(() -> {
            System.out.println("4단계: 모든 작업 완료!");
        });

        // 메인 스레드가 즉시 종료되지 않도록 잠시 대기
        try {
            TimeUnit.SECONDS.sleep(2); 
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
```

### 3. 여러 CompletableFuture 조합하기

더 복잡한 시나리오에서는 여러 독립적이거나 의존적인 `CompletableFuture`들을 조합해야 할 수 있습니다.

*   **`thenCompose(Function<T, CompletionStage<R>> fn)`**: 이전 `CompletableFuture`의 결과에 의존하는 또 다른 비동기 작업을 연결할 때 사용합니다. `CompletableFuture`를 반환하는 함수를 받습니다. (비동기 체이닝)
*   **`thenCombine(CompletionStage<U> other, BiFunction<T, U, R> fn)`**: 두 개의 독립적인 `CompletableFuture`가 모두 완료되었을 때, 두 결과값을 조합하여 새로운 결과를 생성합니다. (병렬 작업 결과 조합)
*   **`allOf(CompletableFuture<?>... cfs)`**: 모든 `CompletableFuture`들이 완료될 때까지 기다립니다. 모든 `CompletableFuture`가 완료될 때까지 블록됩니다.
*   **`anyOf(CompletableFuture<?>... cfs)`**: 주어진 `CompletableFuture` 중 어느 하나라도 완료되면 즉시 완료됩니다.

```java
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

public class CompletableFutureComposition {

    public static void main(String[] args) throws Exception {
        // thenCompose 예시: 사용자 ID로 사용자 정보를 가져온 후, 해당 사용자의 주문 목록 가져오기
        CompletableFuture<String> userIdFuture = CompletableFuture.supplyAsync(() -> {
            System.out.println("사용자 ID 가져오기...");
            try { TimeUnit.MILLISECONDS.sleep(300); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
            return "user123";
        });

        CompletableFuture<String> userOrdersFuture = userIdFuture.thenCompose(userId ->
            CompletableFuture.supplyAsync(() -> {
                System.out.println(userId + "의 주문 목록 가져오기...");
                try { TimeUnit.MILLISECONDS.sleep(500); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
                return userId + "의 주문: [상품A, 상품B]";
            })
        );
        System.out.println("thenCompose 결과: " + userOrdersFuture.get());

        // thenCombine 예시: 상품 정보와 재고 정보를 동시에 가져와 조합하기
        CompletableFuture<String> productInfoFuture = CompletableFuture.supplyAsync(() -> {
            System.out.println("상품 정보 가져오기...");
            try { TimeUnit.MILLISECONDS.sleep(400); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
            return "상품명: 키보드";
        });

        CompletableFuture<Integer> stockInfoFuture = CompletableFuture.supplyAsync(() -> {
            System.out.println("재고 정보 가져오기...");
            try { TimeUnit.MILLISECONDS.sleep(600); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
            return 150;
        });

        CompletableFuture<String> combinedFuture = productInfoFuture.thenCombine(stockInfoFuture, (product, stock) -> {
            return product + ", 재고: " + stock + "개";
        });
        System.out.println("thenCombine 결과: " + combinedFuture.get());


        // allOf 예시: 여러 독립적인 작업 모두 완료 대기
        CompletableFuture<String> taskA = CompletableFuture.supplyAsync(() -> {
            try { TimeUnit.MILLISECONDS.sleep(100); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
            return "Task A Done";
        });
        CompletableFuture<String> taskB = CompletableFuture.supplyAsync(() -> {
            try { TimeUnit.MILLISECONDS.sleep(300); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
            return "Task B Done";
        });

        CompletableFuture<Void> allOfFuture = CompletableFuture.allOf(taskA, taskB);
        allOfFuture.get(); // 모든 작업 완료 대기
        System.out.println("모든 작업이 완료되었습니다. Task A: " + taskA.join() + ", Task B: " + taskB.join());


        // anyOf 예시: 여러 작업 중 하나라도 완료 대기
        CompletableFuture<String> fastTask = CompletableFuture.supplyAsync(() -> {
            try { TimeUnit.MILLISECONDS.sleep(50); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
            return "가장 빠른 작업 완료!";
        });
        CompletableFuture<String> slowTask = CompletableFuture.supplyAsync(() -> {
            try { TimeUnit.MILLISECONDS.sleep(500); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
            return "느린 작업 완료!";
        });

        CompletableFuture<Object> anyOfFuture = CompletableFuture.anyOf(fastTask, slowTask);
        System.out.println("AnyOf 결과: " + anyOfFuture.get()); // 가장 먼저 완료된 작업의 결과
    }
}
```

### 4. 오류 처리: 예외 상황에 우아하게 대응하기

비동기 작업에서 예외가 발생했을 때 이를 효과적으로 처리하는 것은 중요합니다. `CompletableFuture`는 오류 처리를 위한 편리한 방법을 제공합니다.

*   **`exceptionally(Function<Throwable, T> fn)`**: 이전 `CompletableFuture`에서 예외가 발생했을 때 호출됩니다. 예외를 처리하고 기본값을 반환하여 정상적인 흐름을 이어갈 수 있습니다.
*   **`handle(BiFunction<T, Throwable, R> fn)`**: 이전 `CompletableFuture`가 완료(성공 또는 실패)되었을 때 호출됩니다. 결과와 예외 정보를 모두 받아 처리할 수 있습니다.

```java
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

public class CompletableFutureErrorHandling {

    public static void main(String[] args) throws Exception {
        // exceptionally 예시
        CompletableFuture<String> errorFuture = CompletableFuture.supplyAsync(() -> {
            System.out.println("오류 발생 가능 작업 시작...");
            try {
                TimeUnit.MILLISECONDS.sleep(100);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            if (Math.random() > 0.5) { // 50% 확률로 예외 발생
                throw new IllegalStateException("데이터 처리 중 오류 발생!");
            }
            return "정상 데이터";
        }).exceptionally(ex -> {
            System.err.println("예외 처리: " + ex.getMessage());
            return "오류 복구 데이터"; // 예외 발생 시 반환할 기본값
        });

        System.out.println("exceptionally 결과: " + errorFuture.get());


        // handle 예시
        CompletableFuture<String> handleFuture = CompletableFuture.supplyAsync(() -> {
            System.out.println("handle 작업 시작...");
            try {
                TimeUnit.MILLISECONDS.sleep(100);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            if (Math.random() > 0.5) { // 50% 확률로 예외 발생
                throw new IllegalArgumentException("입력 값 오류!");
            }
            return "성공 처리 값";
        }).handle((result, ex) -> {
            if (ex != null) {
                System.err.println("handle에서 예외 처리: " + ex.getMessage());
                return "핸들링된 오류 값";
            } else {
                return result + " (정상적으로 처리됨)";
            }
        });

        System.out.println("handle 결과: " + handleFuture.get());
    }
}
```

## 결론: 비동기 프로그래밍의 강력한 파트너, CompletableFuture

`CompletableFuture`는 자바 비동기 프로그래밍의 복잡성을 크게 줄여주는 강력한 추상화 도구입니다. 비동기 작업의 생성, 변환, 조합, 오류 처리 등 모든 과정을 유연하고 선언적으로 처리할 수 있게 함으로써, 개발자는 `콜백 헬`에서 벗어나 더욱 가독성 높고 유지보수하기 쉬운 코드를 작성할 수 있게 됩니다.

복잡한 마이크로서비스 아키텍처나 고성능 웹 서비스 등에서 비동기 I/O를 효율적으로 다루는 것은 핵심적인 역량입니다. `CompletableFuture`를 마스터하여 논블로킹(Non-blocking) 애플리케이션의 성능을 극대화하고, 사용자에게 더 나은 경험을 제공하는 데 활용하시길 바랍니다. 앞으로도 자바의 비동기 패러다임은 계속 발전할 것이며, `CompletableFuture`는 그 중심에서 중요한 역할을 할 것입니다.

<p class = "placeholder">Text by Chaelin & Gemini. Photographs by Chaelin, Unsplash.</p>