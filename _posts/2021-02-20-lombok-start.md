---
layout: post
title: "[Lombok] 소개와 설정"
subtitle: "VS code에 lombok install하기"
date: 2021-02-20 8:58:00 +0900
background: '/img/posts/lombok-01.jpg'
category: Study
tags: [lombok, spring]
---
안녕하세요!

TODO LIST 구현에서 사용한 lombok에 대해 알아보고 VS Code에 install도 해볼게요.

*****

1. Lombok이란?
2. VS Code에 설정하기

*****

### 1. Lombok이란?
Java 라이브러리로 Getter, Setter, toString 등의 반복되는 메서드 작성 코드를 줄여주는 **코드 다이어트 라이브러리** 입니다.

보통 Model이나 Entity 같은 도메인 클래스 등에는 여러 멤버 변수가 있고 이에 대응되는 Getter, Setter, 그리고 toString() 같은 여러 메서드가 필요한데, 반복되는 메서드를 Lombok 어노테이션으로 쉽게 명시하고 이용할 수 있습니다.

Lombok은 여러가지 어노테이션을 제공하고 이를 기반으로 코드를 컴파일 과정에서 생성하는 방식으로 동작하는 라이브러리입니다.

#### 장점
반복되는 코드가 줄어들며 **코드의 가독성**을 높일 수 있고 **생산성** 또한 높일 수 있습니다.

#### 주의할 점
API 설명과 내부 동작을 어느정도 숙지하고 사용해야 합니다.

예를 들어 Lombok @Data 어노테이션이나 @ToString 어노테이션으로 자동 생성되는 toString() 메서드는 순환 참조 또는 무한 재귀 호출 문제로 인해 StackOverflowError가 발생할 수도 있습니다.

물론 이 부분은 Lombok에서 해결할 수 있는 속성들을 제공하지만 Lombok에 대해 숙지하고 남용하지 않아야 한다는 점을 주의해야 겠습니다.

#### Lombok 적용 시
###### 기존 Java 코드
```
public class memo{
    private String id;
    private String title;
    private String content;

    public String getId(){
        return id;
    }
    public String getTitle(){
        return title;
    }
    public String getContent(){
        return content;
    }
    public void setId(String id){
        this.id = id;
    }
    public void setTitle(){
        this.title = title;
    }
    public void setContent(){
        this.content = content;
    }
    @Override
    public String toString(){
        return "Memo [id = " + id + ", title = " + title + ", content = " + content + "]";
    }
}

```

###### Lombok 사용 시
```
@Getter @Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class memo{
    private String id;
    private String title;
    private String content;
}
```

###### 다섯 개의 어노테이션은 다음처럼 @Data로 대체 가능합니다.
```
@Data
public class memo{
    private String id;
    private String title;
    private String content;
}
```

### 2. VS Code에 설정하기
우선 Extetions(ctrl+shift+X)에서 Lombok Annotations Support for VS Code을 검색해 install 합니다.

<img class="img-fluid" src="/img/posts/inPost/lombok-01-01.png">

그리고 dependency를 추가합니다.
```
<dependency>
	<groupId>org.projectlombok</groupId>
	<artifactId>lombok</artifactId>
	<optional>true</optional>
</dependency>
```

이렇게 하면 오류가 발생하던 부분이 정상적으로 돌아갑니다.

### 실행
dependency 추가 전
<img class="img-fluid" src="/img/posts/inPost/lombok-01-02.png">

dependency 추가 후
<img class="img-fluid" src="/img/posts/inPost/lombok-01-03.png">

### 끝
RESTful 프로젝트 하며 처음 알게 되었는데 라이브러리들은 참 다양하고 많네요!

많이 알수록 응용하기 쉬워지겠죠! 봐주셔서 감사합니다.

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin</p>