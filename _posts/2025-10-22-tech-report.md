---
layout: post
title: "JPA N+1 문제, 효율적인 데이터 로딩 전략으로 극복하기"
subtitle: "성능 저하의 주범 N+1 쿼리, 이제 안녕!"
date: 2025-10-22 07:23:29.054Z +0900
background: '/img/posts/pattern01.jpg'
category: Study
tags: [jpa,java,database,performance]
---

## JPA N+1 문제, 무엇이고 왜 중요한가?

Java 생태계에서 데이터베이스 접근을 위한 ORM(Object-Relational Mapping) 프레임워크인 JPA는 개발 생산성을 크게 향상시켜줍니다. 객체지향적인 방식으로 데이터를 다룰 수 있게 해주지만, 잘못 사용하면 오히려 심각한 성능 문제의 원인이 되기도 합니다. 그중에서도 가장 흔하고 치명적인 문제가 바로 'N+1 문제'입니다. 이 문제는 불필요한 데이터베이스 쿼리를 대량으로 발생시켜 애플리케이션의 응답 속도를 저하시키고 데이터베이스에 과부하를 초래합니다.

이 글에서는 JPA N+1 문제가 무엇인지 이해하고, 이를 효과적으로 해결하기 위한 다양한 전략들을 코드 예시와 함께 알아보겠습니다. 여러분의 JPA 애플리케이션 성능을 한 단계 끌어올릴 수 있는 유용한 정보가 되기를 바랍니다.

---

### N+1 문제, 정확히 어떤 상황에서 발생할까?

N+1 문제는 주로 지연 로딩(Lazy Loading)으로 설정된 연관 관계에서 발생합니다. 예를 들어, `Team`과 `Member` 엔티티가 있다고 가정해봅시다. 하나의 `Team`은 여러 `Member`를 가질 수 있습니다.

```java
// Team 엔티티
@Entity
public class Team {
    @Id @GeneratedValue
    private Long id;
    private String name;

    @OneToMany(mappedBy = "team", fetch = FetchType.LAZY) // 지연 로딩
    private List<Member> members = new ArrayList<>();

    // ... getters and setters
}

// Member 엔티티
@Entity
public class Team {
    @Id @GeneratedValue
    private Long id;
    private String name;

    @ManyToOne(fetch = FetchType.LAZY) // 지연 로딩
    @JoinColumn(name = "team_id")
    private Team team;

    // ... getters and setters
}
```

이제 모든 팀을 조회한 후, 각 팀의 멤버 이름을 출력하는 코드를 작성해봅시다.

```java
// N+1 문제 발생 예시
List<Team> teams = entityManager.createQuery("select t from Team t", Team.class).getResultList(); // 1번 쿼리 (팀 조회)

for (Team team : teams) {
    System.out.println("Team: " + team.getName());
    for (Member member : team.getMembers()) { // 각 팀마다 멤버를 조회하는 쿼리 발생 (N번 쿼리)
        System.out.println("  Member: " + member.getName());
    }
}
```
위 코드에서는 먼저 모든 `Team`을 가져오기 위해 1번의 쿼리가 실행됩니다. 그리고 루프 안에서 각 `Team`의 `getMembers()`를 호출할 때마다 `Team`에 속한 `Member`들을 가져오기 위한 쿼리가 추가로 발생합니다. 만약 10개의 `Team`이 있다면 총 1(팀) + 10(멤버) = 11번의 쿼리가 실행되는 것이죠. 이것이 바로 N+1 문제입니다.

---

### N+1 문제 해결 전략

#### 1. 페치 조인 (Fetch Join)

페치 조인은 SQL의 `JOIN` 구문과 유사하게 동작하지만, 연관된 엔티티나 컬렉션을 한 번의 쿼리로 함께 로딩하여 프록시 객체가 아닌 실제 객체로 채워주는 JPA의 강력한 기능입니다. JPQL에서 `JOIN FETCH` 키워드를 사용합니다.

```java
// JPQL 페치 조인 예시
List<Team> teams = entityManager.createQuery(
    "select t from Team t join fetch t.members", Team.class)
    .getResultList();

// 모든 팀과 멤버가 한 번의 쿼리로 로딩되므로 추가 쿼리 발생 없음
for (Team team : teams) {
    System.out.println("Team: " + team.getName());
    for (Member member : team.getMembers()) {
        System.out.println("  Member: " + member.getName());
    }
}
```
페치 조인은 N+1 문제를 해결하는 가장 직접적이고 효과적인 방법입니다. 하지만 여러 컬렉션을 동시에 페치 조인할 경우 카르테시안 곱(Cartesian Product)이 발생하여 데이터 중복 문제가 생길 수 있으므로 주의해야 합니다. 이 경우 `DISTINCT` 키워드를 사용하여 중복을 제거할 수 있습니다.

