---
layout: post
title: "[Project] TO-DO List 만들기(4)"
subtitle: "React.JS와 Node.JS를 이용해 프론트엔드 개발"
date: 2021-03-04 23:00:00 +0900
background: '/img/posts/rest-02.jpg'
category: Study
tags: [miniproject, spring, reactjs, nodejs]
---
> 참고: <a href="https://imasoftwareengineer.tistory.com/39">https://imasoftwareengineer.tistory.com/39</a>

이번 포스팅에선 Node.js와 React.js를 이용해 프론트엔트 웹 서버를 만들어보곘습니다.

> 참고한 글에선 Vue.js를 이용하니 필요하신 분은 위에 링크를 이용하세요~ 전 좀 더 사용량이 많은 React.js를 먼저 경험하고 Vue.js를 사용해 보고 싶어서 React.js를 선택했습니다.

### 1. Node.js 설치
#### Node.js란?
확장성 있는 네트워크 애플리케이션(특히 서버 사이드) 개발에 사용되는 소프트웨어 플랫폼

**오픈소스 자바스크립트 런타임 엔진(컴파일러+인터프리터+여러가지 다른 기능들)**

- 작성 언어로 자바스크립트를 활용 
- Non-blocking I/O와 단일 스레드 이벤트 루프를 통한 높은 처리 성능
- **내장 HTTP 서버 라이브러리를 포함**하고 있어 웹 서버에서 아파치 등의 별도의 소프트웨어 없이 동작하는 것이 가능

#### 다운 & 설치
Node.js 공식 사이트에서 다운 받습니다.

<a href="https://nodejs.org/en/download/">https://nodejs.org/en/download/</a>

<img class="img-fluid" src="/img/posts/inPost/rest-05-01.png">

본인 OS에 맞는 것으로 다운하세요.

다운 받아서 설치하면 cmd에서 version 정보 확인 가능합니다.

설치 전
```
> npm -version
npm : 'npm' 용어가 cmdlet, 함수, 스크립트 파일 또는 실행
정확한지 확인하고 경로가 포함된 경우 경로가 올바른지 검  
증한 다음 다시 시도하십시오.
위치 줄:1 문자:1
+ npm -version
+ ~~~
    + CategoryInfo          : ObjectNotFound: (npm:Stri
   ng) [], CommandNotFoundException
    + FullyQualifiedErrorId : CommandNotFoundException
```

설치 후
```
> npm -version
6.14.11
```

### 2. React.js 설치
#### React.js란?
자바스크립트 라이브러리의 하나로 UI를 만들기 위해 사용됩니다.

*****

#### 특징
1. 큰 생태계   
    페이스북에서 제작한 웹 애플리케이션으로 꾸준한 유지보수와 업데이트로 많이 활용되고 있습니다. 국내에선 Kakao, Naver 등 여러 기업에서 사용되고 있습니다. 
2. Virtual DOM   
    가상의 DOM으로 인터렉션이 발생하면 Virtual DOM에 한 번 렌더링하고 이를 기존 DOM과 비교해 변화가 필요한 곳만 렌더링합니다. DOM 조작을 최소화하므로써 성능 향상을 가능케 합니다.
3. JSX (JavaScript XML)   
    필수적으로 사용할 필욘 없지만 JavaScript 코드 안에서 UI 관련 작업을 할 때 시각적으로 도움을 주는 기능입니다.
    ```
    const element = <div tabIndex="0"></div>;
    ```

> 참조: edu.groom.io (https://bit.ly/3eic8dJ)

*****

#### React.js 설치
Node.js 서버를 생성하기 위해 터미널에 create-react-app를 사용해 줍니다.

```
npx create-react-app [프로젝트 명]
```

##### Create React App은 ReactJS가 제공하는 공식 스타트 키트입니다.
npm을 통해 쉽게 설치할 수 있고 webpack과 babel이 이미 설정되어 있는 ReactJS 프로젝트가 만들어져 해당 설정에 대한 어려움을 해결할 수 있습니다.

```
Success! Created nodejs_project at C:\nodejs_project
Inside that directory, you can run several commands:

  npm start
    Starts the development server.

  npm run build
    Bundles the app into static files for production.

  npm test
    Starts the test runner.

  npm run eject
    Removes this tool and copies build dependencies, configuration files
    and scripts into the app directory. If you do this, you can’t go back!

We suggest that you begin by typing:

  cd nodejs_project
  npm start

Happy hacking!
```

성공시 터미널에 출력되는 내용입니다.

### 3. React.js 실행
위의 출력대로 다음 내용을 실행하면 React 서버가 실행됩니다.

```
cd [프로젝트명]
npm start
```

<img class="img-fluid" src="/img/posts/inPost/rest-05-02.png">

다음 화면이 연결됩니다~

### 4. 끝
이번 과정으로 총 두 개의 서버를 가지게 되었습니다.

1. RESTful API가 실행되는 서버
2. React.js 및 프론트 엔드를 실행하기 위한 Node.js 서버

*****

작은 어플리케이션에서는 스프링부트 RESTful API서버는 필요 없을 수 있다. Node.js서버만 가지고도 몽고디비나 serverless api를 이용해 충분히 앱을 만들 수 있다. 하지만 대부분의 엔터프라이즈 웹 어플리케이션은 아직도 벡엔드에 RESTful API서버를 가지고 있는 추세이다.

> 출처: https://imasoftwareengineer.tistory.com/39 [삐멜 소프트웨어 엔지니어]

*****

위 내용을 참조해 두 가지 서버를 생성하였습니다.

감사합니다.

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>