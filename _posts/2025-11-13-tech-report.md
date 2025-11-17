---
layout: post
title: "MSA에서 분산 트랜잭션 관리, 어떻게 현명하게 풀어나갈 것인가?"
subtitle: "2PC부터 Saga 패턴까지, 마이크로서비스 아키텍처의 견고함을 위한 여정"
date: 2025-11-13 00:54:41.051Z +0900
background: '/img/posts/pattern01.jpg'
category: Study
tags: [microservices,msa,distributed_transaction,java]
---

## 🚀 마이크로서비스 시대, 트랜잭션의 새로운 도전

마이크로서비스 아키텍처(MSA)는 비즈니스 로직을 작고 독립적인 서비스들로 분리하여 개발 및 배포의 유연성을 극대화합니다. 각 서비스는 고유의 데이터베이스를 가지며 독립적으로 운영되는 것이 일반적입니다. 이러한 독립성은 MSA의 큰 장점이지만, 여러 서비스에 걸쳐 비즈니스 작업을 수행해야 할 때 데이터 일관성을 유지하는 복잡한 과제를 안겨줍니다. 바로 '분산 트랜잭션(Distributed Transaction)' 관리의 문제입니다.

단일 모놀리식 애플리케이션에서는 ACID(원자성, 일관성, 고립성, 지속성) 속성을 보장하는 데이터베이스 트랜잭션으로 손쉽게 데이터 일관성을 유지할 수 있었습니다. 그러나 MSA에서는 데이터베이스가 분리되어 있어 전통적인 방식으로는 ACID를 직접 보장하기 어렵습니다. 이 글에서는 MSA 환경에서 분산 트랜잭션을 효과적으로 관리하기 위한 다양한 전략과 패턴을 살펴보겠습니다.

## 🤯 분산 트랜잭션, 왜 어려운가?

MSA에서 여러 서비스가 관여하는 하나의 비즈니스 프로세스는 각각의 로컬 트랜잭션들의 집합으로 이루어집니다. 예를 들어, 온라인 쇼핑몰에서 상품 주문 시 `주문 서비스`는 주문 정보를 저장하고, `재고 서비스`는 재고를 감소시키며, `결제 서비스`는 결제를 처리합니다. 이 과정에서 어느 한 단계라도 실패하면 전체 프로세스를 롤백하여 데이터 일관성을 맞춰야 합니다.

### ⛔ 2단계 커밋 (Two-Phase Commit, 2PC)의 한계

전통적인 분산 트랜잭션 방식인 2단계 커밋(2PC)은 코디네이터가 모든 참여자(서비스)에게 커밋 또는 롤백을 지시하여 원자성을 보장합니다. 하지만 2PC는 다음과 같은 이유로 MSA에는 적합하지 않습니다.

*   **블로킹(Blocking)**: 참여자들이 코디네이터의 응답을 기다리는 동안 리소스를 잠그기 때문에 성능 저하를 일으킵니다.
*   **단일 실패 지점(Single Point of Failure)**: 코디네이터가 실패하면 전체 시스템에 영향을 미칩니다.
*   **느슨한 결합(Loose Coupling) 저해**: 서비스 간의 강한 의존성을 생성하여 MSA의 핵심 가치를 훼손합니다.

이러한 문제들로 인해 MSA에서는 2PC 대신 **결과적 일관성(Eventual Consistency)**을 기반으로 하는 패턴들이 주로 사용됩니다.

## ✨ MSA 분산 트랜잭션 관리 전략

MSA에서 분산 트랜잭션을 관리하는 대표적인 패턴은 'Saga 패턴'입니다. 이 외에도 견고한 시스템을 구축하기 위한 다양한 보조 패턴과 기법들이 활용됩니다.

### 1. Saga 패턴

Saga 패턴은 일련의 로컬 트랜잭션(local transaction)으로 구성되며, 각 로컬 트랜잭션은 특정 서비스에서 자신의 데이터베이스에 대해 수행됩니다. 만약 Saga의 어떤 단계에서든 실패가 발생하면, 이전에 성공했던 로컬 트랜잭션들을 되돌리기 위한 보상 트랜잭션(compensating transaction)을 실행하여 전체 시스템의 일관성을 맞춥니다. Saga 패턴은 크게 두 가지 방식으로 구현됩니다.

#### 1.1. 오케스트레이션 Saga (Orchestration Saga)

중앙 집중식 코디네이터(Orchestrator)가 Saga의 흐름을 관리합니다. 코디네이터는 각 서비스에 명령을 보내고, 서비스의 응답을 받아 다음 단계를 결정합니다.

