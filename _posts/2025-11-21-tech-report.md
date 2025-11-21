---
layout: post
title: "데이터베이스 정규화: 왜 필요하고 어떻게 적용할까?"
subtitle: "견고하고 효율적인 DB 설계를 위한 필수 원리"
date: 2025-11-21 00:58:55.507Z +0900
background: '/img/posts/pattern01.jpg'
category: Study
tags: [database,normalization,sql,db_design]
---

## 서론: 데이터의 뼈대를 세우는 작업, 정규화

데이터베이스는 애플리케이션의 핵심 데이터를 저장하고 관리하는 중요한 기반입니다. 잘 설계된 데이터베이스는 시스템의 성능, 안정성, 유지보수성에 지대한 영향을 미칩니다. 이 중 데이터베이스 `정규화(Normalization)`는 논리적인 데이터 모델링 과정에서 데이터의 중복성을 줄이고 무결성을 확보하기 위한 필수적인 설계 기법입니다.

오늘은 데이터베이스 정규화의 기본 원리를 깊이 있게 살펴보고, 왜 정규화가 중요한지, 그리고 어떻게 정규화 단계를 적용할 수 있는지 함께 알아보겠습니다.

## 본론: 정규화의 핵심 원리와 적용 단계

### 정규화란 무엇인가?

정규화는 관계형 데이터베이스의 설계 과정에서 데이터 중복을 최소화하고 데이터 무결성을 최대화하기 위해 테이블을 분리하고 재구성하는 과정입니다. 쉽게 말해, "데이터를 깔끔하게 정리하는 방법"이라고 할 수 있습니다. 이를 통해 데이터의 일관성을 유지하고, 불필요한 저장 공간 낭비를 줄이며, 데이터 삽입, 갱신, 삭제 시 발생할 수 있는 이상(Anomaly) 현상을 방지합니다.

### 왜 정규화가 필요한가?

정규화를 통해 얻을 수 있는 주요 이점은 다음과 같습니다.

1.  **데이터 중복 감소**: 동일한 데이터가 여러 곳에 저장되는 것을 방지하여 저장 공간을 효율적으로 사용하고 데이터 일관성을 유지합니다.
2.  **데이터 무결성 강화**: 데이터의 정확성과 일관성을 높여, 잘못된 데이터가 저장되거나 변경되는 것을 막습니다.
3.  **이상 현상(Anomaly) 제거**:
    *   **삽입 이상(Insertion Anomaly)**: 불필요한 데이터를 함께 삽입해야 하거나, 필수 데이터를 삽입할 수 없는 문제.
    *   **갱신 이상(Update Anomaly)**: 중복된 데이터 중 일부만 갱신되어 데이터 불일치가 발생하는 문제.
    *   **삭제 이상(Deletion Anomaly)**: 특정 데이터를 삭제할 때, 의도하지 않은 다른 중요한 데이터까지 함께 삭제되는 문제.
4.  **데이터 모델의 유연성 및 확장성**: 테이블 구조가 명확해져 새로운 요구사항에 대한 변경 및 확장이 용이해집니다.

### 정규형(Normal Forms)의 단계

정규화는 여러 단계의 '정규형(Normal Form, NF)'으로 구분됩니다. 각 정규형은 이전 단계의 조건을 만족하면서 추가적인 제약 조건을 가집니다. 일반적으로 3차 정규형(3NF)까지 만족하는 것으로 충분하다고 간주됩니다.

#### 1차 정규형 (1NF: First Normal Form)

**조건**:
*   테이블의 모든 컬럼은 `원자 값(Atomic Value)`을 가져야 합니다. 즉, 하나의 컬럼에 여러 값이 포함될 수 없습니다.
*   모든 컬럼의 값이 반복되는 그룹을 가지지 않아야 합니다.

**예시**:
만약 `주문 테이블`에 한 주문이 여러 상품을 포함하는 경우 다음과 같이 설계될 수 있습니다.

```sql
-- 1NF를 위반하는 테이블 (반복 그룹 존재)
CREATE TABLE Orders_Violating_1NF (
    OrderID INT PRIMARY KEY,
    CustomerName VARCHAR(100),
    Item1 VARCHAR(50),
    Quantity1 INT,
    Item2 VARCHAR(50),
    Quantity2 INT
);

-- 예시 데이터
INSERT INTO Orders_Violating_1NF (OrderID, CustomerName, Item1, Quantity1, Item2, Quantity2)
VALUES (101, '김철수', '사과', 2, '바나나', 3);
```
위 테이블은 `Item1, Quantity1`과 `Item2, Quantity2`가 반복되는 그룹을 형성하고 있습니다. 1차 정규형을 만족시키려면 각 아이템을 별도의 행으로 분리해야 합니다.

