---
layout: post
title: "[2021]일일기록 (2021.12.15~)"
subtitle: "하루에 공부한 것 / 알게된 것 간단 정리"
date: 2021-12-15 16:51:00 +0900
background: '/img/posts/plugin.jpg'
category: Study
tags: [til]
---

### 2021.12.15
* transaction 
  
    Spring / myBatis 환경에서 transaction 추가   
    기존 프로젝트에 DataSourceTransactionManager가 설정되어 있어 간단하게 @Transactional로 추가할 수 있었다.

    **테스트 방법**   
      한 번에 여러 쿼리를 수행해야 하는 method에 해당 annotation을 달고 debugging 상태로 쿼리를 하나씩 수행한 후, 실제 데이터에 변화가 있는지 확인   
      
      결과적으로 오류 없이 모든 쿼리의 수행이 끝나야 한 번에 commit 됨을 확인할 수 있었다.
    
    **참고 사이트**   
    <a href="https://mybatis.org/spring/ko/transactions.html">https://mybatis.org/spring/ko/transactions.html</a>   
    <a href="https://velog.io/@kdhyo/JavaTransactional-Annotation-%EC%95%8C%EA%B3%A0-%EC%93%B0%EC%9E%90-26her30h">https://velog.io/@kdhyo/JavaTransactional-Annotation-%EC%95%8C%EA%B3%A0-%EC%93%B0%EC%9E%90-26her30h</a>
    
  
*****
