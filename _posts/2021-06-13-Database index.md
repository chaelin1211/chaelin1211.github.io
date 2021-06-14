---
layout: post
title: "[DB] Database Index"
subtitle: "데이터베이스 인덱스, B-tree 인덱스와 Bitmap 인덱스"
date: 2021-06-13 4:25:00 +0900
background: '/img/posts/jekyll-02.png'
category: Study
tags: [database, interview]
---
### DB 인덱스
추가적인 저장 공간을 활용하여 조회 성능을 향상시킬 목적으로 사용하는 자료구조입니다.

책의 색인과 같은 역할을 한다고 보면 됩니다. 전체를 순회하는 시간을 아껴 빠르게 조회할 수 있습니다.

뷰(View)와는 다르게 실제 저장 공간을 필요로 합니다.

위에선 조회(SELECT) 성능이라고 했지만 추가적으로 UPDATE, DELETE 성능도 향상됩니다.

UPDATE, DELETE에서도 대상 조회가 필요하기 때문입니다.

*****

### 주의할 점 
위에서 UPDATE, DELETE에서 성능이 향상된다고 했지만, 인덱스가 적용된 컬럼을 대상으로 수정, 삭제가 수행되면 다음의 추가 연산에 의한 성능 저하가 발생합니다.

* UPDATE: 기존 인덱스를 비사용 처리 후 수정된 데이터에 대해 인덱스를 추가합니다.
* DELETE: 기존 인덱스를 비사용 처리합니다.

인덱스 또한 저장공간을 사용하기 때문에 비사용 처리되는 인덱스가 많아지면 비대해진 인덱스에 의해 성능이 저하될 수 있습니다.

그렇기에 Update가 빈번하지 않은 컬럼에 인덱스를 추가해야 합니다.

*****

인덱스 키값은 순자적으로 저장됩니다. Sort List로 저장되기 때문에 Insert, Delete 시에 시간이 소요됩니다.

*****

### 장점
* 조회 성능을 향상시킬 수 있습니다.
* 전반적인 시스템의 부하를 줄일 수 있습니다.

### 단점
* 인덱스를 관리하기 위해 기존 데이터와 별도로 저장 공간이 필요합니다.
* 적절하지 못한 사용의 경우 오히려 성능이 저하될 수 있습니다.

*****

### 인덱스 종류
#### B-Tree 인덱스
<img class="img-fluid" src="/img/posts/inPost/index-01.png">

* Root Node로 접근하여 순차적으로 내려가며 실제 데이터의 주소를 찾습니다.
* Leaf Block에 디스크에 저장되어 있는 주소가 들어있습니다.

B-tree 인덱스는 DBMS에서 가장 범용적으로 사용되는 자료구조로, Balanced Tree라는 의미를 가지고 있습니다.

즉, Binary Search Tree와 유사하나 Tree의 높이를 자동으로 바로 잡아 주는 기능이 있어 검색 성능을 향상시킵니다. 다만, Insert, Delete 등의 시간 효율을 희생합니다.

자동으로 높이를 바로 잡는 다는 것은, 데이터 삽입/삭제 시에 트리 노드에 저장된 주소의 수가 비등하지 않고 한 쪽이 비대해질 경우 바로 잡아주는 것입니다.

<img class="img-fluid" src="/img/posts/inPost/b-tree-01.png">

Branch Node와 Leaf Node의 일부를 가져왔습니다.

페이지엔 저장될 수 있는 데이터의 수가 한정되어 있습니다. 

현재 페이지 2가 full이라고 가정했을 때, 데이터 [6]이 들어오면 페이지를 새로 하나 만들기만 하는 것이 아니라 균등하게 되도록 페이지 2의 데이터를 나누어 저장합니다.

그래서 다음과 같은 형태가 됩니다.

<img class="img-fluid" src="/img/posts/inPost/b-tree-02.png">

이런 작업을 거치기 때문에 Insert, Delete 성능이 떨어지는 것입니다.

데이터의 활용 방식에 따라 적절히 사용해야 합니다.

*****

#### Bitmap 인덱스
비트맵 인덱스는 비트를 이용하여 컬럼 값을 저장하고 ROWID를 자동으로 생성하는 인덱스의 한 방법입니다.

비트맵 인덱스에서는 ROWID 목록 대신 각 키 값에 대한 비트맵이 사용됩니다. 비트맵의 ​​각 비트는 가능한 ROWID에 해당하며, 비트가 설정된 경우 해당 ROWID가있는 행에 키 값이 포함되어 있음을 의미합니다.

비트맵 인덱스는 ROWID와 일련의 비트만 저장하기 때문에 B-tree 인덱스보다 작습니다.

비트맵 인덱스는 일반적으로 데이터 조회 시에 좋은 성능을 내기 때문에 데이터 웨어하우스 환경에서 유용합니다.

* NULL도 인덱싱되므로 NULL을 기반으로 하는 조건을 검색할 수 있습니다.
* DML(Insert, Delete, Update)는 잘 수행할 수 없습니다. 비용이 많이 들기 때문에 주의해야 합니다.
* Multi-column read-only 인덱스에 유용합니다.
    * 그리고 이들을 함께 Where 절에 자주 함께 사용한다면 비트맵 인덱스를 사용하는 것이 좋습니다.
* 옵티마이저는 인덱스 된 여러 비트맵을 쉽게 결합 할 수 있기에 쿼리에서 복잡한 필터를 효율적으로 실행할 수 있습니다.

*****

### B-tree Index vs Bitmap Index
* 카디널리티 차이: 일반적으로 비트맵 인덱스는 중복이 많은(낮은 카디널리티) 열에 사용되는 반면 B-tree 인덱스는 중복이 적은(높은 카디널리티) 열에 가장 적합합니다.
    * 예로, 성별 컬럼처럼 0, 1 두 개의 값으로만 이루어지는 Column의 경우 비트맵 인덱스가 이상적입니다.
    * 전화번호나 고객 이름과 같이 중복이 적은 경우엔 B-tree 인덱스가 이상적입니다.
* 내부 구조 차이 : 내부 구조가 상당히 다릅니다. B-tree 인덱스에는 인덱스 노드 (데이터 블록 크기 기준)가 있으며 트리 형식입니다.
* NULL 인덱싱: 일반적인 B-tree의 경우, 모든 열 값이 NULL인 경우 인덱스에서 제외됩니다.
    * 위에서 본 비트맵 인덱스의 특징처럼 비트맵 인덱스는 NULL도 인덱싱합니다. 

*****

> 참조
* <a href="https://beelee.tistory.com/37">https://beelee.tistory.com/37</a>
* <a href="https://logicalread.com/oracle-11g-bitmap-indexes-mc02/#.YMdI-kzlJPY">https://logicalread.com/oracle-11g-bitmap-indexes-mc02/#.YMdI-kzlJPY</a>
* <a href="https://docs.oracle.com/cd/A81042_01/DOC/server.816/a76994/indexes.htm">https://docs.oracle.com/cd/A81042_01/DOC/server.816/a76994/indexes.htm</a>

감사합니다.

<p class = "placeholder">Photographs by Chaelin, Unsplash.</p>