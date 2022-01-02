---
layout: post
title: "[JS] defer를 이용한 동기식 수행"
subtitle: "List 내 element를 loop로 동기식 수행 방법!"
date: 2021-11-16 00:49:00 +0900
background: '/img/posts/plugin.jpg'
category: Study
tags: [javascript]
---
### JavaScript
JavaScript는 비동기식으로 수행됩니다.

비동기란? 요청을 보낸 후, 응답을 기다리는 것이 아닌 다른 수행을 하는 것을 의미합니다.

*****

코드의 순서 (수행 시간): A(20) -> B(10) -> C(50)
동기식일 경우 완료 순서: A -> B -> C
비동기식일 경우 완료 순서: B -> A -> C 

*****

> 수행 시간은 요청을 보낸 후 소요 시간을 의미하고, 바로 요청을 보낸다고 가정하였습니다.

A의 요청을 보낸 후 비동기의 경우 응답을 기다리지 않고 B를 수행하기 때문에 B가 더 일찍 끝나게 되는 것입니다.

JavaScript는 이처럼 비동기식으로 동작되기 때문에 예상과 다른 결과가 발생할 수 있습니다.

### 예시

```
var list = [1, 2, 3];
list.forEach(v => setTimeout(
	function(){
    	console.log(v)
    }, 1000/v));
console.log('loop end');
```

JAVA에 익숙하던 제가 예상한 결과는 아래와 같습니다.

##### 예상

```
1
2
3
loop end
```

##### 결과

```
loop end
3
2
1
```

loop 내부에서 각각 3000ms의 소요 시간이 발생하기 때문에, 그 사이 loop 후의 수행이 먼저 수행됩니다!

그리고 수행 시간이 짧은 순인 3 -> 2 -> 1 순으로 진행됩니다.

그렇다면 JS에서 list 내부 loop문을 순차적으로, 또 loop문 후의 로직을 순차적으로 수행하려면 어떻게 해야 할지 알아보았습니다.

*****

## 1. function 동기화
### Callback (콜백)
callback은 명시적으로 이후에 수행하고자 하는 함수를 뜻하고, parameter로 함수 자체를 전달해 수행합니다.

```
function startFnc(flag, callback){
    // 로직 수행
    flag = true;
    console.log('startFnc done!');

    // 결과 값으로 callback 함수 수행
    callback(flag);
}

function cbFnc(flag){
    console.log('cbFnc: '+flag);
}

function Main(){
    startFnc(false, cbFnc);
    startFnc(false, function(flag){
        console.log('Anonymous function: '+flag);
    });
}

Main();
```

Main에서 startFnc를 수행하면서 cbFnc(콜백함수)를 parameter로 보내면, startFnc에서는 cbFnc를 수행합니다.

이런 식으로 실행 순서를 제어할 수 있으나, cbFnc에서 다시 이후에 수행해야할 내용이 있다면 어떻게 될까요?

```
function startFnc(flag, callback, callback2){
    // 로직 수행
    flag = true;
    console.log('startFnc done!');

    // 결과 값으로 callback 함수 수행
    callback(flag, callback2);
}

function cbFnc(flag, callback){
    console.log('cbFnc: '+flag);

    callback(flag);
}

function cbFnc2(flag){
    console.log('cbFnc2: '+flag);
}

function Main(){
    startFnc(false, cbFnc, cbFnc2);
    startFnc(false, function(flag, callback){
        console.log('Anonymous function1: '+flag);
        callback(flag);
    }, function(flag){
        console.log('Anonymous function2: '+flag);
    });
}

Main();
```

여기서 하나의 로직만 더 추가해도 굉장히 복잡해집니다..!

다행히 더 쉽게 할 수 있는 방법이 존재합니다.

### Promise
Promise객체는 수행을 원하는 타이밍에 수행되도록 연기하고, try/catch의 역할도 겸하여 더 안전한 프로그래밍이 가능하도록 합니다.

Promise 객체에 **function**을 넣고, function이 완료되는 시점, 실패한 시점을 표시한 후 해당 Promise 객체를 반환합니다. 추후에 해당 객체의 then, catch method를 통해 시점에 들어갈 수행을 추후에 추가할 수 있습니다!

```

function startFnc(flag){
    return new Promise(){
        // 로직 수행
        if(flag) {
            // 성공 - then
            resolve();
        } else {
            // 실패 - catch
            reject();
        }
    }
}

function Main(){
    startFnc(false).then(
        // resolve() 자리에 치환되어 수행
        function() {
            console.log('fulfilled(성공)');
        }
    ).catch( 
        // reject() 자리에 치환되어 수행
        function() {
            console.log('rejected(실패)');
        }
    )
}

Main();

```

이 때, 하나 더! callback 함수를 추가할 때 startFnc는 수정 없이 추가할 수 있습니다.

```
function Main(){
    startFnc(false).then(
        // resolve() 자리에 치환되어 수행
        function() {
            console.log('1: fulfilled(성공)');
        }
    ).then(
        // resolve() 자리에 치환되어 수행
        function() {
            console.log('2: fulfilled(성공)');
        }
    ).catch( 
        // reject() 자리에 치환되어 수행
        function() {
            console.log('rejected(실패)');
        }
    )
}
```

위처럼 then을 중첩으로 사용하면 순차적으로 진행됩니다!

