---
layout: post
title: "[Project] TO-DO List 만들기(2) - GET"
subtitle: "서버 어플리케이션 디자인 - GET 구현을 위한 클래스 생성"
date: 2021-02-19 9:36:00 +0900
background: '/img/posts/rest-02.jpg'
category: Study
tags: [rest, restful, miniproject, spring, lombok]
---
> 참고: <a href="https://imasoftwareengineer.tistory.com/34?category=772561">https://imasoftwareengineer.tistory.com/34?category=772561</a>

이번 글에선 ~~RESTful API~~ HTTP API의 오퍼레이션 중 GET에 집중해 서버 어플리케이션을 작성해 보겠습니다.

*****

<p class="hight-block">브라우저에 http:/localhost/todo/{id} 를 치고 들어가면 JSON 오브젝트를 리턴하는 GET API 만들기</p>

*****

### 1. 웹 어플리케이션 디자인

<img class="img-fluid" src="/img/posts/inPost/rest-02-01.png">
1번 포스트에 있는 3-tier중 중간에 있는 서버 어플리케이션을 구현할 것입니다.

어플리케이션을 가장 먼저 구현하는 이유는 다음과 같습니다.
1. 비즈니스 로직이 있는 가장 핵심적인 부분이다.
2. 다른 티어들에 독립적으로 구현할 수 있는 부분이다.

어플리케이션 서버 내부에 어떤 자바 클래스들이 필요한지 보겠습니다.

<img class="img-fluid" src="/img/posts/inPost/rest-03-01.png">

어플리케이션 내부의 자바 클래스들은 크게 두 가지로 나뉩니다.
- 데이터 클래스 - Request, Response, Model이 이 데이터 클래스에 해당. 데이터 클래스는 아무 기능도 하지 않고 데이터 자체를 가지는 클래스.
- 데이터 처리 클래스 - 데이터 처리는 Controller, Service, JPA repository등을 포함. 데이터 클래스를 가지고 데이터를 조작하고 DB에 추가하는 등의 작업을 수행합니다.

### 2. 패키지
<img class="img-fluid" src="/img/posts/inPost/rest-02-03.png">
위 디렉토리에 폴더를 나누어 작성해 줍니다.

* ApiResponse
    - commonResponse.java
* Todo_Item
    - TodoAdapter.java
    - TodoBean.java
    - TodoController.java
    - TodoResponse.java
    - TodoService.java

Response: Response를 위한 추상 클래스를 저장하는 폴더   
Todo_Item: TodoItem에 관련된 모든 클래스를 구현하기 위한 폴더

### 3. 클래스 작성
#### Model
본격적으로 Todo_Item 내의 코드들을 작성해 보겠습니다.

<img class="img-fluid" src="/img/posts/inPost/rest-03-02.png">
우선 Todo List의 요소를 표현하기 위한 데이터 클래스를 작성합니다. 실제 비즈니스 모델을 가지고 있습니다.

###### TodoBean
```
package com.example.demo.todo_item;

import lombok.*;

@Data
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class TodoBean {
    private String id;
    private String title;
    private boolean done;
}
```
Getter, Setter를 직접 구현하고 builder 메소드도 직접 구현할 수 있지만 lombok을 이용해 쉽게 작성할 수 있으니 이용해 보았습니다. 

처음 써보는 거라 초기 설정하는데 애 좀 먹었네요...ㅎㅎ 다음 글에서 lombok 설정에 대해 다뤄보겠습니다.

- id: 각 아이템을 구별하는 고유한 value
- title: TO-DO List 아이템들의 제목
- done: 각 아이템이 완료 되었는지 표시하기 위해 사용하는 value

#### Request 
http request에 포함되어 날라오는 데이터입니다. Model 자체를 브라우저로 넘기는 것은 비즈니스 로직 자체를 공개하는 것이므로 지양해야 합니다. 

또는 Request로 날라오는 데이터가 Model과 다른 경우가 있기 때문에 Request 클래스를 따로 만드는 것이 바람직합니다. 

이 부분은 DB 연동이 아직이기 때문에 다음에 작성하겠습니다.

#### Reponse
<img class="img-fluid" src="/img/posts/inPost/rest-03-03.png">

http response에 포함되어 브라우저로 보내질 클래스 입니다. Request와 마찬가지로 브라우저에 모델을 그대로 전달하는 것은 비즈니스 로직을 공개하는 것이므로 Response 클래스로 감싸는게 좋습니다. 

따라서 보통 **Reponse 클래스**를 만들고 그 내부에 **Model 클래스**와 UI가 필요한 정보들을 넣어줍니다.

*****

Response 추상 클래스를 생성해 줌으로써 모델이 여러 개가 될 때 모든 Response 내에 공통적인 부분을 구현해 줍니다.

공통적인 부분: Error 메시지 리스트

###### commonResponse
``` 
package com.example.demo.ApiResponse;

import java.util.List;

import lombok.*;
// 여러 모델에 동시에 삽입될 에러 메시지를 위한 클래스

@Getter @Setter
@RequiredArgsConstructor
public abstract class commonResponse<T> {
    @NonNull private T data;
    private List<String> errors;
}

```
T로 일반화함으로써 어떤 모델이든 data에 들어갈 수 있고, 각 Response는 항상 errors라는 에러 리스트를 가지게 됩니다.

