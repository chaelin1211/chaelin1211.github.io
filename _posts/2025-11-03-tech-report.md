---
layout: post
title: "데이터베이스 트랜잭션 격리 수준: 완벽 이해 가이드"
subtitle: "동시성 제어와 데이터 일관성 유지의 핵심"
date: 2025-11-03 00:56:33.304Z +0900
background: '/img/posts/pattern01.jpg'
category: Study
tags: [db,sql,transaction,isolation level]
---

# 데이터베이스 트랜잭션 격리 수준: 완벽 이해 가이드

## 동시성 제어와 데이터 일관성 유지의 핵심

데이터베이스를 사용하는 애플리케이션에서 여러 사용자가 동시에 데이터를 읽고 쓰는 작업은 흔하게 발생합니다. 이때, 동시성 문제로 인해 데이터의 일관성이 깨지는 것을 방지하는 것이 매우 중요합니다. 이를 위해 데이터베이스는 **트랜잭션(Transaction)**이라는 개념을 사용하며, 트랜잭션의 핵심 속성 중 하나가 바로 **격리(Isolation)**입니다. 오늘은 이 격리 수준에 대해 심도 있게 알아보겠습니다.

### 서론: 트랜잭션과 격리의 중요성

트랜잭션은 데이터베이스의 논리적인 작업 단위로, ACID(Atomicity, Consistency, Isolation, Durability) 속성을 만족해야 합니다. 이 중 격리(Isolation)는 동시에 실행되는 트랜잭션들이 서로에게 영향을 주지 않고 독립적으로 실행되는 것을 보장하는 속성입니다. 마치 여러 명이 같은 문서를 수정할 때, 각자가 자신의 수정 내용을 다른 사람에게 방해받지 않고 적용하는 것과 같습니다. 하지만 완벽한 격리는 시스템의 성능 저하로 이어질 수 있기에, SQL 표준에서는 다양한 격리 수준을 정의하여 개발자가 필요에 따라 선택할 수 있도록 합니다.

### 본문: 격리 수준과 발생 가능한 문제

트랜잭션 격리 수준은 크게 네 가지로 나뉘며, 낮은 수준일수록 동시성은 높지만 데이터 일관성 문제는 발생할 가능성이 커지고, 높은 수준일수록 동시성은 낮아지지만 데이터 일관성은 완벽하게 보장됩니다. 각 격리 수준을 이해하기 전에, 먼저 격리 수준에 따라 발생할 수 있는 주요 동시성 문제들을 살펴보겠습니다.

1.  **더티 리드(Dirty Read)**:
    아직 커밋되지 않은(롤백될 수도 있는) 다른 트랜잭션의 데이터를 읽는 현상입니다. 만약 읽은 데이터가 롤백되면, 현재 트랜잭션은 유효하지 않은 데이터를 기반으로 작업을 수행하게 됩니다.

2.  **반복 불가능한 읽기(Non-Repeatable Read)**:
    한 트랜잭션 내에서 같은 쿼리를 두 번 수행했을 때, 다른 트랜잭션이 그 사이에 데이터를 수정하거나 삭제하여 첫 번째와 두 번째 쿼리의 결과가 다르게 나타나는 현상입니다.

3.  **환영 읽기(Phantom Read)**:
    한 트랜잭션 내에서 특정 조건으로 레코드를 조회했을 때, 다른 트랜잭션이 그 사이에 새로운 레코드를 삽입하여 첫 번째와 두 번째 쿼리의 결과 집합(레코드 수)이 다르게 나타나는 현상입니다.

이제 각 격리 수준이 이러한 문제들을 어떻게 방지하는지 알아보겠습니다.

#### 1. READ UNCOMMITTED (가장 낮은 격리 수준)

*   **설명**: 다른 트랜잭션에서 아직 커밋되지 않은 데이터를 읽는 것을 허용합니다.
*   **문제**: 더티 리드, 반복 불가능한 읽기, 환영 읽기 모두 발생 가능합니다.
*   **사용 사례**: 극도로 빠른 읽기 작업이 필요하고, 데이터 일관성이 크게 중요하지 않은 통계성 쿼리 등에 제한적으로 사용됩니다. 거의 사용되지 않습니다.

```sql
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
-- 트랜잭션 시작
BEGIN TRANSACTION;
SELECT * FROM accounts WHERE id = 1;
-- 다른 트랜잭션이 id=1의 잔액을 변경하고 커밋하지 않음
SELECT * FROM accounts WHERE id = 1; -- 변경된(커밋되지 않은) 데이터를 읽을 수 있음
COMMIT;
```

#### 2. READ COMMITTED (대부분의 RDBMS 기본값)

