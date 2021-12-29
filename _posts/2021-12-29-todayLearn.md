---
layout: post
title: "[2021] 일일기록 (2021.12.15~)"
subtitle: "하루에 공부한 것 / 알게된 것 간단 정리"
date: 2021-12-29 14:24:00 +0900
background: '/img/posts/til.jpg'
category: Study
tags: [til]
---

## 월간 목표
1. TIL 카테고리 분리와 정리를 어떻게 할 것인지... 정해서 적용하기
2. JPA 강의 진도율 40%

*****

<a href="#id211215">2021.12.15</a>   
<a href="#id211220">2021.12.20</a>   
<a href="#id211222">2021.12.22</a>   
<a href="#id211229">2021.12.29</a> 

*****

<h3 id="id211215">2021.12.15</h3>

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

<h3 id="id211220">2021.12.20</h3>

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

*****

<h3 id="id211222">2021.12.22</h3>

* JPA 강의 수강
  기본 강의를 듣지 않고 활용 강의를 들어서 보충이 필요한 부분 공부 & 강의 수강
  
  * 도서[자바 ORM 표준 JPA 프로그래밍] - 5장 연관관계와 매핑 기초
  
  * 강의 [실전! 스프링부트와 JPA 활용] - 도메인 모델과 테이블 설계
*****

<h3 id="id211229">2021.12.29</h3>

* Jekyll 실행 오류
  <a href="https://chaelin1211.github.io/study/2021/02/11/jekyll-and-ruby.html">2. Jekyll & Ruby 적용 (윈도우)</a>에서 최신 버전으로 Ruby를 다운했더니 오류 발생
  * 오류 1번: Could not find gem 'jekyll-paginate (~> 1.1.0)' in locally installed gems. (Bundler::GemNotFound)   
    * 해결 방법: Run `bundle install` to install missing gems.
    
      ```
      > bundle install
      ```
      
  * 오류 2번: cannot load such file -- webrick (LoadError)
    
    기존 ruby 버전에서 포함되었던 gem이 제외됐기 때문!
    
    * 해결 방법
    
    ```
    > bundle add webrik
    ```
    
  **참고 사이트**   
  * <a href= "https://junho85.pe.kr/1850">https://junho85.pe.kr/1850</a>
  * <a href= "https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=flowerdances&logNo=221110593847">https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=flowerdances&logNo=221110593847</a>

*****
