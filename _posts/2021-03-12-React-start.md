---
layout: post
title: "[React] React 시작"
subtitle: "create-react-app 살펴보기"
date: 2021-03-04 23:00:00 +0900
background: '/img/posts/rest-02.jpg'
category: Study
tags: [reactjs]
---
> 참고: <a href="https://eunvanz.github.io/react/2018/06/05/React-create-react-app%EC%9C%BC%EB%A1%9C-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0/">[React] create-react-app으로 프로젝트 시작하기</a>

create-react-app으로 프로젝트 시작하는 방법은 <a href="https://chaelin1211.github.io/study/2021/03/04/rest-project-04.html">이 글</a>을 참조해주세요.
### 1. 살펴보기
우선 저번에 만든 프로젝트를 살펴보겠습니다. 

create-react-app으로 실행해 만들어진 프로젝트에 자동으로 무언가 많이 설치가 되었습니다.

```
> node_modules/
> public/
    index.html
    favicon.ico
> src/
    App.css
    App.js
    App.test.js
    index.css
    index.js
    logo.svg
    reportWebVitals.js
    setupTests.js
    package-lock.json
    package.json
```

* node_modules: Package manager를 통해 설치된 모듈들이 모여있는 디렉토리
* public: ReactJS의 html 파일과 favicon 아이콘이 있는 디렉터리로 static 자원이 위치하게 된다.
* src: 대부분의 코딩이 이루어질 디렉터리. ReactJS의 컴포넌트가 모여 있게 된다.
* package.json: Package manager를 통해 설치된 모듈과 스크립트 명령어 등을 담고 있다.

public/index.html과 src/index.js는 엔트리 포인트가 되는 소스로, 이름이 변경되면 create-react-app이 작동되지 않으니 주의해주세요.

```
{
  "name": "restful_project-front",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.11.9",
    "@testing-library/react": "^11.2.5",
    "@testing-library/user-event": "^12.8.3",
    "react": "^17.0.1",
    "react-dom": "^17.0.1",
    "react-scripts": "4.0.3",
    "web-vitals": "^1.1.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },

```

node_modules 폴터를 보면 내부적으로 무수히 많은 dependency가 존재함을 알 수 있습니다. 하지만 package.json을 살펴보면 단순한 dependency가 몇 개 없습니다.

이는 create-react-app의 특징으로 사용자로 하여금 설정을 건들지 못하도록 실제 package.json을 숨긴 것입니다. 개발자들이 소스코드에 집중할 수 있도록 배려한 것입니다. 

이러한 것은 scripts의 eject 값을 통해 해제할 수 있습니다.

scripts의 start는 프로젝트를 실행할 때 사용됩니다. ```npm start```명령어로 사용하면 됩니다.

build는 실제로 배포할 파일들을 build 디렉터리 밑에 생성해줍니다. 

### 2. 기존 소스코드 분석
#### src/index.js
```
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
reportWebVitals();
```

```
import React from 'react';
```
jsx 문법을 사용하기 위해서 react 모듈을 import 해야합니다. 모든 react 컴포넌트에 필수적인 코드입니다.

```
import ReactDOM from 'react-dom';
```
react 앱을 **최초 렌더링** 하기위해 엔트리 포인트에서 사용됩니다. 브라우저 뿐만 아닐라 서버사이드용 렌더링 메소드를 지원합니다.

```
import App from './App';
```
App이라는 react 컴포넌트를 가져오는 코드입니다. 

컴포넌트는 react 웹에서 기본적인 화면을 구성하는 단위로 button, input, textarea와 같은 것들이나 이런 것들로 구성된 화면 자체도 의미합니다.

react는 이러한 컴포넌트를 만들고 조립하는 것을 용이하게 해줌으로써 개발에 편의성을 제공합니다.

```
import reportWebVitals from './reportWebVitals';
```
reportWebVitals란 React의 성능을 측정하기 위한 것입니다.

```
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
```
위 코드의 의미는 root란 id를 가진 element에 App 컴포넌트를 렌더링 한다는 것입니다. 

public/index.html에서 root라는 id를 가진 div 태그를 확인할 수 있습니다.

#### src/App.js
고로 저희가 화면에 출력하기 위해 작성해야 하는 코드 부분은 App.js입니다.

```
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
```

function 내부의 내용을 수정해서 테스트 해보겠습니다. 우선 변경 전 실행 화면은 다음과 같습니다. 

<img class="img-fluid" src="/img/posts/inPost/rest-05-02.png">

```
function App() {
  return (
    <p>hi there</p>
  );
}
```
심플하게 변경 후 실행합니다.

```
npm start
```

위 명령어 입력 시 바로 localhost:3000으로 연결되고 다음처럼 화면이 나타납니다.

<img class="img-fluid" src="/img/posts/inPost/react-01-01.png">

#### public/index.html
create-react-app은 템플릿이 제공되어 참 편리한 거 같아요~

코드 보시면 기본 템플릿이 제공된 것을 알 수 있습니다.

필요에 맞게 title을 수정하거나 Bootstrap을 적용할 수 있겠네요.

> comment는 생략하고 가져온 코드입니다.
```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

위에 id가 root인 div 태그 보이시죠! 거기에 App.js에서 입력한 내용이 들어가게 됩니다.

### 끝
추가적인 내용 없이 일단 설치된 부분을 살펴보기만 했습니다.

추후 글에서 RESTful API와 연결하고 코드 수정을 통해 UI도 꾸며보도록 할게요!

감사합니다.

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>
