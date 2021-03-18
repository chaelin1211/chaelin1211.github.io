---
layout: post
title: "[REST] TO-DO List 만들기(6)"
subtitle: "React.js/Node.js 앱에서 API Call 하기"
date: 2021-03-16 00:48:00 +0900
background: '/img/posts/rest-02.jpg'
category: Study
tags: [rest, restful, miniproject, spring, docker, reactjs, nodejs]
---
> 참고   
> <a href="https://imasoftwareengineer.tistory.com/41?category=772561">https://imasoftwareengineer.tistory.com/41?category=772561</a>   
> <a href="https://github.com/schmidtp0740/react-todolist">https://github.com/schmidtp0740/react-todolist</a>

이번엔 저번에 만들었던 프론트 엔드 웹 서버에서 RESTful API 서버로 API 콜을 해보겠습니다.

*****

오늘의 목표: RESTful API와 React API 연동 후 확인하기

*****


여태 글은 대부분 참고한 글을 따라가며 실습하는 식으로 했는데 이번에 저 스스로 공부하며 해야합니다!

참고 블로그에서 Vue.js를 사용하는 것과 달리 저는 React.js를 사용하기 때문입니다.

우선 React를 처음 써보시면 다음 글로 훑어보고 시작하시면 좋습니다.

<a href="https://chaelin1211.github.io/study/2021/03/12/React-start.html">[React] React 시작 (create-react-app 살펴보기)</a>

### 1. Axios로 통신하기
#### 1-1. Axios란? 

React는 HTTP Client를 내장하고 있지 않습니다. 

따라서 React에서 AJAX를 구현하기 위해선 JavaScript 내장 객체인 XMLRequest를 사용하거나 다른 HTTP Client를 사용해야 합니다.

> AJAX: JavaScript의 라이브러리 중 하나로 JavaScript를 이용한 비동기 통신으로, 클라이언트와 서버 간에 xml 데이터를 주고받는 기술입니다.

> 비동기 방식: 웹 페이지를 리로드 하지 않고 데이터를 불러오는 방식으로 요청을 보낸 후 응답을 기다리지 않고 프로그램이 계속 돌아가는 방식입니다.

HTTP Client 라이브러리는 많이 존재합니다.

그 중에서 JavaScript의 내장 라이브러리인 fetch와 axios를 비교해 어떤 것을 사용할지 선택하였습니다.

##### fetch 
* JavaScript 내장 라이브러리로 import 없이 사용할 수 있습니다.
* 지원하지 않는 브라우저가 있다. (Internet Explorer 지원 x)
* 라이브러리의 업데이트에 따른 에러 방지가 가능합니다. (React-Native의 경우 업데이트가 잦아 라이브러리가 업데이트를 쫓아오지 못하는 경우가 발생하기도 함)
* Promise Based
    promise란 JavaScript 비동기 처리에 사용되는 객체입니다. 주로 서버에서 받아온 데이터를 화면에 표시할 때 사용합니다. 

##### Axios
* fetch에는 존재하지 않는 기능이 있다.
* Promise Based
* 옛날 브라우저나 버전에서도 문제없이 작동됩니다.
* Http 요청과 응답을 JSON 형태로 자동 변형 해줍니다.
* 요청을 중단할 수 있습니다.

##### 결론
지금 프로젝트에선 사실 기능적인 차이를 느끼지 못할 정도의 규모이긴 하지만 나중을 생각했을 때, 브라우저 호환성이 좋고 또 이용량이 더 많은 Axios를 활용해보기로 하였습니다.

#### 1-2. Axios 설치하기
##### Axios 다운로드
Axios 패키지 다운로드를 위해 터미널을 통해 프론트 엔드 프로젝트의 디렉토리로 들어갑니다.

```
C:\restful_project-front> npm install axios
```

위 명령어로 npm이 axios를 추가해줍니다.

### 2. 프론트 엔드에서 GET Test
임시적으로 수신이 되는지 확인하는 테스트 코드를 작성해 줍니다.

임시적으로 작성하는 코드이니 App.js에 작성했습니다.

##### App.js
```
const url = 'http://localhost:8080/todo';
axios.get(url).then(response=>{
  console.log(response.data);
})
```

axios를 통해 url에서 GET 동작을 수행해 log를 찍어 수신을 확인합니다.

url은 Spring을 이용한 RESTful 서버에 맞는 포트로 각자 변경해주시면 됩니다.

저는 일단은 docker 서버로 하지 않고 local 서버로 했습니다.

#### REST server & React server
두 서버 모두 실행해 주세요.

Postman을 통해 POST 동작으로 데이터를 입력해주세요.

<img class="img-fluid" src="/img/posts/inPost/rest-04-03.png">

저번에 테스트 했던 내용을 가져왔습니다~

이렇게 입력한 후 React 서버에서 새로고침 후 F12로 로그를 확인하면~ 오류가 났습니다.

### 3. CORS 오류 해결
<img class="img-fluid" src="/img/posts/inPost/rest-07-01.png">

CORS(Cross Origin Resource Sharing)은 보안을 위해 만들어진 정책으로 Spring 애플리케이션 도메인에서 다른 어플리케이션으로부터의 요청을 거부했다는 의미입니다.

그렇기 때문에 Spring 쪽에 추가적인 설정이 필요합니다.

mongoConfig.java를 추가했었던 config 폴더에 Java 파일을 하나 추가해줍니다.

##### WebConfig.java
```
package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
    .allowedOrigins("http://localhost:3000");
    }

}
```

위 allowedOrigins에 React 서버 url을 입력해주세요.

이렇게 CORS 오류를 해결할 수 있습니다~

