---
layout: post
title: "[Open API] 네이버 아이디로 로그인"
subtitle: "네이버 로그인 API 활용하기"
date: 2021-04-06 23:54:00 +0900
background: '/img/posts/naver-01.jpg'
category: Study
tags: [opensource, openapi]
---
프로젝트에서 네이버 로그인 API를 활용하고 싶어 기획한 프로젝트에 앞서 예전에 했던 프로젝트의 로그인에 API를 적용해보기로 했습니다.

예전 프로젝트의 로그인은 화면 간의 전환에서 id 관련 정보를 전달해서 유지하는 식으로 했었는데, 흔히 쓰이는 방법은 아니고 보안적으로도 아주 아주 취약해서 단순히 로그인 유지라는 기능만을 위해 적용했던 방법입니다.

이 부분이 항상 거슬렸는데 이번에 수정해보겠습니다.

## 1. 등록
### 오픈 API 이용 신청
<a href="https://developers.naver.com/products/login/api/api.md">https://developers.naver.com/products/login/api/api.md</a>

링크로 이동해 페이지 하단의 [오픈 API 이용 신청]을 클릭합니다.

<img class="img-fluid" src="/img/posts/inPost/naver-opensource-01.png">

> 로그인이 안 되어 있었다면 네이버 로그인 창이 뜹니다. 로그인 해주세요!

#### 약관 동의, 계정 정보 등록
잘 읽어보시고 동의 후 클릭, 클릭하고 애플리케이션 등록으로 넘어갑니다.

#### 애플리케이션 등록
<img class="img-fluid" src="/img/posts/inPost/naver-opensource-02.png">

우선 애플리케이션 이름을 적고, 하나씩 채워갑니다.

##### 사용 API
사용 API에선 사용하고자 했던 [네이버 아이디로 로그인]을 선택한 후 제공 정보에 대해 선택합니다.

전 이메일, 이름은 필수로 하고, 생일, 성별, 출생연도는 추가로 하였습니다.

<img class="img-fluid" src="/img/posts/inPost/naver-opensource-03.png">

##### 로그인 오픈 API 서비스 환경
저는 [PC 웹]을 선택했습니다.

<img class="img-fluid" src="/img/posts/inPost/naver-opensource-04.png">

아직 배포 전이고 테스트 용이니 로컬 서버를 잘 입력해줍니다.

**서비스 URL**은 '네이버 아이디로 로그인하는 버튼'이 있는 페이지의 주소를 입력하시면 되고,

**Callback URL**은 네이버 아이디로 로그인한 뒤 다시 돌아 올 페이지의 주소를 입력해야합니다. 팝업 창에서 뜨는 페이지 입니다!

여기까지 했으면 [등록하기]!

### 등록 확인
<img class="img-fluid" src="/img/posts/inPost/naver-opensource-05.png">

내 애플리케이션에 잘 등록 되었습니다.

Client ID와 Client Secret은 로그인 오픈 API를 이용하기 위해 필요합니다. 다음을 참조해 주세요.

<img class="img-fluid" src="/img/posts/inPost/naver-opensource-06.png">

<a href="https://developers.naver.com/docs/login/api/api.md">https://developers.naver.com/docs/login/api/api.md</a>의 내용을 보기 쉽게 정리한 것입니다.

## 2. 코드
<a href="https://developers.naver.com/docs/login/api/api.md">https://developers.naver.com/docs/login/api/api.md</a> 여기에 들어가시면 API 호출 예제를 보실 수 있습니다.

JavaScript의 코드를 복사해서 일단 테스트를 진행해보았습니다. 아래에 스크린 샷을 첨부했습니다. 실제 코드는 바로 위 링크에서 볼 수 있으니 참고해주세요.

두 개의 파일을 추가해야 하는데 이름은 편한대로 해주세요.

저는 다음처럼 지었고, 이건 위에 적었던 서비스 URL과 callback URL과 동일합니다. 같게 해주세요!

#### naverLogin.html
<img class="img-fluid" src="/img/posts/inPost/naver-opensource-10.png">

#### callback.html
<img class="img-fluid" src="/img/posts/inPost/naver-opensource-11.png">