**장점**:
*   Saga의 전체 흐름을 한눈에 파악하기 쉽습니다.
*   서비스 로직이 비교적 단순해집니다.

**단점**:
*   코디네이터가 단일 실패 지점이 될 수 있습니다.
*   코디네이터의 복잡도가 증가할 수 있습니다.

**예시 흐름**:
1.  **Order Service** (코디네이터 역할): `createOrder` 명령을 받음.
2.  **Order Service**: `createOrder` 로컬 트랜잭션 수행, `Order Created Event` 발행.
3.  **Order Service**: `Inventory Service`에 `deductStock` 명령 전송.
4.  **Inventory Service**: `deductStock` 로컬 트랜잭션 수행, `Stock Deducted Event` 발행.
5.  **Order Service**: `Payment Service`에 `processPayment` 명령 전송.
6.  **Payment Service**: `processPayment` 로컬 트랜잭션 수행, `Payment Processed Event` 발행.
7.  **Order Service**: 모든 단계 성공 확인 후 `Order Approved Event` 발행.

#### 1.2. 안무 Saga (Choreography Saga)

중앙 코디네이터 없이 각 서비스가 이벤트를 발행하고, 다른 서비스들은 해당 이벤트를 구독하여 다음 로컬 트랜잭션을 수행합니다. 서비스 간의 상호작용은 이벤트 기반으로 이루어집니다.

**장점**:
*   서비스 간의 결합도가 낮아 유연합니다.
*   단일 실패 지점이 없어 확장성이 좋습니다.

**단점**:
*   Saga의 전체 흐름을 추적하기 어렵습니다.
*   서비스 로직 내에서 보상 트랜잭션 처리가 더 복잡해질 수 있습니다.

**예시 흐름**:
1.  **Order Service**: `createOrder` 로컬 트랜잭션 수행, `Order Created Event` 발행.
2.  **Inventory Service**: `Order Created Event` 구독, `deductStock` 로컬 트랜잭션 수행, `Stock Deducted Event` 발행.
3.  **Payment Service**: `Stock Deducted Event` 구독, `processPayment` 로컬 트랜잭션 수행, `Payment Processed Event` 발행.
4.  **Order Service**: `Payment Processed Event` 구독, `Order Approved Event` 발행.

### 2. Outbox 패턴

Saga 패턴을 구현할 때, 서비스의 로컬 트랜잭션과 이벤트 발행을 원자적으로 처리하는 것이 매우 중요합니다. 즉, 로컬 데이터베이스에 변경사항이 저장되거나, 이벤트가 발행되거나 둘 다 실패해야 합니다. Outbox 패턴은 이 두 작업을 단일 로컬 트랜잭션 내에서 처리함으로써 메시지 발행의 신뢰성을 보장합니다.

서비스는 로컬 트랜잭션 내에서 비즈니스 데이터 변경과 함께 'outbox' 테이블에 발행할 이벤트를 저장합니다. 이후 별도의 프로세스(예: 메시지 브로커 폴링)가 outbox 테이블에서 이벤트를 읽어 메시지 브로커로 발행합니다.

### 3. Idempotency (멱등성)

분산 시스템에서는 네트워크 지연이나 서비스 장애로 인해 메시지 중복 전송 또는 재시도가 발생할 수 있습니다. 멱등성은 동일한 요청을 여러 번 수행하더라도 시스템 상태를 동일하게 유지하는 속성입니다. 이를 통해 서비스는 중복 메시지를 안전하게 처리할 수 있습니다.

예를 들어, 결제 서비스는 `transactionId`와 같은 고유한 식별자를 통해 이미 처리된 요청인지 확인하여 중복 결제를 방지할 수 있습니다.

### 4. 코드 예시 (Java - Outbox 패턴 기반 Saga 참여)

아래는 Java Spring 환경에서 Outbox 패턴을 활용하여 Saga에 참여하는 서비스의 간소화된 예시입니다. `OrderService`가 주문 생성 로컬 트랜잭션을 수행하고, 동시에 `OrderCreatedEvent`를 Outbox 테이블에 저장하는 방식입니다.

