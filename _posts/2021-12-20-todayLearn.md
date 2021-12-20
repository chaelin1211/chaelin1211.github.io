---
layout: post
title: "[2021] 일일기록 (2021.12.15~)"
subtitle: "하루에 공부한 것 / 알게된 것 간단 정리"
date: 2021-12-20 15:06:00 +0900
background: '/img/posts/til.jpg'
category: Study
tags: [til]
---

### 2021.12.15
* transaction 
  
    Spring / myBatis 환경에서 transaction 추가   
    기존 프로젝트에 DataSourceTransactionManager가 설정되어 있어 간단하게 @Transactional로 추가할 수 있었다.

    **테스트 방법**   
      한 번에 여러 쿼리를 수행해야 하는 method에 해당 annotation을 달고 debugging 상태로 쿼리를 하나씩 수행한 후, 실제 데이터에 변화가 있는지 확인
  > 결과적으로 오류 없이 모든 쿼리의 수행이 끝나야 한 번에 commit 됨을 확인할 수 있었다.
    
    **참고 사이트**   
    <a href="https://mybatis.org/spring/ko/transactions.html">https://mybatis.org/spring/ko/transactions.html</a>   
    <a href="https://velog.io/@kdhyo/JavaTransactional-Annotation-%EC%95%8C%EA%B3%A0-%EC%93%B0%EC%9E%90-26her30h">https://velog.io/@kdhyo/JavaTransactional-Annotation-%EC%95%8C%EA%B3%A0-%EC%93%B0%EC%9E%90-26her30h</a>
    
  
*****

### 2021.12.20
* org.springframework.util.StringUtils.isEmpty

  JAVA의 String, StringBuilder class에서 제공되어야 할 몇 기능을 제공하고, 구분된 문자열 간의 비교 기능도 제공 (ex. csv)

  * isEmpty()   
    문자열이 빈 문자열이거나 null인 경우 true -> "" or null

    ``` java

    StringUtils.isEmpty(null) = true
    StringUtils.isEmpty("") = true
    StringUtils.isEmpty(" ") = false
    StringUtils.isEmpty("Hello") = false

    ```

  * hasLength()   
    isEmpty()와 반대 -> !isEmpty()

    ``` java

    StringUtils.hasLength(null) = false
    StringUtils.hasLength("") = false
    StringUtils.hasLength(" ") = true
    StringUtils.hasLength("Hello") = true

    ```

  **참고 사이트**   
  <a href= "https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/util/StringUtils.html#isEmpty-java.lang.Object-">https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/util/StringUtils.html#isEmpty-java.lang.Object-</a>