```sql
-- 1NF를 만족하는 테이블 (주문 상세를 분리)
CREATE TABLE Orders_1NF (
    OrderID INT PRIMARY KEY,
    CustomerName VARCHAR(100)
);

CREATE TABLE OrderDetails_1NF (
    OrderID INT,
    ItemName VARCHAR(50),
    Quantity INT,
    PRIMARY KEY (OrderID, ItemName), -- 복합 기본 키
    FOREIGN KEY (OrderID) REFERENCES Orders_1NF(OrderID)
);

-- 예시 데이터
INSERT INTO Orders_1NF (OrderID, CustomerName) VALUES (101, '김철수');
INSERT INTO OrderDetails_1NF (OrderID, ItemName, Quantity) VALUES
(101, '사과', 2),
(101, '바나나', 3);
```

#### 2차 정규형 (2NF: Second Normal Form)

**조건**:
*   1차 정규형을 만족해야 합니다.
*   `완전 함수 종속(Full Functional Dependency)`을 만족해야 합니다. 즉, 기본 키가 복합 키(Composite Key)일 때, 기본 키의 부분 집합이 특정 비기본 키(Non-key attribute)를 결정해서는 안 됩니다.

**예시**:
`OrderDetails_1NF` 테이블에 상품의 가격 정보를 추가한다고 가정해봅시다.

```sql
-- 2NF를 위반하는 테이블 (부분 함수 종속 존재)
CREATE TABLE OrderDetails_Violating_2NF (
    OrderID INT,
    ItemName VARCHAR(50),
    Quantity INT,
    ItemPrice DECIMAL(10, 2), -- ItemPrice는 ItemName에만 종속
    PRIMARY KEY (OrderID, ItemName)
);

-- 예시 데이터
INSERT INTO OrderDetails_Violating_2NF (OrderID, ItemName, Quantity, ItemPrice) VALUES
(101, '사과', 2, 1000.00),
(101, '바나나', 3, 1500.00);
```
여기서 `OrderID, ItemName`이 복합 기본 키입니다. `ItemPrice`는 `OrderID`와 상관없이 `ItemName`에만 종속됩니다. 이는 부분 함수 종속이며 2NF를 위반합니다. `ItemPrice`는 `ItemName`이 결정하는 것이지 `OrderID`와 `ItemName`의 조합이 결정하는 것이 아닙니다.

이 문제를 해결하려면 상품 정보를 별도의 테이블로 분리합니다.

```sql
-- 2NF를 만족하는 테이블
CREATE TABLE Items_2NF (
    ItemName VARCHAR(50) PRIMARY KEY,
    ItemPrice DECIMAL(10, 2)
);

CREATE TABLE OrderDetails_2NF (
    OrderID INT,
    ItemName VARCHAR(50),
    Quantity INT,
    PRIMARY KEY (OrderID, ItemName),
    FOREIGN KEY (OrderID) REFERENCES Orders_1NF(OrderID),
    FOREIGN KEY (ItemName) REFERENCES Items_2NF(ItemName)
);

-- 예시 데이터
INSERT INTO Items_2NF (ItemName, ItemPrice) VALUES
('사과', 1000.00),
('바나나', 1500.00);

INSERT INTO OrderDetails_2NF (OrderID, ItemName, Quantity) VALUES
(101, '사과', 2),
(101, '바나나', 3);
```

#### 3차 정규형 (3NF: Third Normal Form)

**조건**:
*   2차 정규형을 만족해야 합니다.
*   기본 키가 아닌 모든 컬럼이 기본 키에 `이행적 함수 종속(Transitive Functional Dependency)`을 가지지 않아야 합니다. 즉, "기본 키 -> A -> B" 관계가 있을 때, A가 기본 키가 아니라면 A와 B를 분리해야 합니다.

**예시**:
`Orders_1NF` 테이블에 고객의 거주 도시 정보를 추가한다고 가정해봅시다.

