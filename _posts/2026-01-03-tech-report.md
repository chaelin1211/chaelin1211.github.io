---
layout: post
title: "자바 비동기 프로그래밍, CompletableFuture로 우아하게"
subtitle: "논블로킹의 힘! Java CompletableFuture 완전 정복"
date: 2026-01-03 00:55:27.766Z +0900
background: '/img/posts/pattern01.jpg'
category: Study
tags: [java,concurrency,async_programming,backend]
---

## 비동기 프로그래밍의 새 지평: CompletableFuture

현대의 백엔드 시스템은 높은 처리량과 낮은 응답 시간을 요구합니다. 전통적인 동기 방식의 프로그래밍은 I/O 작업이나 네트워크 호출과 같은 시간이 오래 걸리는 작업에서 스레드가 블로킹되어 리소스 효율성을 떨어뜨리고 서비스의 확장성을 저해하는 주된 원인이 됩니다. 이러한 문제를 해결하기 위해 비동기 프로그래밍은 필수적인 요소로 자리 잡았습니다.

자바 8부터 도입된 `CompletableFuture`는 기존 `Future` 인터페이스의 한계를 뛰어넘어, 더욱 유연하고 강력한 비동기 프로그래밍 모델을 제공합니다. 이는 복잡한 비동기 로직을 간결하고 가독성 있게 표현할 수 있도록 도와주며, 논블로킹 방식으로 백엔드 애플리케이션의 성능과 확장성을 크게 향상시킬 수 있습니다. 이번 포스트에서는 `CompletableFuture`가 무엇인지, 어떻게 활용하는지 자세히 알아보겠습니다.

## CompletableFuture란?

`CompletableFuture`는 자바의 `Future` 인터페이스를 구현하며, 비동기 작업의 결과를 나타내는 동시에 해당 결과를 명시적으로 완료하거나, 다른 비동기 작업과 조합하여 새로운 비동기 작업을 생성할 수 있는 기능을 제공합니다. 기존 `Future`가 제공하지 않던 다음과 같은 강력한 특징들을 가집니다.

*   **명시적 완료(Explicit Completion)**: 작업이 완료되면 수동으로 결과를 설정할 수 있습니다.
*   **콜백 체이닝(Callback Chaining)**: 작업이 완료된 후 실행될 콜백 함수를 연결하여 복잡한 비동기 흐름을 자연스럽게 구성할 수 있습니다.
*   **예외 처리(Exceptional Handling)**: 비동기 작업 중 발생한 예외를 쉽게 처리할 수 있는 메커니즘을 제공합니다.
*   **조합(Combination)**: 여러 `CompletableFuture`들을 조합하여 하나의 결과로 묶거나, 병렬로 실행할 수 있습니다.

## CompletableFuture 기본 활용

### 1. 비동기 작업 시작하기

`CompletableFuture`는 주로 정적 팩토리 메서드를 통해 비동기 작업을 시작합니다.

*   `supplyAsync(Supplier<U> supplier)`: 값을 반환하는 비동기 작업을 시작합니다.
*   `runAsync(Runnable runnable)`: 값을 반환하지 않는 비동기 작업을 시작합니다.

```java
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executors;
import java.util.concurrent.ExecutorService;

public class CompletableFutureBasics {

    public static void main(String[] args) throws InterruptedException {
        // 값을 반환하는 비동기 작업
        CompletableFuture<String> future1 = CompletableFuture.supplyAsync(() -> {
            System.out.println("Async Task 1 started in " + Thread.currentThread().getName());
            try {
                Thread.sleep(2000); // 2초 대기
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            return "Hello from Async Task 1";
        });

        // 값을 반환하지 않는 비동기 작업
        CompletableFuture<Void> future2 = CompletableFuture.runAsync(() -> {
            System.out.println("Async Task 2 started in " + Thread.currentThread().getName());
            try {
                Thread.sleep(1000); // 1초 대기
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            System.out.println("Async Task 2 finished.");
        });

        // 결과 대기 (블로킹 메서드)
        try {
            System.out.println("Result from future1: " + future1.get()); // 결과가 올 때까지 블로킹
            future2.get(); // 작업 완료를 기다림
        } catch (Exception e) {
            e.printStackTrace();
        }

        System.out.println("Main thread continues...");
    }
}
```
`supplyAsync()`와 `runAsync()`는 기본적으로 `ForkJoinPool.commonPool()`을 사용하지만, 두 번째 인자로 `Executor`를 넘겨 원하는 스레드 풀에서 실행되도록 지정할 수 있습니다.

### 2. 비동기 작업 체이닝

`CompletableFuture`의 진정한 강점은 비동기 작업들을 연결하여 복잡한 워크플로우를 생성하는 데 있습니다.