### 4. 진짜 테스트
오류를 정리하고! 간단한 테스트를 위해 아까 작성했던 코드를 확인해 봅시다.

http://localhost:3000 에서 F12로 log를 확인합니다.

<img class="img-fluid" src="/img/posts/inPost/rest-07-02.png">

위처럼 로그에 제대로 데이터가 출력되었습니다!

### 5. 화면 출력을 위한 파일 추가
이제 화면에 출력하기 위해 필요한 .js 파일 몇개 생성해 화면에 목록을 출력해 보겠습니다.

UI적인 부분을 제외하고 출력만 가능하게 해보겠습니다.

```
> src/
    >components/
        TodoList.js
        TodoListRow.js
        TodoService.js
```

#### TodoService.js
이 부분은 axios로 Get, Post, Delete, Update 등의 동작을 직접 RESTful 서버와 연동하는 부분입니다.

우선은 Get 부분만 작성했습니다.

```
import axios from 'axios';

export default class TodoService {
    getAll(callback) {
        const url = 'http://localhost:8080/todo';
        axios.get(url).then((response) => callback(response.data))
            .catch(e => {
                console.log(e);
            });
    }
}
```

#### TodoList.js
TodoService에서 받아온 Response를 List로 작성해 화면에 출력될 JSX 코드를 작성하는 역할을 합니다.

```
import React, { Component } from 'react';
import TodoListRow from './TodoListRow';
import TodoService from './TodoService';

export default class TodoList extends Component {
    constructor(props) {
        super(props);
        this.todoService = new TodoService();
        this.state = { todoList: '' };
    }

    componentWillMount() {
        this.getTodoList();
    }

    getTodoList() {
        this.todoService.getAll((data) => {
           this.setState({todoList:data}); 
        })
    }

    setTodoList() {
        console.log(this.state.todoList);
        if(this.state.todoList instanceof Array){
            return this.state.todoList.map(function(object, i){
                return <TodoListRow obj={object} key={i} />;
            })
          }
    }
    
    render() {
        return (
            <table>
                <tbody>
                    {this.setTodoList()}
                </tbody>
            </table>
        )
    }
}
```

조금씩 나누어 살펴보겠습니다.

*****

```
constructor(props) {
    super(props);
    this.todoService = new TodoService();
    this.state = { todoList: '' };
}
```

이 부분은 생성자로 ```super(props)```을 빼고 this 메서드를 이용할 경우 참조 에러가 발생하니 필수적인 부분입니다. 클래스형 컴포넌트에 항상 포함해야 합니다.

이 생성자 부분에선 state 초기화도 수행해 줍니다.

이 state 값이 수정되면 ReactDOM.render가 호출되어 DOM이 업데이트 됩니다. 

즉, ReactDOM.Render() 메서드를 매번 호출하여 코드가 지저분하게 되는 것을 방지합니다.

*****

```
componentWillMount() {
    this.getTodoList();
}
```

컴포넌트 안에서 method의 실행 순서(컴포넌트 생명주기)는 constructor -> componentWillMount -> render -> componentDidMount 순으로 진행됩니다.

componentWillMount을 통해 render 전에 To-DO List를 구성하는 getTodoList() 메소드를 호출합니다.

*****

```
getTodoList() {
    this.todoService.getAll((data) => {
       this.setState({todoList:data}); 
    })
}
```

TodoService 객체를 통해 Get 해온 data 각각을 state 내의 todoList Array에 추가해줍니다.

*****

```
setTodoList() {
    console.log(this.state.todoList);
    if(this.state.todoList instanceof Array){
        return this.state.todoList.map(function(object, i){
            return <TodoListRow obj={object} />;
        })
      }
}
```

이 부분은 화면에 출력될 수 있도록 하는 부분으로 todoList의 object를 TodoListRow로 전달해 각 Row를 구성하는 코드를 작성합니다.

*****

```
render() {
    return (
        <table>
            <tbody>
                {this.setTodoList()}
            </tbody>
        </table>
    )
}
```

이렇게 작성된 각각의 Row 코드를 render로 DOM에 렌더링 해줍니다. 이 부분은 컴포넌트 생명주기 메서드 중에서 반드시 작성해야 하는 메서드입니다.

#### TodoListRow.js

```
import React, { Component } from 'react';

export default class TodoListRow extends Component{
    constructor(props) {
        super(props);
    }
  
    render() {
      return (
          <tr>
            <td>
                {this.props.obj.data.title}
            </td>
          </tr>
      );
    }
}
```

아까 TodoList.js에서 setTodoList() 메서드에서 호출했던 코드입니다.

tr, td 태그로 각각 데이터의 타이틀을 출력해 주는 동작을 합니다.

### 6. 화면 출력 테스트
테스트를 위해 postman으로 몇 가지 데이터를 더 추가해서 출력해 보겠습니다.

```
[
    {
        "data": {
            "id": "604f711415d3ac0059d56f56",
            "title": "study REST",
            "done": false
        },
        "errors": []
    },
    {
        "data": {
            "id": "604f7a9015d3ac0059d56f57",
            "title": "go to bed",
            "done": false
        },
        "errors": []
    },
    {
        "data": {
            "id": "604f7a9a15d3ac0059d56f58",
            "title": "posting",
            "done": false
        },
        "errors": []
    }
]
```
 
postman을 통해 Get 동작을 진행하였을 때 모습입니다.

REST API 서버와 Rect 서버를 켜고 확인해보았습니다.

<img class="img-fluid" src="/img/posts/inPost/rest-07-03.png">

http://localhost:3000에서 확인한 모습입니다.

입력한 데로 잘 나왔습니다!

다음엔 Post, Delete, Update 기능 추가와 UI 수정 관련 게시글로 찾아오겠습니다. 

감사합니다.

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>