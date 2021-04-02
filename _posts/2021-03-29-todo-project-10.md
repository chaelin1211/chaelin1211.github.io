---
layout: post
title: "[Project][React] TO-DO List 만들기(10) - UPDATE(1)"
subtitle: "React로 기능 추가하기 - UDPATE"
date: 2021-03-29 17:52:00 +0900
background: '/img/posts/rest-02.jpg'
category: Study
tags: [miniproject, spring, reactjs, nodejs]
---

React 쪽에서 이번엔 UPDATE 추가합니다. 글 분량 초과로 이번 글에선 check 박스로 done value 수정하는 부분만 포함하였습니다.

1. Todo Done value의 값에 의존하여 화면 출력하기
2. TodoService에 Update 메소드 추가 + TodoController 수정
3. TodoListRow에 handleCheck 추가

## 1. Todo Done value의 값에 의존하여 화면 출력하기
### 체크 박스 상태 설정
처음에 Todo item 데이터에 저장된 Boolean 값의 Done에 맞게 체크 박스를 체크된 상태인지 아닌지를 화면에 표현해주어야 합니다.

새로 생성된 경우 Done은 false이고 선택 시 true로 바뀝니다!

TodoListRow.js에 체크 박스가 있으니 여기서 Done의 값에 따라 체크 박스 설정을 해줍니다. 

##### components/TodoListRow.js 내의 Render()
```
{/* 체크박스 */}
<span onClick={this.handleCheck.bind(this)}>
  {
    this.props.item.done
      ? {/* done: true일 때 표시할 내용 */}
      : {/* done: false일 때 표시할 내용 */}
  }
</span>
```

위 처럼 **삼항연산**으로 화면에 선택적으로 출력할 수 있습니다.

저는 체크박스를 input 태그를 이용하는 대신 svg 태그로 아이콘을 사용할 것이기 때문에 이렇게 하였습니다.

따로 js 코드로 function을 작성하지 않아도 되고 너무 간편하네요!

## 2. TodoService에 Update 메소드 추가 + TodoController 수정
Todo title, done 값 수정을 위해 update 메소드를 하나 만들어 주어야 합니다.

TodoService와 Spring 쪽의 TodoController에서 추가와 수정이 필요합니다.

* TodoService: update 메소드 생성
* TodoController: PUT -> PATCH로 변경

### TodoController 수정
저번에 Controller에서 update에 Method를 PUT으로 작성했는데 PATCH로 바꿔주었습니다.

*****

PUT과 PATCH의 차이!
* PUT: 리소스를 수정할 때 일부만 전송하면 나머지 value는 null로 바뀝니다.
* PATCH: 리소스를 수정할 때 수정할 부분만 전송해 일부 수정이 가능합니다.

*****

저는 title 혹은 done을 수정하는데 동시에 수정하는 로직은 추가하지 않을 예정이라 부분 수정시 이용하는 PATCH를 사용하기로 했습니다.

##### TodoController.java
```
@RequestMapping(method=RequestMethod.PATCH)
public @ResponseBody TodoResponse update(@RequestBody final TodoRequest todoRequest){
    List<String> errors = new ArrayList<>();
    TodoBean todoBean = TodoAdapter.toTodoBean(todoRequest);
    try{
        todoBean = todoService.update(todoBean);
    }catch(final Exception e){
        errors.add(e.getMessage());
        e.printStackTrace();
    }
    return TodoAdapter.toTodoResponse(todoBean, errors);
}
```
맨 위에 RequestMapping 어노테이션의 method만 PATCH로 바꿔주면 됩니다. 

> +) 이전에 작성된 [REST] TO-DO List 만들기(7) 포스트 또한 수정했습니다.

### TodoService에 Update 추가
TodoService에 axios로 patch를 이용하는 update 메소드를 추가합니다.

##### components/TodoService.js
```
update(request, callback) {
    const url = 'http://localhost:8080/todo';
    axios.patch(url, request).then((response) => callback(response.data))
        .catch(function (error) {
            console.log(error);
        });
}
```
다른 메소드들과 마찬가지로 callback을 이용한 메소드를 생성했습니다.

## 3. TodoListRow에 handleCheck 추가
이 전에 한 가지 더 수정할 것이 있습니다. 

TodoListRow는 TodoList에서 item을 전달 받아 props로 Todo item 정보(id, title, done)에 접근 가능합니다.

근데 저희는 title, done을 수정해야 하는데 props는 불변으로 TodoList에서 수정하지 않는한 바꿀 수 없습니다.