복사를 해왔다면 수정이 필요합니다.

* YOUR_CLIENT_ID: 위에서 애플리케이션 등록하고 받은 Client ID를 복사해서 따옴표 사이에 붙여넣어 주세요.
* YOUR_CALLBACK_URL: 입력했던 callback URL을 복사해서 따옴표 사이에 붙여넣어 주세요.
* YOUR_SERVICE_URL: 입력했던 서비스 URL을 복사해서 따옴표 사이에 붙여넣어 주세요.

naverLogin.html, callback.html 두 개 다 수정해야 합니다.

하고 로컬 서버를 재시작 해주었습니다.

#### http://localhost:8080/naverLogin
<img class="img-fluid" src="/img/posts/inPost/naver-opensource-07.png">

아직 테스트 코드 자체라 아무 것도 없습니다.

로그인 버튼을 누르면 다음 팝업 창이 뜹니다. 현재 로그인 하지 않은 상태라면 네이버 로그인 창이 뜰 것입니다.

<img class="img-fluid" src="/img/posts/inPost/naver-opensource-08.png">

등록할 때 설정했던 필수 제공 항목, 추가 제공 항목 잘 나옵니다.

동의하기 누르면 팝업 창에서 Callback URL을 호출합니다.

#### http://localhost:8080/callback
복사해 온 코드를 확인해보면, alert로 이런 저런 것들을 띄우는데 잘 나오면 성공된 겁니다.

<img class="img-fluid" src="/img/posts/inPost/naver-opensource-09.png">

잘 나오네요.

성공입니다!

이제 저 페이지들을 어떻게 기존 프로젝트에 응용할지는 각자의 몫이겠죠!

## 3. 아이콘 다운
<a href="https://developers.naver.com/docs/login/bi/bi.md">https://developers.naver.com/docs/login/bi/bi.md</a>에서 로그인 버튼 아이콘을 다운 받을 수 있습니다. 

다른 아이콘을 써도 되지만 네이버에서 권장하는 공식 디자인 특히 녹색을 권장하니 그것을 사용하도록 합시다.

## 4. 다운 없이 아이콘 바꾸기
#### naverLogin.html
```
var naver_id_login = new naver_id_login("CLIENT_ID", "CALLBACK_URL");
var state = naver_id_login.getUniqState();
naver_id_login.setButton("white", 2, 40);
naver_id_login.setDomain("SERVICE_URL");
naver_id_login.setState(state);
naver_id_login.setPopup();
naver_id_login.init_naver_id_login();
```
여기서 setButton 부분을 보면 "white"라는 부분이 있는데 버튼의 설정을 위한 파라미터 같길래 ```<head>``` 부분의 <a href="https://static.nid.naver.com/js/naverLogin_implicit-1.0.3.js">https://static.nid.naver.com/js/naverLogin_implicit-1.0.3.js</a> 문서를 확인해 보기로 했습니다.

여기서 setButton을 찾으면 다음과 같은 파라미터를 확인할 수 있습니다.

* 첫 번째: 버튼 색
* 두 번째: 버튼 타입 
    - BUTTON_TYPE = 1;
    - BANNER_SMALL_TYPE = 2;
    - BANNER_BIG_TYPE = 3;
* 세 번째: 버튼 높이

전 녹색의 긴 버튼(배너형)을 사용하고 싶어서 다음처럼 바꿨습니다.

```
naver_id_login.setButton("green", 3, 40);
```

작은 사이즈의 흰 버튼이 다음처럼 바꼈습니다.

<img class="img-fluid" src="/img/posts/inPost/naver-opensource-12.png">

### 끝
오픈 API를 처음 이용해 봤는데 개인 프로젝트에서 오픈 API를 최대한 활용하라는 글을 본 것이 떠올랐습니다.

확실히 개인 개발 부담을 덜어주고 신뢰도가 있으니 사용에 있어서도 위험 부담이 감소 되니 효율적입니다.

>참고
<a href="https://bumcrush.tistory.com/151">https://bumcrush.tistory.com/151</a>

감사합니다.

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>