*   **`thenApply(Function<T, U> fn)`**: 이전 단계의 결과를 받아 새로운 타입으로 변환합니다.
*   **`thenAccept(Consumer<T> action)`**: 이전 단계의 결과를 받아 소비하고, 반환값이 없습니다.
*   **`thenRun(Runnable action)`**: 이전 단계가 완료된 후 실행되며, 이전 결과는 무시하고 반환값도 없습니다.
*   **`thenCompose(Function<T, CompletionStage<U>> fn)`**: 이전 단계의 결과를 사용하여 새로운 `CompletableFuture`를 생성하고, 이를 평탄화(flatten)합니다. (비동기 작업의 연쇄)
*   **`thenCombine(CompletionStage<U> other, BiFunction<T, U, V> fn)`**: 두 개의 독립적인 `CompletableFuture`의 결과를 조합하여 새로운 결과를 만듭니다.

```java
public class CompletableFutureChaining {

    public static void main(String[] args) throws InterruptedException {
        CompletableFuture<String> fetchUser = CompletableFuture.supplyAsync(() -> {
            System.out.println("Fetching user...");
            try { Thread.sleep(500); } catch (InterruptedException e) {}
            return "user123";
        });

        CompletableFuture<String> result = fetchUser
            .thenApply(userId -> { // 사용자 ID를 받아서 사용자 이름으로 변환
                System.out.println("Transforming user ID: " + userId);
                return "Name(" + userId + ")";
            })
            .thenCompose(userName -> CompletableFuture.supplyAsync(() -> { // 사용자 이름을 가지고 추가 정보 비동기 호출
                System.out.println("Fetching details for " + userName + "...");
                try { Thread.sleep(700); } catch (InterruptedException e) {}
                return userName + " - Details(Age: 30)";
            }))
            .thenApply(detail -> { // 상세 정보를 한 번 더 변환
                System.out.println("Final transformation: " + detail);
                return "Final Result: " + detail.toUpperCase();
            });

        CompletableFuture<String> productInfo = CompletableFuture.supplyAsync(() -> {
            System.out.println("Fetching product info...");
            try { Thread.sleep(600); } catch (InterruptedException e) {}
            return "Laptop X1";
        });

        CompletableFuture<Integer> priceInfo = CompletableFuture.supplyAsync(() -> {
            System.out.println("Fetching price info...");
            try { Thread.sleep(400); } catch (InterruptedException e) {}
            return 1200;
        });

        CompletableFuture<String> combinedResult = productInfo.thenCombine(priceInfo, (product, price) -> {
            System.out.println("Combining product and price...");
            return "Product: " + product + ", Price: $" + price;
        });

        try {
            System.out.println(result.get());
            System.out.println(combinedResult.get());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

### 3. 예외 처리

비동기 작업 중 발생하는 예외는 `exceptionally()`, `handle()` 메서드를 통해 유연하게 처리할 수 있습니다.

*   **`exceptionally(Function<Throwable, T> fn)`**: 이전 단계에서 예외가 발생했을 때만 실행되며, 예외를 받아 대체 결과를 반환합니다.
*   **`handle(BiFunction<T, Throwable, R> fn)`**: 이전 단계의 결과 또는 예외를 받아 처리하며, 항상 실행됩니다.

```java
public class CompletableFutureErrorHandling {

    public static void main(String[] args) {
        CompletableFuture<String> futureWithException = CompletableFuture.supplyAsync(() -> {
            System.out.println("Task with potential error starting...");
            if (Math.random() > 0.5) {
                throw new RuntimeException("Something went wrong!");
            }
            return "Success!";
        });

        // exceptionally를 이용한 예외 처리
        CompletableFuture<String> handledExceptionally = futureWithException
            .exceptionally(ex -> {
                System.err.println("Caught exception with exceptionally: " + ex.getMessage());
                return "Failed due to error (handled by exceptionally)";
            });

        // handle을 이용한 예외 및 결과 처리
        CompletableFuture<String> handledByHandle = CompletableFuture.supplyAsync(() -> {
            System.out.println("Another task with potential error starting...");
            if (Math.random() < 0.7) {
                throw new IllegalArgumentException("Invalid argument!");
            }
            return "Success with another task!";
        })
        .handle((result, ex) -> {
            if (ex != null) {
                System.err.println("Caught exception with handle: " + ex.getMessage());
                return "Failed due to error (handled by handle)";
            }
            return "Processed result with handle: " + result;
        });

        try {
            System.out.println(handledExceptionally.get());
            System.out.println(handledByHandle.get());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

## 결론

`CompletableFuture`는 자바 비동기 프로그래밍의 패러다임을 한 단계 끌어올린 강력한 도구입니다. 복잡한 콜백 헬(callback hell)에서 벗어나 간결하고 선언적인 방식으로 비동기 워크플로우를 구축할 수 있게 해줍니다. 네트워크 호출, 데이터베이스 접근 등 블로킹이 발생할 수 있는 백엔드 서비스 개발에서 `CompletableFuture`를 적극적으로 활용한다면, 애플리케이션의 응답성을 개선하고 스레드 리소스를 효율적으로 사용하여 더욱 견고하고 확장성 있는 시스템을 구축할 수 있을 것입니다.

이제 여러분의 자바 백엔드 서비스에 `CompletableFuture`의 힘을 불어넣어 보세요!

<p class = "placeholder">Text by Chaelin & Gemini. Photographs by Chaelin, Unsplash.</p>