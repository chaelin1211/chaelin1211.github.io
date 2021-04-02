---
layout: post
title: "[Project][React] TO-DO List 만들기(9) - DELETE"
subtitle: "React로 기능 추가하기 - DELETE / input field 체크 & 리셋"
date: 2021-03-27 11:16:00 +0900
background: '/img/posts/rest-02.jpg'
category: Study
tags: [miniproject, spring, reactjs, nodejs]
---

React 쪽에서 이번엔 DELETE를 추가합니다.

React를 미리 공부하지 않고 그때 그때 찾아서 해서 엄청 해맸네요... 좋지 않은 방법인 것 같습니다.

쨌든 오늘 DELETE 끝내고 Update 기능 추가하면 끝이네요.

## DELETE
### 1. TodoService: delete 추가
TodoService에 delete를 추가합니다.

##### components/TodoService.js내의 delete()
```
delete(request, callback) {
    const url = 'http://localhost:8080/todo/'+request.id;
    axios.delete(url).then((response) => callback(response.data))
        .catch(function (error) {
            console.log(error);
        });
}
```

* callback: 추가된 내용만 state에 추가하기 위해 사용

이번엔 직접 request를 보내는게 아닌 url로 추가해서 보냅니다.

이전 post처럼 request를 직접 보내는 방식으로 했을 땐 오류가 납니다. 

body에 value를 넣어 삭제할 값을 전달해야 하는데, request가 전달이 안 되는건지... Adapter에서 객체를 생성하지 못해 nullException 걸리더라구요! 

url로 전달하는 방법으로 하면 잘 됩니다.

+) 이전 백 엔드에서 Controller에 delete는 이 글 이후에 수정되었습니다. 그래서 여기 프론트엔드 delete에서 url에 id를 추가해서 보내면 백 엔드 delete에서 정상적으로 mapping됩니다.

### 2. TodoListRow.js에 삭제 버튼 추가
각각 삭제해야 하니 TodoListRow.js에 각각 버튼을 추가합니다.

##### components/TodoListRow.js내의 render()
```
render() {
  return (
    <div className="todoRow">
       /* 체크박스 svg 태그 (생략) */
     
       /* todo item title */
      <input className="todoTitle d-inline" value={this.props.item.title} readonly id="title"></input>
      
       /* 삭제 버튼 */
      <div className="float-right deleteButton" onClick={this.handleClick.bind(this)}>
        /* 버튼에 사용한 svg 태그 (생략) */
      </div>
    </div>
  );
}
```

저는 그냥 버튼 태그가 아닌 bootstrap icon을 사용하고 싶어서 svg 태그를 복사해 왔는데 너무 길어서 생략하고 가져왔습니다.

어쨌든 여기에 삭제 버튼을 원하는 형식으로 추가하시면 됩니다.

또 저번에 post에서 했듯이 handle하는 메소드를 추가해주시면 됩니다. 이번엔 form으로 submit하는 것이 아니기 때문엔 onClick 이벤트 handler 추가했습니다.

##### components/TodoListRow.js내의 constructor(), handleClick()
```
constructor(props) {
  super(props);
  this.todoService = new TodoService();
}

handleClick() {
  const todoRequest = {
    id: this.props.item.id
  }
  this.todoService.delete(todoRequest,(data) => this.props.todoList.removeTodoListRow(data));
}
```

* TodoService의 delete을 사용하기 위해 constructor에서 TodoService 객체 생성
* handleClick에서 request 객체를 생성해 TodoService.delete 호출(백)하고, callback으로 TodoList의 removeTodoListRow 메소드 호출(프론트)
* 여기서 this.props.todoList.removeTodoListRow(data)) 이 부분을 위해 TodoList에서 조금의 수정을 거쳤습니다. 

*****

#### TodoList 수정 - removeTodoListRow 추가
todoService를 통해 백엔드에서 삭제하고 프론트에서도 삭제하기 위해 TodoList에 removeTodoListRow라는 메소드를 추가합니다.

##### components/TodoList.js내의 removeTodoListRow()
```
removeTodoListRow(response) {
    this.setState({ todoList: this.state.todoList.filter((item) => item.data.id !== response.data.id) }
        , () => {console.log(response.data)});
}
```

백엔드에서 삭제된 후 삭제된 객체를 response로 보냅니다. 그 response 객체를 react 측의 state에서 삭제해야 합니다.

state내의 배열에서 하나를 삭제하기 위해서 filter를 이용했습니다. filter를 통해 response와 같은 객체를 필터링하는 것입니다.

#### TodoList 수정 - todoList 객체 전달

```
setTodoList(todoList) {
    if (this.state.todoList instanceof Array) {
        return this.state.todoList.map(function (object, i) {
            return <TodoListRow item={object.data} key={i} todoList={todoList}/>;
        })
    }
}
render() {
    return (
        <div>
            <TodoInput todoList={this}></TodoInput>
            <div className="todoList">
                {this.setTodoList(this)}
            </div>
        </div>
    )
}
```

setTodoList에서 TodoListRow로 추가할 객체, todoList 객체 자체를 전달해줍니다. 이를 통해 TodoListRow에서 props로 객체 id를 알 수 있고, 또 TodoList의 method를 사용할 수 있습니다.

*****

### 3. 테스트
spring, react 서버 모두 켜고 테스트 해봅니다.
<img class="img-fluid" src="/img/posts/inPost/rest-10-01.png">

몇 개 추가하고 삭제합니다.

<img class="img-fluid" src="/img/posts/inPost/rest-10-02.gif">

잘 삭제됩니다.

<img class="img-fluid" src="/img/posts/inPost/rest-10-03.gif">

빠르게 해도 잘 삭제됩니다.

쓰레기통 아이콘은 bootstrap의 icon을 이용했는데 색도 css로 변경 가능해서 사용하기 편합니다. hover를 이용했더니 완전 버튼 같아서 좋았어요.

<a href="https://icons.getbootstrap.com/">Bootstraps Icons</a> 여기서 원하는 아이콘을 검색해 svg 태그 복사해서 쓰면 바로 사용 가능합니다. 종류가 정말 많아요.

### input field 체크 & 리셋
TodoInput.js에 우선 체크를 위한 메소드를 추가합니다.

##### components/TodoInput.js내의 checkInputValue()
```
checkInputValue(input){
    if(input === ""){
        return false;
    }
    return true;
}
```

입력하지 않고 Enter를 누르면 이 메소드에 의해 걸러지도록 합니다.

##### components/TodoInput.js내의 handleCreate()
```
handleCreate(event) {
    event.preventDefault();
    if(!this.checkInputValue(this.state.title)){
        return;
    }
    const todoRequest = {
        title: this.state.title
    }
    this.todoService.post(todoRequest, (data) => this.props.todoList.addTodoListRow(data));
    this.setState({ title: '' });
    event.target.reset();
}
```

```
if(!this.checkInputValue(this.state.title)){
    return;
}
```
메소드로 체크하는 부분을 추가했습니다.

```
event.target.reset();
```
input field를 초기화 하는 부분입니다.

이렇게 하면 Enter를 누른 후에 Input Field의 값이 초기화됩니다.

### 끝

이제 UPDATE가 남았네요. 내용을 수정하는 부분입니다.

체크 박스 선택하면 done이 UPDATE가 되도록해야하고, 또 처음에 리스트를 불러올 때 done 값으로 체크 박스 상태에 적용되도록 해야합니다.

감사합니다.

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>
