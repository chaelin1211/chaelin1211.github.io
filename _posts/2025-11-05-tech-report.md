---
layout: post
title: "대규모 데이터베이스의 필살기: DB Sharding 전략 완벽 가이드"
subtitle: "성능과 확장성의 한계를 넘어서는 데이터 분산 기법"
date: 2025-11-05 00:55:39.648Z +0900
background: '/img/posts/pattern01.jpg'
category: Study
tags: [database,sharding,performance]
---

## 대규모 서비스를 위한 선택, DB Sharding

오늘날 서비스들은 방대한 데이터를 처리하며 끊임없이 확장되고 있습니다. 단일 데이터베이스 서버가 처리할 수 있는 용량을 초과하거나 성능 병목 현상이 발생할 때, 수직 스케일링(더 강력한 서버 사용)만으로는 한계에 부딪힙니다. 이때 수평 스케일링의 핵심 전략 중 하나인 DB Sharding이 빛을 발합니다.

Sharding은 대규모 데이터베이스를 여러 개의 작은 조각(Shard)으로 분할하여 서로 다른 서버에 분산 저장하는 기법입니다. 이를 통해 각 Shard는 독립적으로 데이터를 처리하며, 전체 시스템의 처리량과 가용성을 크게 향상시킬 수 있습니다. 오늘은 주요 DB Sharding 전략들을 살펴보며, 서비스의 특성에 맞는 최적의 방법을 모색해 보겠습니다.

## 주요 DB Sharding 전략

Sharding을 구현하는 방법은 다양하며, 각 전략은 장단점을 가지고 있습니다. 서비스의 데이터 특성과 쿼리 패턴을 고려하여 신중하게 선택해야 합니다.

### 1. Key-based (Hash-based) Sharding

가장 일반적인 Sharding 전략 중 하나입니다. 특정 컬럼(Shard Key)의 값에 해시 함수를 적용하여 Shard를 결정합니다. 예를 들어, 사용자 ID를 Shard Key로 사용하고, 사용자 ID를 N으로 나눈 나머지 값에 따라 Shard를 할당하는 방식입니다.

*   **장점:** 데이터가 Shard들 사이에 비교적 고르게 분산되어 Hotspot 발생 위험이 적습니다.
*   **단점:** 특정 범위의 데이터를 조회하는 Range Query에는 비효율적일 수 있습니다. Shard를 추가하거나 제거할 때 데이터 재분배(Rebalancing)가 복잡할 수 있습니다.

**예시 (Python 개념 코드):**
```python
def get_shard_id_by_hash(user_id: int, num_shards: int) -> int:
    """
    사용자 ID를 기반으로 Shard ID를 계산합니다. (해시 기반)
    """
    return user_id % num_shards

# 예시: 총 4개의 Shard가 있을 때
num_shards = 4
print(f"User 12345는 Shard {get_shard_id_by_hash(12345, num_shards)}에 할당됩니다.")
print(f"User 67890는 Shard {get_shard_id_by_hash(67890, num_shards)}에 할당됩니다.")
```

### 2. Range-based Sharding

Shard Key의 특정 값 범위를 기준으로 데이터를 분할합니다. 예를 들어, 사용자 ID 1~10000은 Shard 1, 10001~20000은 Shard 2 등으로 나눌 수 있습니다. 시간 범위를 기준으로 데이터를 분할하는 경우도 많습니다.

*   **장점:** 특정 범위의 데이터를 조회하는 Range Query에 매우 효율적입니다. 데이터 추가 시 Shard Key의 범위가 증가하는 경우 새로운 데이터가 한 Shard에만 집중되는 경향이 있어 확장이 용이할 수 있습니다.
*   **단점:** 특정 범위에 데이터가 몰릴 경우 Hotspot이 발생할 수 있습니다. 데이터 분포가 고르지 않으면 Shard 간의 불균형이 심해질 수 있습니다.

### 3. Directory-based Sharding

Sharding 정보를 별도의 디렉터리 서비스(또는 룩업 테이블)에 관리합니다. 애플리케이션은 Shard Key를 사용하여 디렉터리 서비스에 어떤 Shard에 접근해야 하는지 질의하고, 그 정보를 바탕으로 실제 Shard에 접근합니다.

*   **장점:** 매우 유연합니다. 데이터 재분배나 Shard 추가/제거 시 디렉터리 정보만 업데이트하면 되므로 운영 부담이 적습니다.
*   **단점:** 디렉터리 서비스 자체가 단일 장애점(Single Point of Failure)이 될 수 있으며, 추가적인 네트워크 지연이 발생할 수 있습니다.

### 4. Geographic (Location-based) Sharding

사용자의 지리적 위치에 따라 데이터를 분할합니다. 예를 들어, 한국 사용자의 데이터는 한국 내 서버에, 미국 사용자의 데이터는 미국 내 서버에 저장하는 방식입니다.

*   **장점:** 사용자에게 낮은 응답 지연 시간을 제공하며, 데이터 주권(Data Sovereignty) 규정 준수에 유리합니다.
*   **단점:** 전 세계적으로 서비스를 제공하는 경우, 특정 사용자의 데이터가 여러 지역에 걸쳐 분산될 수 있어 복잡성이 증가합니다.

## Sharding 구현 시 고려사항

Sharding은 강력한 전략이지만, 도입 시 신중한 설계와 고려가 필요합니다.

*   **Shard Key 선택:** Shard Key는 데이터 분포를 결정하고 쿼리 성능에 큰 영향을 미치므로 신중하게 선택해야 합니다. 가급적 변경되지 않는 고유한 값으로, 데이터 분포가 고른 키를 사용하는 것이 좋습니다.
*   **Cross-Shard Query:** 여러 Shard에 걸쳐 데이터를 조회하거나 조인해야 하는 경우 쿼리가 복잡해지고 성능 저하가 발생할 수 있습니다.
*   **데이터 재분배 (Rebalancing):** 서비스 확장이나 데이터 불균형 발생 시 Shard 간 데이터를 재분배하는 작업은 매우 복잡하고 서비스 중단이 발생할 수 있습니다.
*   **분산 트랜잭션:** 여러 Shard에 걸쳐 트랜잭션을 처리해야 하는 경우, 2PC (Two-Phase Commit)와 같은 복잡한 분산 트랜잭션 관리 기법이 필요할 수 있습니다.
*   **전역 고유 식별자 (Global Unique ID):** 각 Shard에서 독립적으로 ID를 생성할 경우 충돌이 발생할 수 있으므로, UUID 또는 트위터 Snowflake와 같은 전역 고유 ID 생성 전략이 필요합니다.

## 결론

DB Sharding은 대규모 트래픽과 데이터를 처리해야 하는 현대 애플리케이션에게 필수적인 확장성 전략입니다. Hash-based, Range-based, Directory-based 등 다양한 전략 중 서비스의 특성에 가장 적합한 방식을 선택하고, Sharding이 가져올 수 있는 복잡성 또한 충분히 고려하여 설계해야 합니다.

성능과 확장성을 동시에 잡는 DB Sharding! 잘 계획된 Sharding 전략은 여러분의 서비스가 한 단계 더 도약할 수 있는 튼튼한 기반을 제공할 것입니다. 다음 포스트에서는 Sharding 구현 시 발생할 수 있는 구체적인 문제점들과 해결 방안에 대해 더 깊이 다뤄보겠습니다.

<p class = "placeholder">Text by Chaelin & Gemini. Photographs by Chaelin, Unsplash.</p>