TodoItemResponse는 다음과 같습니다.

###### TodoResponse
```
package com.example.demo.todo_item;

import com.example.demo.ApiResponse.commonResponse;

import lombok.*;
import java.util.List;

public class TodoResponse extends commonResponse<TodoBean> {
    @Builder
    public TodoResponse(final TodoBean todoBean, final List<String> errors){
        super(todoBean);
        this.setErrors(errors);
    }    
}
```

위에 작성한 commonResponse를 상속해 작성했습니다. setter 덕분에 쉽게 setErrors 해서 작성했습니다.

#### Service
<img class="img-fluid" src="/img/posts/inPost/rest-03-04.png">

Service란 Controller와 Repository 사이에서 비즈니스 로직을 수행하는 클래스입니다. 

Controller는 Request를 받아 Service에 넘겨주고 Service가 리턴한 Response를 다시 리턴하는 역할을 합니다. 

###### TodoService
```
package com.example.demo.todo_item;

import org.springframework.stereotype.Service;

@Service
public class TodoService {
    public TodoBean get(final String id){
        return TodoBean.builder()
                        .title("Add an id Validation")
                        .build();
    }
}

```
@Service annotation으로 해당 클래스가 Service임을 지정합니다. 

아직 데이터베이스 추가를 안 했기 때문에 임의의 Value를 하드코딩한 TodoBean을 Reponse에 삽입해 리턴하게 됩니다.

원래의 경우 id를 받아 JPA Repository 클래스를 이용해 데이터베이스에서 이 id를 검색해야합니다.

#### Controller
<img class="img-fluid" src="/img/posts/inPost/rest-03-05.png">

http:/localhost/todo/{id}를 URL로 입력했을 때 원하는 item을 찾아 오게 하는 최전선의 역할이 이 Controller에서 수행됩니다.

###### TodoController
```
package com.example.demo.todo_item;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import lombok.Setter;
import lombok.Getter;

import java.util.List;
import java.util.ArrayList;

@Getter @Setter
@RestController
@RequestMapping("/todo")
public class TodoController {
    @Autowired
    private TodoService todoService;

    @RequestMapping(method = RequestMethod.GET, value = "/{id}")
    public @ResponseBody TodoResponse get(@PathVariable(value="id") String id){
        List<String> errors = new ArrayList<>();
        TodoBean todoBean = null;
        try{
            todoBean = todoService.get(id);
        }catch(final Exception e){
            errors.add(e.getMessage());
        }
        return TodoAdapter.toTodoResponse(todoBean, errors);
    }
}
```
- RestController   
    RESTful API를 위한 Controller임을 Spring에 명시하는 역할을 합니다.
- RequestMapping을 통해 URL으로 Controller를 매핑합니다.
    위에선 두 번 등장하는데 처음엔 /todo로 매핑 후 /{id}로 매핑합니다.
    어떤 REST 메서드를 사용할 것인지, 또 path variable의 이름은 무엇으로 할 것인지 지정하는 역할도 합니다.  
- PathVariable   
    어떤 Path Variable이 어느 변수에 매핑되어야 하는지 알려줍니다. 
    여기서 path variable은 /{id} 값이고 @PathVariable에서 String id에 매핑합니다.
- ResponseBody   
    Http Response Body 부분을 JSON의 형태로 리턴할 것임을 명시합니다.

이렇게 해서 Service를 통해 가져온 todoBean을 브라우저로 보내기 위해 Response로 바꿔주어야 하는데 그 작을 하는 클래스가 TodoAdapter입니다.

###### TodoAdapter
```
package com.example.demo.todo_item;

import java.util.List;

public class TodoAdapter {
    public static TodoResponse toTodoResponse(final TodoBean todoBean, final List<String> errors){
        return TodoResponse.builder().todoBean(todoBean).errors(errors).build();
    }    
}
```

여기까지 하고 실행해 보겠습니다.

### 4. 실행

Visual Studio Code에서 Run (Ctrl+Shift+D)를 해주세요! Debug console에서 성공했다고 나오면 그 때 <a href="localhost:8080/todo/2">localhost:8080/todo/2</a>로 접속합니다.

아직 id에 큰 의미가 없어서.. 아무 숫자나 입력해도 같은 결과가 나옵니다. 하지만 입력을 하지 않을 경우 매핑이 되지 않아 White Label 페이지를 보게 됩니다.

<img class="img-fluid" src="/img/posts/inPost/rest-03-06.png">
위 처럼 JSON 형태로 Data가 들어온 것을 확인할 수 있습니다.

나중에 DB를 연동하게 된다면 {id}의 값으로 DB 조회를 수행해 가져오는 동작을 수행할 수 있겠네요.

##### GET 함수가 불렸는지 확인하기
F12를 통해 개발자 툴을 엽니다. 네트워크 탭을 누르면 GET 함수가 호출된 것을 확인할 수 있습니다.
<img class="img-fluid" src="/img/posts/inPost/rest-03-07.png">

감사합니다.
<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>