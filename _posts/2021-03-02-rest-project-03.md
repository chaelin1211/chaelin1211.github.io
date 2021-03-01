---
layout: post
title: "[REST] TO-DO List 만들기(3) - POST"
subtitle: "데이터를 생성하는 POST API 생성! Spring과 mongoDB"
date: 2021-03-02 04:00:00 +0900
background: '/img/posts/rest-02.jpg'
category: Study
tags: [rest, restful, miniproject, spring, mongodb]
---
> 참고: <a href="https://imasoftwareengineer.tistory.com/34?category=772561">https://imasoftwareengineer.tistory.com/34?category=772561</a>

이번 글에선 RESTful API의 오퍼레이션 중 POST에 집중해 서버 어플리케이션을 작성해 보겠습니다.

mongoDB를 이용할 것입니다.

>참조: <a href="https://chaelin1211.github.io/study/2021/02/28/mongo-db.html">"[데이터베이스] mongoDB란?"</a>

*****

### 1. Spring 환경에 mongoDB 연결하기 - maven
우선 pom.xml에서 dependency 설정을 추가합니다.

저는 Maven을 이용했기 때문에 gradle의 경우 변환해서 추가해주세요.

###### pom.xml
```
<dependency> 
	<groupId>org.springframework.boot</groupId> 
	<artifactId>spring-boot-starter-data-mongodb</artifactId> 
</dependency>
<dependency>
	<groupId>de.flapdoodle.embed</groupId>
	<artifactId>de.flapdoodle.embed.mongo</artifactId>
</dependency>
```

위는 Spring에서 mongoDB를 이용하기 위한 설정이고 아래는 Embedded mongoDB를 사용하기 위한 설정입니다.

#### Embedded MongoDB
따로 서버 필요 없이 내장 형식으로 작동시킬 수 있습니다. 이 설정이 없으면 따로 mongoDB 서버가 존재해야하며 커넥션 설정이 필요합니다.

#### mongoDB.java
mongoDB 사용을 위한 파일입니다.

config 폴더에 mongoDB.java를 만들고 다음처럼 설정합니다.

###### mongoConfig.java
```
package com.example.demo.config;

import org.springframework.boot.autoconfigure.mongo.embedded.EmbeddedMongoAutoConfiguration;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Profile;

@Profile(value = "mongo")
@Configuration
@Import(EmbeddedMongoAutoConfiguration.class)
public class mongoConfig {
}
```

Embedded MongoDB이기 때문에 커넥션 부분을 작성하지 않고 간단하게 작성 가능합니다.

* @Profile: 데이터베이스를 구분 할 수 있습니다. 
* @Configuration: Config로 사용할 파일에 표시하는 어노테이션입니다. 
	- Java Config: 자바 클래스 파일을 설정 파일로 사용하는 것으로 xml 설정 파일을 대체합니다. xml 설정과 비교해서 IDE를 통한 자동 완성과 오타 발견 등이 편리합니다.
* @ Import: EmbeddedMongoAutoConfiguration을 불러옵니다. 이 설정을 통해 자동으로 Configuration이 가능합니다. 이 설정 없이는 직접 Config를 설정해야 합니다. 

*****

저번에 생성하지 않았던 Repository와 Request를 생성하고 기존 Class를 수정합니다.

##### 오늘의 Package 확인하기!
* ApiResponse
    - commonResponse.java
* Todo_Item
    - TodoAdapter.java
    - TodoBean.java
    - TodoController.java
    - TodoResponse.java
    - TodoService.java
    - TodoRequest.java
    - TodoRepository.java
* config
	- mongoConfig.java

*****

### 2. JPA Repository
<img class="img-fluid" src="/img/posts/inPost/rest-04-01.png">

JPA Repository: SQL을 실행하고 결과 값을 가져 올 수 있게 하는 API입니다. Create, Update, FindById, FindByName 등등 웹 어플리리케이션에서 자주 사용되는 오퍼레이션이 존재합니다. 

데이터베이스(여기선 mongoDB)가 개발자들이 쉽게 이용할 수 있도록 Java API를 만든 것입니다. 

우리는 interface를 만들고 상속을 통해 JPA를 바로 이용할 수 있습니다.

###### TodoRepository.java
```
package com.example.demo.todo_item;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface TodoRepository extends MongoRepository<TodoBean, String>{
}

```

<TodoBean, String>
- TodoBean: Repository가 표현해야 하는 모델
- String: 모델을 구별할 수 있는 ID의 타입

*****

### 3. Request
<img class="img-fluid" src="/img/posts/inPost/rest-04-02.png">