#### 2. `@EntityGraph`

`@EntityGraph`는 JPQL 없이 선언적으로 페치 전략을 정의할 수 있는 방법입니다. 주로 `JpaRepository`와 함께 사용되며, 특정 메서드 호출 시 어떤 연관 관계를 즉시 로딩(EAGER)할지 명시할 수 있습니다.

```java
// Team 엔티티에 @NamedEntityGraph 정의
@Entity
@NamedEntityGraph(name = "Team.withMembers", attributeNodes = @NamedAttributeNode("members"))
public class Team {
    // ... (기존 코드 동일)
}

// JpaRepository 인터페이스
public interface TeamRepository extends JpaRepository<Team, Long> {
    @EntityGraph(value = "Team.withMembers")
    List<Team> findAllWithMembers();
}

// 사용 예시
List<Team> teams = teamRepository.findAllWithMembers();
// findAllWithMembers 호출 시 Team과 members가 페치 조인되어 로딩됨
```
`@EntityGraph`는 코드 가독성을 높이고, 특정 비즈니스 로직에 필요한 연관 관계만 선택적으로 로딩할 수 있게 해줍니다.

#### 3. `@BatchSize`

`@BatchSize`는 N+1 쿼리를 완전히 제거하지는 않지만, N개의 쿼리를 훨씬 적은 수의 쿼리로 줄여주는 효과적인 방법입니다. 지정된 사이즈만큼 연관된 엔티티들을 한 번에 미리 로딩하는 방식으로 동작합니다.

```java
// Team 엔티티의 members 컬렉션에 @BatchSize 적용
@Entity
public class Team {
    // ...
    @OneToMany(mappedBy = "team", fetch = FetchType.LAZY)
    @BatchSize(size = 100) // 100개씩 묶어서 조회
    private List<Member> members = new ArrayList<>();
    // ...
}
```
위 설정은 N개의 팀이 있을 때, 각 팀의 멤버를 조회할 때마다 쿼리를 날리는 대신, 최대 100개의 팀에 해당하는 멤버들을 `IN` 쿼리를 사용하여 한 번에 가져옵니다. 예를 들어, 1000개의 팀이 있다면 10개의 쿼리(1000/100)로 멤버 정보를 가져올 수 있게 됩니다. (`1(팀 조회) + 10(멤버 조회) = 11번의 쿼리`)

글로벌 설정으로 모든 지연 로딩에 일괄 적용할 수도 있습니다 (`application.yml` 또는 `application.properties`):

```yaml
# application.yml
spring:
  jpa:
    properties:
      hibernate:
        default_batch_fetch_size: 100 # 글로벌 배치 사이즈 설정
```

#### 4. DTO Projection (Projection to DTO)

복잡한 연관 관계나 특정 화면에 필요한 데이터만 가져올 때, 엔티티 객체로 로딩하지 않고 필요한 컬럼만 선택하여 DTO(Data Transfer Object)로 직접 매핑하는 방법입니다. 이는 N+1 문제를 근본적으로 회피하면서 데이터 전송량도 최소화할 수 있습니다.

```java
// MemberInfo DTO
public class MemberInfo {
    private String memberName;
    private String teamName;

    public MemberInfo(String memberName, String teamName) {
        this.memberName = memberName;
        this.teamName = teamName;
    }
    // getters
}

// JpaRepository 예시 (JPQL로 직접 DTO 생성)
public interface MemberRepository extends JpaRepository<Member, Long> {
    @Query("select new com.example.demo.dto.MemberInfo(m.name, t.name) from Member m join m.team t")
    List<MemberInfo> findMemberInfoWithTeamName();
}
```
이 방식은 엔티티의 영속성 컨텍스트 관리 부담을 줄이고, 오직 필요한 데이터만 가져오기 때문에 성능 최적화에 매우 효과적입니다.

---

## 결론

JPA의 N+1 문제는 개발자들이 흔히 겪는 성능 저하의 주범입니다. 하지만 `페치 조인`, `@EntityGraph`, `@BatchSize`, 그리고 `DTO Projection`과 같은 다양한 전략들을 이해하고 적절히 활용한다면, 이 문제를 효과적으로 해결하고 애플리케이션의 성능을 크게 개선할 수 있습니다.

어떤 전략이 가장 좋다고 단정하기보다는, 애플리케이션의 특정 사용 사례와 연관 관계의 복잡성을 고려하여 가장 적합한 방법을 선택하는 것이 중요합니다. 이 글이 여러분의 JPA 기반 애플리케이션을 더욱 빠르고 효율적으로 만드는 데 도움이 되기를 바랍니다!

<p class = "placeholder">Text by Chaelin & Gemini. Photographs by Chaelin, Unsplash.</p>