*   **설명**: 커밋된 데이터만 읽는 것을 허용합니다. 다른 트랜잭션이 커밋하기 전의 데이터는 읽을 수 없습니다.
*   **문제 방지**: 더티 리드를 방지합니다.
*   **문제 발생**: 반복 불가능한 읽기, 환영 읽기는 여전히 발생할 수 있습니다.
*   **사용 사례**: 가장 일반적인 격리 수준으로, 데이터 일관성과 동시성 간의 적절한 균형을 제공합니다.

```sql
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
-- 트랜잭션 시작
BEGIN TRANSACTION;
SELECT balance FROM accounts WHERE id = 1; -- 100
-- (다른 트랜잭션) UPDATE accounts SET balance = 150 WHERE id = 1; COMMIT;
SELECT balance FROM accounts WHERE id = 1; -- 150 (반복 불가능한 읽기 발생)
COMMIT;
```

#### 3. REPEATABLE READ

*   **설명**: 한 트랜잭션 내에서 같은 쿼리를 여러 번 수행했을 때 항상 동일한 결과를 보장합니다. 트랜잭션이 시작될 때 스냅샷을 찍어, 그 스냅샷을 기반으로 데이터를 읽습니다.
*   **문제 방지**: 더티 리드, 반복 불가능한 읽기를 방지합니다.
*   **문제 발생**: 환영 읽기는 여전히 발생할 수 있습니다. (스냅샷이 특정 행에 대한 잠금을 걸지만, 새로운 행의 삽입까지는 막지 못함)
*   **사용 사례**: 데이터의 일관성이 높게 요구되는 복잡한 비즈니스 로직에 사용될 수 있습니다. MySQL의 InnoDB 스토리지 엔진의 기본 격리 수준입니다.

```sql
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
-- 트랜잭션 시작
BEGIN TRANSACTION;
SELECT COUNT(*) FROM orders WHERE status = 'pending'; -- 5개
-- (다른 트랜잭션) INSERT INTO orders (status) VALUES ('pending'); COMMIT;
SELECT COUNT(*) FROM orders WHERE status = 'pending'; -- 여전히 5개 (환영 읽기 발생 가능성 있음, DB 구현체에 따라 다름)
COMMIT;
```
*Note: MySQL InnoDB의 `REPEATABLE READ`는 기본적으로 넥스트 키 락(Next-Key Lock)을 사용하여 팬텀 리드까지 방지하는 구현이 많습니다. 하지만 SQL 표준에서는 팬텀 리드가 발생할 수 있다고 정의합니다.*

#### 4. SERIALIZABLE (가장 높은 격리 수준)

*   **설명**: 트랜잭션들을 순차적으로 실행하는 것과 같은 효과를 냅니다. 가장 엄격한 격리 수준으로, 동시성 문제를 완전히 방지합니다.
*   **문제 방지**: 더티 리드, 반복 불가능한 읽기, 환영 읽기 모두 방지합니다.
*   **문제 발생**: 동시성이 크게 저하되어 성능 문제가 발생할 수 있습니다. 많은 잠금(Lock)을 사용하게 됩니다.
*   **사용 사례**: 데이터의 무결성이 절대적으로 중요한 금융 거래와 같은 시나리오에 사용됩니다.

```sql
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
-- 트랜잭션 시작
BEGIN TRANSACTION;
SELECT SUM(amount) FROM transactions WHERE account_id = 1;
-- (다른 트랜잭션) INSERT INTO transactions ...; 또는 UPDATE transactions ...; 시도 시 대기 (Lock 발생)
SELECT SUM(amount) FROM transactions WHERE account_id = 1; -- 첫 번째 쿼리와 동일한 결과 보장
COMMIT;
```

### 결론: 올바른 격리 수준 선택하기

각 격리 수준은 장단점을 가지고 있으므로, 애플리케이션의 특성과 요구사항에 맞춰 신중하게 선택해야 합니다.

*   **성능이 최우선이고 데이터 일관성 허용 범위가 넓다면**: `READ UNCOMMITTED` (권장하지 않음)
*   **대부분의 웹 애플리케이션**: `READ COMMITTED` (일반적으로 좋은 균형점)
*   **특정 트랜잭션 내에서 동일한 조회 결과가 강력히 보장되어야 할 때**: `REPEATABLE READ`
*   **데이터 무결성이 절대적으로 중요하며 동시성 저하를 감수할 수 있을 때**: `SERIALIZABLE`

대부분의 경우 `READ COMMITTED` 또는 `REPEATABLE READ`가 좋은 출발점이 됩니다. 하지만 사용 중인 데이터베이스 시스템(PostgreSQL, MySQL, Oracle 등)마다 격리 수준의 구현 방식과 기본값이 다를 수 있으므로, 해당 데이터베이스의 문서를 참고하여 정확히 이해하는 것이 중요합니다. 효율적인 격리 수준 선택은 안정적인 서비스 운영과 직결됩니다.

<p class = "placeholder">Text by Chaelin & Gemini. Photographs by Chaelin, Unsplash.</p>