---
layout: post
title: "[Design Pattern] Interpreter"
subtitle: "[디자인 패턴][행위 패턴] 인터프리터"
date: 2021-05-03 01:34:00 +0900
background: '/img/posts/design-pattern.jpg'
category: Study
tags: [designpattern]
---
### Interpreter
* 문법 규칙을 클래스화 한 구조로, 일련의 규칙으로 정의된 문법적 언어를 해석하는 패턴
* SQL 구문 분석, 기호 처리 엔진 등에서 사용

SQL과 같은 계층적 언어를 해석하기 위해 **계층 구조**를 표현할 수 있습니다.

여러 객체를 조합해 문법을 정의합니다. 
각각의 객체는 특정한 문법을 처리할 수 있도록 구현됩니다. 

이들이 모여 컴포지트 패턴과 같은 복합적인 트리 구조로 이루어지게 됩니다. 이는 하위 객체가 처리한 결과를 조합하여 새로운 결과를 만들어내게 해줍니다.

사용자가 원하는 다양한 명령을 쉽게 표현할 수 있게 구문 약속을 해야하며, 해석자에서는 이와 같이 약속된 구문이 입력 인자로 전달되었을 때 이를 해석할 수 있어야 합니다.

### 사용하기 좋은 경우
* 정의할 언어의 문법이 간단!
* 성능이 중요한 문제가 되지 않을 때

위와 같은 경우에 사용한다면 문법의 수정이나 새로운 문법을 추가하기 용이해지지만 문법이 복잡해진다면 문법을 정의하는 객체 구조가 복잡해져 관리가 어려워집니다.

**간단한 문법에 한해 사용하길 권장됩니다**

### 다이어그램
<img class="img-fluid" src="/img/posts/inPost/interpreter-01.png"/>

다이어그램으로 보니 Composite 패턴과 유사합니다.

<a href="https://chaelin1211.github.io/study/2021/04/14/Composite.html">컴퍼지트 패턴</a>

* Context: String 표현식이어야 하며, 인터프리터에 보내는 정보입니다.
* AbstractExpression: 추상 구문 트리에 속한 모든 노드에 해당하는 클래스들이 공통으로 가져야할 연산을 정의하는 인터페이스입니다.
* TerminalExpression: 문법에서 정의한 터미널 기호와 관련된 해석 방법을 구현합니다. 문법에 오른편(종착점)에 나타나는 모든 기호에 대해 클래스를 정의합니다.
* NonterminalExpression: 논터미널 익스프레션에 대응하는 역할입니다.

### 예시와 이해
<img class="img-fluid" src="/img/posts/inPost/interpreter-02.png"/>
파일을 로드하고 삭제하는 명령어를 수행하는 프로그램을 인터프리터 패턴을 이용해 만들었습니다.

* ActionExpression: NonTerminalExpression에 해당하는 부분으로, LOAD, DELETE 등의 명령어를 해석하는 부분
* FileExpression: TerminalExpression에 해당하는 부분으로, file 타입과 file 이름이 입력되면 해당하는 FileExpression 객체의 fileList에 해당 file 이름을 저장합니다.
* ActionExpression의 interprete(): ActionExpression에 저장된 FileExpression의 interprete()을 호출 합니다.

컴포지트 패턴을 이용해서 유연한 포함관계를 하려 하였으나 [명령어 - 파일리스트] 구조가 더 깔끔할 것 같아서 ActionExpression 내에 FileExpression만 포함되도록 하였습니다.

예시를 간단한 이미지로 보다면 다음과 같습니다.

<img class="img-fluid" src="/img/posts/inPost/interpreter-03.png"/>

#### Expression
<script src="https://gist.github.com/chaelin1211/8d4678856f7ae9fe0999db68c8eeec20.js"></script>

* ActionExpression은 HashMap으로 FileExpression을 저장하므로써, 한 파일 타입에 해당하는 객체를 중복되지 않게 가질 수 있습니다. 추가적으로 필요시에 생성되도록 할 수 있습니다.
* ActionExpression은 Interprete 후 가지고 있던 FileExpression의 HashMap을 초기화 합니다. 이는 해당 Action 명령어에 대한 객체를 중복 생성하지 않고 재사용하기 때문입니다.

#### Interpreter
<script src="https://gist.github.com/chaelin1211/c459895cd7d754367ff21b49df00973a.js"></script>

* ActionExpression 객체를 생성하고, Context를 입력 받아 분해 후 해석하는 동작을 하는 클래스 입니다.
* ActionExpression 객체는 해당 객체 생성과 동시에 생성되며, Context가 변경되거나 하는 등의 동작이 있어도 수정/삭제되지 않고 재사용 됩니다.

#### Main
<script src="https://gist.github.com/chaelin1211/3ef783d4c8f7d8e49cdab7eb7e783724.js"></script>

여러 형태로 Context를 생성했습니다.

세 번 째의 경우 Action 명령어가 두 번 포함되었습니다. 

실행 결과는 다음과 같습니다.

#### 출력
```
Context_01------------------------------
Action: LOAD
IMAGE: flower.jpg 
VIDEO: happy.mp3 
Context_02------------------------------
Action: DELETE
IMAGE: delete.jpg 
VIDEO: blue.mp3 
Context_03------------------------------
Action: LOAD
IMAGE: flower.jpg 
Action: DELETE
IMAGE: delete.jpg 
VIDEO: blue.mp3 
```

Action이 두 번 등장해도 오류 없이 잘 작동합니다.

간단한 문장 해석에도 굉장히 긴 코드가 필요하네요. 더 복잡해 질 경우엔 작성 시간과 수행 시간 모두 오래 걸릴 것 같습니다.

구현하기 너무 복잡한 경우, 컴파일러나 파서를 쓰는게 더 효율적일 수도 있다고 합니다.

*****

> 참조
* <a href="https://httt.tistory.com/2">https://httt.tistory.com/2</a>
* <a href="https://yupdown.tistory.com/19">https://yupdown.tistory.com/19</a>
* <a href="https://thefif19wlsvy.tistory.com/50">https://thefif19wlsvy.tistory.com/50</a>

감사합니다.

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>