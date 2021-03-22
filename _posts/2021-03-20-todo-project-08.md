---
layout: post
title: "[REST][React] TO-DO List 만들기(8) - POST"
subtitle: "React로 기능 추가하기 - POST"
date: 2021-03-20 01:50:00 +0900
background: '/img/posts/rest-02.jpg'
category: Study
tags: [rest, restful, miniproject, spring, reactjs, nodejs]
---
이번엔 프론트 엔드 측에서 기능을 구현하는 부분입니다.

CSS 설정 부분은 다음 글에서 적겠습니다. 이번엔 기능 위주로! 적겠습니다.

## CREATE
### 1. TodoService: Post 추가
TodoService에 post를 추가합니다.

##### components/TodoService.js내의 post()
```
post(requsest, callback) {
    const url = 'http://localhost:8080/todo';
    axios.post(url, requsest).then((response) =>
      callback(response.data))
    .catch(function (error) {
        console.log(error);
    });
}
```

이전 GET 처럼 Axios를 이용해 쉽게 추가 가능합니다.
* callback: 추가된 내용만 state에 추가하기 위해 사용

### 2. TodoInput 파일 생성
components/TodoInput.js 파일을 만들어 input form을 추가해 새로운 item title을 입력 받습니다.

*****

우선 TodoInput 파일을 만들고 components/TodoList.js를 다음처럼 수정합니다.

### TodoList: addTodoList 추가
##### components/TodoList.js 내의 addTodoList
```
addTodoList(response){
    this.setState({ todoList: this.state.todoList.concat(response) }
    , console.log(response.data));
}
```
post를 통해 새로 생성된 객체를 state에 추가해주는 코드입니다. TodoInput 내에서 post 후 호출할 코드입니다.

state 내 배열에 항목을 추가하기 위해 concat을 이용합니다.

state에 추가되면 render 됩니다.

##### components/TodoList.js 내의 render
```
render() {
    return (
        <div>
            <TodoInput todoList={this}></TodoInput>
            <div>
                {this.setTodoList()}
            </div>
        </div>
    )
}
```
위처럼 TodoInput은 TodoList에 추가합니다. TodoList 객체를 공유하기 위해서 이렇게 작성했습니다! 

이렇게 해야 state가 변경되는 것을 감지할 수 있습니다! 다른 객체를 이용하면 post 후에 state가 변경되었다고 감지하지 못해 화면이 수정되지 않습니다.

~~싱글톤도 이용해보고,, TodoTemplate에서도 해보고 했지만,, 이게 제일 깔끔하네요,,,~~

*****

##### components/TodoInput.js내의 constructor()
```
constructor(props) {
    super(props);
    this.todoService = new TodoService();
    this.state={title: ''};
}
```


입력 받을 값을 저장할 state 변수를 생성하고, post를 위해 사용할 TodoService의 객체도 생성해줍니다.

##### components/TodoInput.js내의 render()
```
render() {
  return (
    <div>
      <form onSubmit={this.handleCreate.bind(this)}>
        <input type="text" onChange={this.handleChange.bind(this)} autoFocus></input>
        <input type="submit" value="Enter"></input>
      </form>
    </div>
  );
}
```

form 태그와 input태그를 추가해주었습니다. 가독성을 위해 css를 제외하고 가져왔습니다.

이 내부의 onChange와 onSubmit을 살펴보겠습니다. 

여기서 bind는 this의 주체를 지정해주는 역할을 합니다.

render에서 ```on~~```의 function이 실행될 때 ```this.setState(() => ({ hidden: true }));```이 실행됩니다.

하지만 이 때 this는 전역 객체(Window)를 의미합니다. 이벤트가 발생하는 문맥이 전역 객체이기 때문입니다.

그렇기 때문에 bind로 this의 대상을 지정해 줄 필요가 있습니다. 지정해주지 않으면 setState에서 오류가 발생합니다.

##### onChange={this.handleChange.bind(this)}
```
handleChange(event){
  event.preventDefault();
  this.setState({title: event.target.value});
}
```

```
this.setState({title: event.target.value});
```
input 필드에 값 변화가 생기면 state에 저장 해놓은 title 변수를 변경합니다. 버튼을 누르면 title 변수에는 입력한 값이 저장되어 있게 됩니다.

```
event.preventDefault();
```
event.preventDefault()는 a 태그를 눌러도 href 링크로 이동하지 않길 원할 경우, form 안에 submit 역할을 하는 버튼을 눌러도 새로 실행을 하지 않길 원할 경우 사용합니다.

##### onSubmit={this.handleCreate.bind(this)}
```
handleCreate(event){
    event.preventDefault();
    const todoRequest = {
        title: this.state.title
    }
    this.todoService.post(todoRequest, (data)=>this.props.todoList.addTodoList(data));
}
```

```
const todoRequest = {
    title: this.state.title
}
```
post를 위해 보낼 개체를 생성합니다.


```
this.todoService.post(todoRequest, (data) => this.props.todoList.
addTodoList(data));
```
todoService의 post로 위에서 생성한 todoRequest 객체를 보내고, callback 함수를 이용해 response 객체를 가져와 TodoList의 **addTodoList**를 이용합니다.

addTodoList로 생성된 객체가 보내지며 list가 갱신됩니다. 

props는 호출될 때 전달받은 변수(TodoList 객체)를 이용할 수 있게 합니다.

##### components/TodoInput.js
```
import React, { Component } from 'react';
import TodoList from './TodoList';
import TodoService from './TodoService';

export default class TodoInput extends Component {
    constructor(props) {
        super(props);
        this.todoService = new TodoService();
        this.state={title: ''};
    }

    handleChange(event){
        event.preventDefault();
        this.setState({title: event.target.value});
    }

    handleCreate(event){
        event.preventDefault();
        const todoRequest = {
            title: this.state.title
        }
        this.todoService.post(todoRequest, (data)=>this.props.todoList.addTodoList(data));
    }

    render() {
        return (
            <div className="inputBlock">
                <h2 className="topLogo">Todo List</h2>
                <form className="input-group" onSubmit={this.handleCreate.bind(this)}>
                    <input type="text" onChange={this.handleChange.bind(this)} autoFocus className="form-control"></input>
                    <input className="btn btn-outline-secondary" type="submit" value="Enter"></input>
                </form>
            </div>
        );
    }
}
```
CSS를 포함한 전체 내용입니다.

### 3. WebConfig 수정 - CORS 설정
React만 적으려 했지만 이부분도 추가해주어야 합니다.

```
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
    .allowedMethods("HEAD", "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
    .allowedOrigins("http://localhost:3000");
    }
}
```

```
.allowedMethods("HEAD", "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
```
이 부분을 추가하지 않아도 기본적으로 GET, HEAD, POST가 가능하지만 PUT 메소드가 없기 때문에 위 코드를 추가했습니다.

### 끝
Delete까지 하려고 했는데 글이 길어져 POST 까지만 하고 다음 글에서 Delete 추가하겠습니다.

감사합니다.

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>