Request: 요청되는 데이터를 저장하는 클래스입니다.

TodoList로 요청될 사항이니 TodoBean과 같은 value를 포함해야 합니다. Update, Create 등을 위해 필요한 field가 저장됩니다.

###### TodoRequest.java
```
package com.example.demo.todo_item;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TodoRequest {
    private String id;
    private String title;
    private boolean done;
}
```

*****

### 4. TodoBean 수정
MongoDB를 통해 Id 값을 제공 받기 위해 TodoBean에 @Id를 추가해줍니다.

###### TodoBean.java
```
import org.springframework.data.annotation.Id;

import lombok.*;
@Data
@Builder

public class TodoBean {
    @Id
    private String id;
    private String title;
    private boolean done;
}
```

이렇게 Id를 명시하면 mongoDB에서 자동으로 고유한 Id를 설정해줍니다.

*****

### 5. Service 수정 
#### Service에서 Repository 이용하기
전에 작성한 Service는 DB와의 연동이 없어 지정된 값만을 return을 해주었는데, "Request에서 입력 받은 값"으로 결과 값을 얻어와 return하도록 바꾸었습니다.
- Request에서 입력 받은 값이란 TodoRequest를 통해 생성된 TodoBean을 의미합니다. 이는 Adapter를 통해 이루어집니다.

###### TodoService.java
```
package com.example.demo.todo_item;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TodoService {
    @Autowired
    private TodoRepository todoRepository;

    public TodoBean get(final String id){
        return todoRepository.findById(id).orElse(null);
    }

    public TodoBean create(final TodoBean todoBean){
        if(todoBean == null){
            throw new NullPointerException("Item cannot be null.");
        }
        return todoRepository.insert(todoBean);
    }

    public List<TodoBean> getAll(){
        return todoRepository.findAll();
    }
}
```

세 method는 TodoRepository의 operation을 이용합니다. 

extends MongoRepository를 통해 여러 operation을 사용할 수 있게 되었습니다.

*****

### 6. Adaptor 수정하기
#### TodoRequest -> TodoBean 변환 method 추가
```
public static TodoBean toTodoBean(final TodoRequest todoRequest){
    if(todoRequest == null){
        return null;
    }
    return  TodoBean.builder()
        .title(todoRequest.getTitle())
        .done(todoRequest.isDone())
        .build();
}
```

*****

### 7. Controller 수정하기
#### method 만들기
저번에 만들었던 get은 그대로 사용하고 getAll과 create를 추가하였습니다.

#### getAll
```
@RequestMapping(method = RequestMethod.GET)
public @ResponseBody List<TodoResponse> getAll(){
    List<String> errors = new ArrayList<>();
    List<TodoBean> todoBeans = todoService.getAll();
    List<TodoResponse> todoResponses = new ArrayList<TodoResponse>();
    todoBeans.stream().forEach(todoBean->{
        // todobean 각각을 adapter를 통해 response로 만들어 저장
        todoResponses.add(TodoAdapter.toTodoResponse(todoBean, errors));
    });
    return todoResponses;
}
```
여러 객체를 return해야하기 때문에 List 형태를 이용합니다.

중간에 보시면 Service를 통해 받은 TodoBean 리스트의 각각을 Adapter를 통해 Response로 바꾸어 저장해 Reponse를 return합니다.

#### create
```
@RequestMapping(method = RequestMethod.POST)
public @ResponseBody TodoResponse create(@RequestBody final TodoRequest todoRequest){
    List<String> errors = new ArrayList<>();
    TodoBean todoBean = TodoAdapter.toTodoBean(todoRequest);
    System.out.println(todoRequest.getTitle());
    try{
        todoBean = todoService.create(todoBean);
    }catch(final Exception e){
        errors.add(e.getMessage());
        e.printStackTrace();
    }
    return TodoAdapter.toTodoResponse(todoBean, errors);
}
```
TodoRequest를 입력받아 TodoApdater를 통해 TodoBean으로 변환합니다.

그 후 create 동작을 통해 새로 생성하고, 생성된 TodoBean을 Response로 return합니다.

*****

### 8. 실행 확인
#### postman을 통해 API 수행 확인

##### Create 확인 
<img class="img-fluid" src="/img/posts/inPost/rest-04-03.png">
 
errors가 비어 있는 걸 보니 아주 잘 실행되네요! 뿌듯

##### getAll
<img class="img-fluid" src="/img/posts/inPost/rest-04-04.png">
 
하나 더 추가하고 GET을 수행했는데 두 개 다 잘 나왔네요ㅎㅎ

~~go to bed 하러 가야겠당~~

감사합니다.

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>