그치만 title, done을 수정하는 것으론 TodoList 전체를 다시 Render하기엔 뭔가 비효율적이라 피하고 싶었기에 props로 id만 전달 받기로 하였습니다.

**결론: props로 id만 전달하기 위해 TodoLList와 TodoListRow 수정 필요**

### TodoList 수정
##### components/TodoList.js
TodoListRow 태그 부분에서 조금만 수정하면 됩니다.

수정 전 setTodoList()
```
setTodoList(todoList) {
    if (this.state.todoList instanceof Array) {
        return this.state.todoList.map(function (object, i) {
            return <TodoListRow id={object.data} todoList={todoList}/>;
        })
    }
}
```

수정 후 setTodoList()
```
setTodoList(todoList) {
    if (this.state.todoList instanceof Array) {
        return this.state.todoList.map(function (object, i) {
            return <TodoListRow id={object.data.id} todoList={todoList}/>;
        })
    }
}
```

```
<TodoListRow id={object.data.id} todoList={todoList}/>;
```
여기 수정했습니다.

### TodoListRow 수정
* state에 title, done 추가
```
this.state = {
    title: "",
    done: ""
}
```
* 이전에 this.props.item.id로 쓰던 것을 this.props.id로 수정
* this.props.item.title, this.props.item.done은 this.state.title, this.state.done으로 수정

title과 done은 그럼 어디서 가져올까요?? id로 DB를 조회하는 get 메소드를 하나 만들어 주었습니다.

##### components/TodoService.js
```
get(request, callback) {
    const url = 'http://localhost:8080/todo/'+request.id;
    axios.get(url).then((response) => callback(response.data))
        .catch(e => {
            console.log(e);
        });
}
```

이 메소드로 title과 done을 수정하는 메소드를 TodoListRow에 만들어 줍니다.
##### components/TodoListRow.js
```
componentDidUpdate(prevProps, prevState) {
  if (this.props.id !== prevProps.id) {
    this.setData();
  }
}

setData(){
  const todoRequest = {
    id: this.props.id
  }
  this.todoService.get(todoRequest
    , (item) => this.setState({title: item.data.title, done: item.data.done}
            , console.log(item)));
}
```

이 메소드를 constructor에서 호출해주면 바로 state가 변경되며 화면에 출력됩니다.

componentDidUpdate를 이용해 props의 id가 바뀔 경우 title, done을 다시 조회합니다. 삭제 버튼을 누를 경우, 이 로직이 없으면 id와 title이 맞지 않게 밀려버립니다.

### 이제 진짜 TodoListRow에 handleCheck 추가
##### components/TodoListRow.js
```
handleCheck() {
  const todoRequest = {
    id: this.props.id,
    done: !this.state.done,
    title: this.state.title
  }
  this.todoService.update(todoRequest
    , (item) => this.setState({title: item.data.title, done: item.data.done}
            , console.log(item)));
}
```

우선 이 메소드는 check 버튼이 클릭되었을 때 사용되니 done은 true면 false, false면 true로 바뀌어야 합니다. 그래서 done은 기존의 done에 ! 연산자 이용했습니다.

TodoController에서 id 값으로 조회하는 부분이 존재하니 request에 id도 추가합니다.

아까 PATCH와 PUT의 차이에 대해 설명한 것과 무색하게,,, 저흰 Controller의 update에서 TodoAdapter로 Bean을 생성해 적용하기 때문에 (Title, Done 같은 update 메소드를 사용) 하나의 필드가 비면 Adapter에서 빈 값으로 저장해 버려서 빈 값으로 수정됩니다...

다 채워넣어 보내줄게요...

update 후 callback으로 state를 변경하는 동작을 합니다. 다시 render되며 화면 확인 가능합니다.

render 부분을 다시 보면 다음과 같습니다.
##### components/TodoListRow.js 내의 Render()
```
{/* 체크박스 */}
<span onClick={this.handleCheck.bind(this)}>
  {
    this.state.done
      ? {/* done: true일 때 표시할 내용 */}
      : {/* done: false일 때 표시할 내용 */}
  }
</span>
```

저어어기 위와 다르게 state에서 done을 가져옵니다.

### 확인
<img class="img-fluid" src="/img/posts/inPost/rest-11-01.gif">
잘 바뀌네요~

이제 title만 수정되도록 하면 기능 상 구현은 끝입니다.

소스 전체가 보고 싶으신 분들은 아래 링크에서 보실 수 있습니다.
<a href="https://github.com/chaelin1211/RESTful_MiniProject/tree/main/restful-project-frontend/src/components">github.com/chaelin1211/RESTful_MiniProject/tree/main/restful-project-frontend/src/components</a>

감사합니다.

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>