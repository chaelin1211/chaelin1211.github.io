```markdown
---
layout: post
title: "Java 비동기 프로그래밍의 강력한 도구, CompletableFuture 완전 정복"
subtitle: "논블로킹 처리와 동시성 제어를 위한 실용 가이드"
date: 2025-10-21 05:05:17.073Z +0900
background: '/img/posts/pattern01.jpg'
category: Study
tags: [java,concurrency,async,future]
---

## 서론: 왜 비동기 프로그래밍이 필요한가?

현대의 고성능 애플리케이션은 사용자에게 빠른 응답과 높은 처리량을 제공해야 합니다. 하지만 데이터베이스 조회, 네트워크 통신, 파일 I/O와 같은 작업들은 필연적으로 시간이 소요되며, 이 과정에서 메인 스레드가 블로킹되면 애플리케이션 전체의 성능 저하로 이어집니다. Java 에서는 이러한 문제를 해결하기 위해 Future 인터페이스를 제공했지만, 이는 여전히 블로킹 방식의 `get()` 메서드를 포함하고 있어 완전한 비동기 처리에 한계가 있었습니다.

Java 8에서 도입된 `CompletableFuture`는 이러한 전통적인 `Future`의 단점을 극복하고, 더욱 강력하고 유연한 비동기 프로그래밍 모델을 제공합니다. 이는 선언적인 방식으로 비동기 작업을 조합하고, 논블로킹 방식으로 결과를 처리하며, 오류를 우아하게 다룰 수 있게 해줍니다.

## CompletableFuture란 무엇인가?

`CompletableFuture`는 `Future` 인터페이스를 구현하며, 동시에 `CompletionStage` 인터페이스도 구현합니다. `Future`로서 비동기 작업의 결과를 나타내고, `CompletionStage`로서 일련의 비동기 작업 단계를 정의하고 조합할 수 있는 기능을 제공합니다. 핵심은 작업이 완료되었을 때 특정 콜백을 실행하도록 체이닝(Chaining)할 수 있다는 점입니다.

**주요 특징:**
*   **논블로킹 처리:** 작업 완료 시 콜백 함수를 실행하여 메인 스레드를 블로킹하지 않습니다.
*   **선언적 조합:** 여러 비동기 작업을 쉽고 직관적으로 조합할 수 있습니다.
*   **예외 처리:** 비동기 작업 중 발생한 예외를 체이닝하여 처리할 수 있습니다.
*   **쉬운 생성 및 완료:** 원하는 시점에 `complete()` 또는 `completeExceptionally()` 메서드를 호출하여 작업 완료를 명시적으로 알릴 수 있습니다.

## CompletableFuture의 기본 사용법

`CompletableFuture`를 사용하는 가장 기본적인 방법은 `runAsync()`와 `supplyAsync()` 메서드를 통해 비동기 작업을 시작하는 것입니다.

### 1. 비동기 작업 시작하기

*   **`runAsync(Runnable runnable)`**: 값을 반환하지 않는 비동기 작업을 실행합니다.
*   **`supplyAsync(Supplier<T> supplier)`**: 값을 반환하는 비동기 작업을 실행합니다.

```java
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class BasicCompletableFuture {
    public static void main(String[] args) throws InterruptedException {
        System.out.println("메인 스레드 시작");

        // 값을 반환하지 않는 비동기 작업
        CompletableFuture<Void> future1 = CompletableFuture.runAsync(() -> {
            try {
                TimeUnit.SECONDS.sleep(1);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            System.out.println("runAsync: 작업 완료 (값을 반환하지 않음)");
        });

        // 값을 반환하는 비동기 작업
        CompletableFuture<String> future2 = CompletableFuture.supplyAsync(() -> {
            try {
                TimeUnit.SECONDS.sleep(2);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            System.out.println("supplyAsync: 작업 완료 (값 반환 준비)");
            return "Hello, CompletableFuture!";
        });

        // 결과 대기 (블로킹 메서드지만 예시를 위해 사용)
        try {
            future1.get(); // runAsync의 완료를 대기
            String result = future2.get(); // supplyAsync의 결과를 대기
            System.out.println("future2 결과: " + result);
        } catch (Exception e) {
            e.printStackTrace();
        }

        System.out.println("메인 스레드 종료");
    }
}
```

### 2. 비동기 작업 체이닝

`CompletableFuture`의 진정한 강점은 여러 작업을 연결하여 복잡한 비동기 흐름을 만들 수 있다는 것입니다.

*   **`thenApply(Function<T, U> fn)`**: 이전 단계의 결과를 받아 다른 타입으로 변환하여 반환합니다.
*   **`thenAccept(Consumer<T> action)`**: 이전 단계의 결과를 소비하고, 값을 반환하지 않습니다.
*   **`thenRun(Runnable action)`**: 이전 단계의 결과와 상관없이 작업을 실행하고, 값을 반환하지 않습니다.

```java
public class ChainingCompletableFuture {
    public static void main(String[] args) {
        CompletableFuture.supplyAsync(() -> {
            System.out.println("1. 데이터 로드 시작...");
            try {
                TimeUnit.MILLISECONDS.sleep(500);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            return "RAW_DATA";
        })
        .thenApply(data -> { // 이전 단계의 결과(RAW_DATA)를 받아 가공
            System.out.println("2. 데이터 가공: " + data);
            return data + "_PROCESSED";
        })
        .thenAccept(processedData -> { // 가공된 데이터를 소비하여 출력
            System.out.println("3. 최종 데이터 처리: " + processedData);
        })
        .thenRun(() -> { // 모든 작업 완료 후 실행
            System.out.println("4. 모든 비동기 작업 완료!");
        });

        // 메인 스레드가 즉시 종료되지 않도록 잠시 대기
        try {
            TimeUnit.SECONDS.sleep(3);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
```

### 3. 여러 CompletableFuture 조합하기

복잡한 시나리오에서는 여러 비동기 작업의 결과를 조합해야 할 때가 있습니다.

*   **`thenCompose(Function<T, CompletableFuture<U>> fn)`**: 첫 번째 `CompletableFuture`의 결과를 사용하여 두 번째 `CompletableFuture`를 생성하고, 그 결과를 반환합니다. (FlatMap과 유사)
*   **`thenCombine(CompletableFuture<U> other, BiFunction<T, U, V> fn)`**: 두 개의 독립적인 `CompletableFuture`가 모두 완료되었을 때, 두 결과를 조합하여 새로운 결과를 생성합니다.

```java
public class ComposeCombineCompletableFuture {
    public static void main(String[] args) throws InterruptedException {
        // thenCompose 예시: 사용자 ID로 사용자 정보를 가져온 후, 그 정보로 주문 목록을 가져오는 시나리오
        CompletableFuture<String> userIdFuture = CompletableFuture.supplyAsync(() -> {
            System.out.println("사용자 ID 가져오기...");
            try { TimeUnit.MILLISECONDS.sleep(200); } catch (InterruptedException e) {}
            return "user123";
        });

        CompletableFuture<String> orderFuture = userIdFuture.thenCompose(userId -> {
            System.out.println(userId + "의 주문 목록 가져오기...");
            return CompletableFuture.supplyAsync(() -> {
                try { TimeUnit.MILLISECONDS.sleep(300); } catch (InterruptedException e) {}
                return userId + "'s Orders: [itemA, itemB]";
            });
        });

        orderFuture.thenAccept(System.out::println);


        // thenCombine 예시: 두 개의 독립적인 비동기 작업을 병렬로 실행하고 결과 조합
        CompletableFuture<String> weatherFuture = CompletableFuture.supplyAsync(() -> {
            System.out.println("날씨 정보 가져오기...");
            try { TimeUnit.MILLISECONDS.sleep(600); } catch (InterruptedException e) {}
            return "맑음";
        });

        CompletableFuture<String> locationFuture = CompletableFuture.supplyAsync(() -> {
            System.out.println("위치 정보 가져오기...");
            try { TimeUnit.MILLISECONDS.sleep(400); } catch (InterruptedException e) {}
            return "서울";
        });

        CompletableFuture<String> combinedFuture = weatherFuture.thenCombine(locationFuture,
                (weather, location) -> "현재 " + location + " 날씨는 " + weather + "입니다.");

        combinedFuture.thenAccept(System.out::println);

        // 모든 작업이 완료될 때까지 대기
        TimeUnit.SECONDS.sleep(2);
    }
}
```

### 4. 예외 처리

비동기 작업 중 발생할 수 있는 예외도 `CompletableFuture` 체인 내에서 처리할 수 있습니다.

*   **`exceptionally(Function<Throwable, T> fn)`**: 예외 발생 시 호출되며, 예외를 처리하고 기본값을 반환합니다.
*   **`handle(BiFunction<T, Throwable, R> fn)`**: 작업의 성공/실패 여부와 상관없이 호출되어 결과와 예외를 모두 다룰 수 있습니다.

```java
public class ExceptionHandlingCompletableFuture {
    public static void main(String[] args) throws InterruptedException {
        CompletableFuture.supplyAsync(() -> {
            System.out.println("데이터 처리 시작 (예외 발생 가능)");
            if (Math.random() < 0.5) {
                throw new IllegalStateException("인위적인 오류 발생!");
            }
            return "성공적으로 처리된 데이터";
        })
        .exceptionally(ex -> { // 예외 발생 시 처리
            System.err.println("오류 발생: " + ex.getMessage());
            return "기본 데이터 (오류 복구)"; // 예외 발생 시 대체 값 반환
        })
        .thenAccept(result -> {
            System.out.println("최종 결과: " + result);
        });

        CompletableFuture.supplyAsync(() -> {
            System.out.println("데이터 처리 시작 (또 다른 예외 발생 가능)");
            if (Math.random() < 0.5) {
                throw new ArithmeticException("계산 오류 발생!");
            }
            return 100;
        })
        .handle((result, ex) -> { // 성공/실패 모두 처리
            if (ex != null) {
                System.err.println("handle에서 오류 처리: " + ex.getMessage());
                return -1; // 오류 시 -1 반환
            } else {
                System.out.println("handle에서 성공 처리: " + result);
                return result * 2; // 성공 시 결과 두 배
            }
        })
        .thenAccept(finalValue -> {
            System.out.println("handle 후 최종 값: " + finalValue);
        });

        TimeUnit.SECONDS.sleep(2);
    }
}
```

### 5. 모든/아무 작업 완료 대기

여러 `CompletableFuture` 중 모든 작업이 완료되거나, 혹은 어떤 하나라도 완료될 때까지 대기할 수 있습니다.

*   **`allOf(CompletableFuture<?>... cfs)`**: 모든 `CompletableFuture`가 완료될 때까지 기다립니다. `Void`를 반환합니다.
*   **`anyOf(CompletableFuture<?>... cfs)`**: 어떤 `CompletableFuture`라도 먼저 완료되면 해당 결과와 함께 완료됩니다. `Object`를 반환하므로 타입 캐스팅이 필요할 수 있습니다.

```java
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

public class AllOfAnyOfCompletableFuture {
    public static void main(String[] args) throws InterruptedException {
        CompletableFuture<String> task1 = CompletableFuture.supplyAsync(() -> {
            try { TimeUnit.SECONDS.sleep(1); } catch (InterruptedException e) {}
            return "Task1 Done";
        });

        CompletableFuture<String> task2 = CompletableFuture.supplyAsync(() -> {
            try { TimeUnit.SECONDS.sleep(2); } catch (InterruptedException e) {}
            return "Task2 Done";
        });

        CompletableFuture<String> task3 = CompletableFuture.supplyAsync(() -> {
            try { TimeUnit.SECONDS.sleep(3); } catch (InterruptedException e) {}
            return "Task3 Done";
        });

        // allOf: 모든 작업이 완료될 때까지 대기
        CompletableFuture<Void> allTasks = CompletableFuture.allOf(task1, task2, task3);

        allTasks.thenRun(() -> {
            System.out.println("모든 작업 완료!");
            try {
                // allOf는 개별 결과를 반환하지 않으므로, 각 future.join()으로 접근해야 합니다.
                System.out.println(task1.join());
                System.out.println(task2.join());
                System.out.println(task3.join());
            } catch (Exception e) {
                e.printStackTrace();
            }
        });

        // anyOf: 가장 먼저 완료되는 작업의 결과를 기다림
        CompletableFuture<Object> anyTask = CompletableFuture.anyOf(task1, task2, task3);

        anyTask.thenAccept(result -> {
            System.out.println("가장 먼저 완료된 작업: " + result);
        });

        TimeUnit.SECONDS.sleep(4); // 메인 스레드 종료 방지
    }
}
```

## 결론: 현대 Java 비동기 프로그래밍의 핵심

`CompletableFuture`는 Java에서 복잡한 비동기 작업을 우아하고 효율적으로 처리할 수 있도록 돕는 강력한 도구입니다. 논블로킹 방식으로 여러 작업을 조합하고, 유연하게 예외를 처리하며, 애플리케이션의 반응성과 처리량을 크게 향상시킬 수 있습니다. 마이크로서비스 아키텍처나 고성능 데이터 처리와 같은 현대적인 애플리케이션 개발에서 `CompletableFuture`는 선택이 아닌 필수적인 요소로 자리매김하고 있습니다. 오늘부터 `CompletableFuture`를 활용하여 더욱 견고하고 반응성 높은 서비스를 구축해 보시기 바랍니다.

<p class = "placeholder">Text by Chaelin & Gemini. Photographs by Chaelin, Unsplash.</p>
```