```sql
-- 3NF를 위반하는 테이블 (이행적 함수 종속 존재)
CREATE TABLE Orders_Violating_3NF (
    OrderID INT PRIMARY KEY,
    CustomerName VARCHAR(100),
    CustomerAddress VARCHAR(200),
    CustomerCity VARCHAR(50),
    CityZipCode VARCHAR(10) -- CityZipCode는 CustomerCity에 종속
);

-- 예시 데이터
INSERT INTO Orders_Violating_3NF (OrderID, CustomerName, CustomerAddress, CustomerCity, CityZipCode) VALUES
(101, '김철수', '서울시 강남구', '서울', '06000');
```
여기서 `OrderID`가 기본 키입니다. `CustomerName`, `CustomerAddress`, `CustomerCity`는 `OrderID`에 직접 종속됩니다. 하지만 `CityZipCode`는 `CustomerCity`에 종속되고, `CustomerCity`가 `OrderID`에 종속되는 이행적 함수 종속 관계가 있습니다. `CustomerCity`가 변경되면 `CityZipCode`도 변경되어야 합니다.

이를 해결하려면 도시 정보를 별도의 테이블로 분리합니다.

```sql
-- 3NF를 만족하는 테이블
CREATE TABLE Cities_3NF (
    CityName VARCHAR(50) PRIMARY KEY,
    ZipCode VARCHAR(10)
);

CREATE TABLE Customers_3NF (
    CustomerID INT PRIMARY KEY AUTO_INCREMENT,
    CustomerName VARCHAR(100),
    CustomerAddress VARCHAR(200),
    CustomerCity VARCHAR(50),
    FOREIGN KEY (CustomerCity) REFERENCES Cities_3NF(CityName)
);

CREATE TABLE Orders_3NF (
    OrderID INT PRIMARY KEY,
    CustomerID INT,
    FOREIGN KEY (CustomerID) REFERENCES Customers_3NF(CustomerID)
);

-- 예시 데이터
INSERT INTO Cities_3NF (CityName, ZipCode) VALUES ('서울', '06000');
INSERT INTO Customers_3NF (CustomerName, CustomerAddress, CustomerCity) VALUES ('김철수', '서울시 강남구', '서울');
INSERT INTO Orders_3NF (OrderID, CustomerID) VALUES (101, 1);
```
이제 `CityZipCode`는 `Cities_3NF` 테이블의 `CityName`에만 종속됩니다.

#### 그 이상의 정규형

*   **BCNF (보이스-코드 정규형)**: 3NF의 강화된 형태로, 모든 결정자가 후보 키여야 합니다. 3NF에서 발생할 수 있는 특정 유형의 이상 현상(특히 복합 키와 여러 후보 키가 있는 경우)을 해결합니다.
*   **4NF (4차 정규형)**: 다중값 종속성(Multi-valued dependency)을 제거합니다.
*   **5NF (5차 정규형)**: 조인 종속성(Join dependency)을 제거합니다.

대부분의 상업용 애플리케이션에서는 3NF 또는 BCNF까지 정규화를 수행하는 것이 일반적이며, 그 이상은 복잡도와 성능 저하를 야기할 수 있어 신중하게 고려해야 합니다.

### 비정규화(Denormalization)

정규화는 데이터의 일관성과 무결성을 높이지만, 때로는 여러 테이블을 조인(JOIN)해야 하므로 쿼리 성능이 저하될 수 있습니다. 이러한 경우, 의도적으로 정규화 원칙을 일부 위반하여 테이블을 통합하거나 중복 데이터를 추가하는 `비정규화(Denormalization)`를 수행하기도 합니다. 이는 주로 읽기 성능이 매우 중요한 OLAP(온라인 분석 처리) 시스템이나 데이터 웨어하우스에서 활용됩니다. 하지만 비정규화는 데이터 무결성 위험을 증가시키므로 신중한 접근이 필요합니다.

## 결론: 견고한 데이터 모델링의 시작

데이터베이스 정규화는 단순히 데이터를 여러 테이블로 나누는 작업이 아닙니다. 이는 데이터의 논리적인 구조를 파악하고, 불필요한 중복을 제거하며, 데이터의 정확성과 일관성을 보장하여 장기적으로 안정적이고 효율적인 시스템을 구축하는 기반을 마련하는 중요한 과정입니다.

오늘 알아본 1NF, 2NF, 3NF의 원리를 이해하고 실제 프로젝트에 적용한다면, 더욱 견고하고 유지보수가 용이한 데이터베이스를 설계할 수 있을 것입니다. 물론 항상 3NF를 고집할 필요는 없으며, 시스템의 특성과 성능 요구사항에 따라 적절한 정규화 수준과 비정규화를 고려하는 유연한 접근 방식이 중요합니다. 여러분의 다음 프로젝트에서 정규화의 힘을 느껴보시길 바랍니다!

<p class = "placeholder">Text by Chaelin & Gemini. Photographs by Chaelin, Unsplash.</p>