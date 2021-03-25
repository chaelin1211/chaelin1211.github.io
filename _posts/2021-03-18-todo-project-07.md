---
layout: post
title: "[REST] TO-DO List 만들기(7) - PUT,DELETE"
subtitle: "기능 추가하기 (PUT, DELETE)"
date: 2021-03-18 23:51:00 +0900
background: '/img/posts/rest-02.jpg'
category: Study
tags: [rest, restful, miniproject, spring, reactjs, nodejs]
---

안녕하세요.

GET, POST 기능까지 구현한 프로젝트를 확장해서 PUT, DELETE 기능 구현 해보겠습니다.

여기까지 하면 BackEnd에서 필요한 부분의 대부분은 완성됩니다.

### 1. PUT - Update
#### Service에 update 메소드 추가
##### TodoService
```
public TodoBean update(final TodoBean todoBean) {
    if (todoBean == null) {
        throw new NullPointerException("To Do Bean cannot be null");
    }
    
    final TodoBean original = todoRepository.findById(todoBean.getId())
            .orElseThrow(() -> new RuntimeException("Entity Not Found"));
    original.setTitle(todoBean.getTitle());
    original.setDone(todoBean.isDone());
    
    return todoRepository.save(original);
}
```

1) 입력 받은 아이템이 null인지 체크   
2) 입력 받은 아이템을 바로 업데이트하지 않고 기존에 존재하는지 체크 (findById로 찾습니다.)   
3) 기존에 존재하는 아이템을 Update해서 save로 갱신   

save 전 내용을 체크 해주는 로직(Validation check)이 있다면 추가해주세요.

#### Controller에 update 메소드 추가
Service의 Update 메소드를 이용할 Controller의 Update 메서드를 만들어주세요.

##### TodoController
```
@RequestMapping(method=RequestMethod.PUT)
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
create 메소드와 매우 유사한 형태의 메소드가 생성되었습니다.

1) RequestMethod를 PUT으로 변경   
2) todoService의 update 메서드 호출

위의 두 가지 차이가 있습니다.

> PUT을 사용하지 않고 POST만 이용하는 어플리케이션에선 Insert+Update로 upsert 메소드를 사용하기도 한답니다. 존재하지 않을 경우 create로 생성하고, 존재하면 update로 수정하는 것입니다.

#### 기존 TodoAdapter 수정
위 Controller에서 TodoRequest를 TodoBean으로 수정해주는 TodoAdapter의 메소드를 이용합니다.

위에서 보셨듯이 Service의 update 메소드에서 findById를 해야하기 때문에 Controller에서 update 메소드를 호출할 때 넘겨주는 TodoBean에는 id 정보가 있어야 합니다.

하지만 기존 TodoAdapter.toTodoBean을 보면 다음처럼 id를 셋팅하는 부분이 빠져있습니다.

##### 기존 TodoAdapter.toTodoBean
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

그러니 다음처럼 id를 추가해주는 코드를 추가해주세요.

##### 수정된 TodoAdapter.toTodoBean
```
public static TodoBean toTodoBean(final TodoRequest todoRequest){
    if(todoRequest == null){
        return null;
    }
    return  TodoBean.builder()
        .id(todoRequest.getId())
        .title(todoRequest.getTitle())
        .done(todoRequest.isDone())
        .build();
}
```

#### Test
1) 우선 테스트할 데이터를 Postman으로 POST 해줍니다.
<img class="img-fluid" src="/img/posts/inPost/rest-08-01.png">

2) Update를 위해 id를 복사해 보내줍니다.
<img class="img-fluid" src="/img/posts/inPost/rest-08-02.png">

수정될 내용도 입력해주신 후에 SEND 해주세요!

<img class="img-fluid" src="/img/posts/inPost/rest-08-03.png">

Return 된 item을 보시면 갱신된게 보이시죠!

3) GET으로 다시 확인해봅시다.
<img class="img-fluid" src="/img/posts/inPost/rest-08-04.png">

잘 수정되었습니다.

### 2. DELETE
#### Service에 delete 메소드 추가

##### TodoService
```
public TodoBean delete(final TodoBean todoBean){
    if (todoBean == null) {
        throw new NullPointerException("To Do Bean cannot be null");
    }
    final TodoBean original = todoRepository.findById(todoBean.getId())
            .orElseThrow(() -> new RuntimeException("Entity Not Found"));
    todoRepository.delete(original);
    return original;
}
```
이건 제 창작 코드입니다...! 참고하던 블로그에 Delete 메소드가 없어서...

1) 삭제할 아이템이 null인지 아닌지 확인   
2) 기존에 존재하는 아이템인지 검사 (findById로 검색)   
3) delete 하고 삭제된 아이템 리턴

#### Controller에 Delete 메소드 추가
Service의 Delete를 이용할 Controller의 Delete메서드를 만들어주세요.

##### TodoController 
```
@RequestMapping(method=RequestMethod.DELETE, value = "/{id}")
public @ResponseBody TodoResponse delete(@PathVariable(value="id") String id){
    List<String> errors = new ArrayList<>();
    TodoBean todoBean = todoService.get(id);
    try{
        todoBean = todoService.delete(todoBean);
    }catch(final Exception e){
        errors.add(e.getMessage());
        e.printStackTrace();
    }
    return TodoAdapter.toTodoResponse(todoBean, errors);
}
```

id를 url로 전달 받아 get을 통해 TodoBean 객체를 찾아 todoService로 삭제해 줍니다.

#### Test
1) 기존에 POST로 생성해 놓은 아이템의 id를 DELETE으로 넘겨줍니다.
<img class="img-fluid" src="/img/posts/inPost/rest-08-05.png">

SEND를 누르면 다음처럼 삭제된 아이템이 Return됩니다.

<img class="img-fluid" src="/img/posts/inPost/rest-08-06.png">

2) GET을 통해 확인합니다.
<img class="img-fluid" src="/img/posts/inPost/rest-08-07.png">

잘 삭제되었습니다.

*****

여기까지 Back end 기능은 대충 구현되었습니다.

다음엔 Front end 기능으로 어플리케이션을 구현해보겠습니다.

감사합니다.

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>