```java
// Order.java (도메인 엔티티)
@Entity
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String productId;
    private int quantity;
    private String status; // PENDING, APPROVED, CANCELLED

    // Getters, Setters, Builder pattern, etc.
    // ...
}

// OutboxEvent.java (Outbox 테이블에 저장될 이벤트 엔티티)
@Entity
public class OutboxEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String aggregateType; // 예: "Order"
    private Long aggregateId;    // 예: 주문 ID
    private String eventType;    // 예: "OrderCreated"
    private String payload;      // 이벤트 데이터 (JSON)
    private LocalDateTime createdAt;

    // Getters, Setters, Builder pattern, etc.
    // ...
}

// OrderService.java (Saga의 참여자이자 Outbox 패턴 적용)
@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper; // JSON 직렬화를 위한 ObjectMapper

    public OrderService(OrderRepository orderRepository, OutboxEventRepository outboxEventRepository, ObjectMapper objectMapper) {
        this.orderRepository = orderRepository;
        this.outboxEventRepository = outboxEventRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional // 단일 로컬 트랜잭션
    public Order createOrder(String productId, int quantity) {
        // 1. 주문 생성 (로컬 트랜잭션)
        Order order = Order.builder()
                .productId(productId)
                .quantity(quantity)
                .status("PENDING") // 초기 상태
                .build();
        Order savedOrder = orderRepository.save(order);

        // 2. Outbox 테이블에 이벤트 저장 (같은 로컬 트랜잭션 내)
        try {
            OrderCreatedEvent eventPayload = new OrderCreatedEvent(savedOrder.getId(), savedOrder.getProductId(), savedOrder.getQuantity());
            OutboxEvent outboxEvent = OutboxEvent.builder()
                    .aggregateType("Order")
                    .aggregateId(savedOrder.getId())
                    .eventType("OrderCreated")
                    .payload(objectMapper.writeValueAsString(eventPayload))
                    .createdAt(LocalDateTime.now())
                    .build();
            outboxEventRepository.save(outboxEvent);
        } catch (JsonProcessingException e) {
            // 이벤트 직렬화 실패 시 예외 처리 (트랜잭션 롤백 유도)
            throw new RuntimeException("Failed to serialize OrderCreatedEvent", e);
        }

        return savedOrder;
    }

    // 보상 트랜잭션 예시: 주문 취소
    @Transactional
    public void cancelOrder(Long orderId, String reason) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));

        if (!"CANCELLED".equals(order.getStatus())) {
            order.setStatus("CANCELLED");
            orderRepository.save(order);
            // 필요하다면 OrderCancelledEvent를 Outbox에 저장하여 다른 서비스에 알림
            // ...
        }
    }
}

// OrderCreatedEvent.java (이벤트 DTO)
public record OrderCreatedEvent(Long orderId, String productId, int quantity) {}

// OrderRepository, OutboxEventRepository는 Spring Data JPA Repository 인터페이스로 정의
// public interface OrderRepository extends JpaRepository<Order, Long> {}
// public interface OutboxEventRepository extends JpaRepository<OutboxEvent, Long> {}
```

이 예시에서는 `createOrder` 메서드가 단일 `@Transactional` 어노테이션으로 묶여 있어, 주문 정보 저장과 Outbox 테이블에 이벤트 저장 작업이 모두 성공하거나 모두 실패합니다. 이후 별도의 '이벤트 릴레이어(Event Relayer)' 프로세스가 `OutboxEvent` 테이블을 주기적으로 폴링하여 이벤트를 메시지 브로커(Kafka, RabbitMQ 등)로 발행하고, 성공적으로 발행된 이벤트는 Outbox 테이블에서 삭제합니다.

## ✅ 결론: 상황에 맞는 현명한 선택

MSA에서 분산 트랜잭션을 관리하는 것은 단순한 문제가 아니며, '만능 해결책'은 존재하지 않습니다. Saga 패턴은 결과적 일관성을 기반으로 MSA의 독립성을 유지하면서 데이터 일관성을 달성하는 강력한 방법이지만, 구현의 복잡성도 따릅니다.

어떤 패턴을 선택할지는 비즈니스 요구사항, 서비스 간의 복잡도, 필요한 일관성 수준, 그리고 팀의 숙련도에 따라 달라집니다. 시스템의 견고함을 위해서는 Saga 패턴 외에도 Outbox 패턴, 멱등성 구현, 분산 트레이싱, 강력한 모니터링 시스템 등이 함께 고려되어야 합니다.

MSA의 세계에서는 전통적인 트랜잭션 개념에서 벗어나, 데이터 일관성을 위한 새로운 접근 방식과 설계 철학을 깊이 이해하고 적용하는 것이 중요합니다. 지속적인 학습과 실험을 통해 여러분의 MSA가 더욱 견고하고 유연하게 진화하길 바랍니다.

<p class = "placeholder">Text by Chaelin & Gemini. Photographs by Chaelin, Unsplash.</p>