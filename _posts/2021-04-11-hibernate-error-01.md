---
layout: post
title: "[Error] Hibernate ddl auto 오류"
subtitle: "Hibernate ddl-auto=update is not working"
date: 2021-04-11 5:40:00 +0900
background: '/img/posts/error-01.jpg'
category: Study
tags: [error, hibernate]
---
이전에 교육에서 수행했던 프로젝트를 뜯어 고치는 작업을 올 초부터 해오고 있는데, 그 땐 프로젝트 기간이 워낙 짧고(최종 프로젝트인데 1박 2일 정도 기간 밖에 안 줬습니다...) 명목은 프론트 엔드 교육이라 대부분 설정은 그냥 강사님이 제공해 주신 코드를 가져왔었는데 그게 이렇게 터졌네요.

몰랐는데 서버 열릴 때 마다 DDL을 자동 수행 하던게 Hibernate를 이용한 것이었습니다.

몰랐다는 사실이 어이가 없지만 이 김에 틈틈이 공부를 해보기로 하며! 

이번 글은 Hibernate ddl auto가 작동하지 않을 때 해결 방법을 모은 것입니다.

### 1. application.properties
```spring.jpa.hibernate.ddl-auto=update```를 다음으로 변경하면 되는 경우도 있다고 합니다.

```
spring.jpa.properties.hibernate.hbm2ddl.auto=update
```

저의 경우엔 이 걸로 해결되지 않았습니다.


### 2. Bean 생성 확인
로그를 다시 잘 확인해 보니 Bean 관련 오류가 있더라구요.

위에서도 언급 했듯이 지식 부족으로, DDL에 새로운 테이블을 추가하면 Bean도 함께 추가해야 한다는 것을 몰랐습니다...!

또, 찾아보니 Bean을 생성해도 오류로 인식하지 못하는 경우가 있다고하니 Bean을 확인해 보세요.

### 끝
배움엔 끝이 없네요...

감사합니다.

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>