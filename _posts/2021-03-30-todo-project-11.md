---
layout: post
title: "[Project][React] TO-DO List 만들기(11) - UPDATE(2)"
subtitle: "React로 기능 추가하기 - UDPATE(2)"
date: 2021-03-30 22:37:00 +0900
background: '/img/posts/rest-02.jpg'
category: Study
tags: [miniproject, spring, reactjs, nodejs]
---
저번에 Done 값으로 체크박스 화면에 띄우고 클릭 시 체크가 되도록 하는 부분까지 했습니다.

오늘은 내용을 수정하는 부분을 구현하겠습니다.

TodoListRow.js에서 저는 목록 Title을 input 태그의 value로 화면에 띄웠습니다.

**저는 따로 수정 버튼을 만드는 것이 아니라 입력 후, 다른 곳을 클릭 해 focus out 될 때 자동으로 수정되도록 하였습니다**

1. Todo Title에 onChange 이벤트 추가
2. onBlur 이벤트 추가

이번엔 엄청 간단하죠!

### 1. Todo Title에 onChange 이벤트 추가
TodoListRow에 Title을 출력하던 input 태그에 onChange 이벤트를 추가합니다.

value로 state.title을 지정해놓았기 때문에 onChange 이벤트로 state.title을 같이 수정하지 않으면 입력해도 입력되지 않아요!

아래처럼 클릭해서 입력해도 아무 일이 안 일어나죠!   
+) input 태그에 원래 있던 readOnly도 지웠습니다.

<img class="img-fluid" src="/img/posts/inPost/rest-12-01.gif">

우선 handleChange 메소드 코드입니다.

```
handleChange(event) {
  event.preventDefault();
  this.setState({ title: event.target.value });
}
```

TodoInput에서 input 필드 받을 때 이용한 메소드와 같은 형식입니다.

onChange 추가한 TodoListRow render의 input 코드입니다.

##### components/TodoListRow.js의 render
```
{/* todo item title */}
<span>
  <input onChange={this.handleChange.bind(this)} value={this.state.title} id="title"></input>
</span>
```

이렇게 하면 입력하는데로 입력되며, 입력된 값은 state.title에 반영 됩니다.

<img class="img-fluid" src="/img/posts/inPost/rest-12-02.gif">

### 2. onBlur 이벤트 추가
이제 저 input 필드에서 focus out 되면 update가 되도록 onBlur 이벤트를 추가해줍니다.

*****

> **onBlur**: The onBlur event handler is called when focus has left the element (or left some element inside of it). For example, it’s called when the user clicks outside of a focused text input.

> https://reactjs.org/docs/events.html#focus-events

*****

onBlur 이벤드가 발생하면 수행할 update 메소드를 만들어 줍니다.

##### components/TodoListRow.js
```
updateTitle() {
  if(!this.checkInputValue(this.state.title)){
      this.setData();
      return;
  }

  const todoRequest = {
    id: this.props.id,
    done: this.state.done,
    title: this.state.title
  }

  this.todoService.update(todoRequest, (item) => 
    this.setState({ titld: item.data.title, done: item.data.done }, 
        console.log(item)));
}

checkInputValue(input){
    if(input === ""){
        return false;
    }
    return true;
}
```

입력 받은 대로 수정하는 것이 아니라 빈 칸이면 업데이트를 수행하지 않습니다.

```
if(!this.checkInputValue(this.state.title)){
    this.setData();
    return;
}
```

입력된 내용이 비어있다면 setData로 원래 title을 가져와 바뀐 state.title을 원상복구 해줍니다.

빈 칸이 아니라면 update를 수행합니다.

<img class="img-fluid" src="/img/posts/inPost/rest-12-03.gif">
<span class="caption text-muted">빈 칸일 경우</span>

<img class="img-fluid" src="/img/posts/inPost/rest-12-04.gif">
<span class="caption text-muted">빈 칸이 아닌 경우 업데이트</span>

두 번째 이미지를 보면, 새로고침 해도 수정된 대로 나옵니다. 이는 DB 상에 잘 수정 적용 됐음을 의미합니다.

### 끝
이렇게 필수적인 기능은 완료가 되었습니다. css는 원하는 데로 추가해주시면 될 것 같아요!

css 관련해서는 글로 정리하기엔 특징적인 부분이 없어 따로 글을 작성하진 않을 것 같아요.

궁금하신 부분은 댓글로 남겨주세요.

전체 코드가 궁금하신 분들은 다음 링크나 페이지 푸터 쪽에 깃헙 아이콘 클릭해주세요.

<a href="https://github.com/chaelin1211/RESTful_MiniProject">github.com/chaelin1211/RESTful_MiniProject</a>

감사합니다.

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>