---
layout: post
title: "[Linux] 서버 시간 동기화"
subtitle: "서버 시간과 토큰 발급 서버의 시간이 맞지 않아 오류가 발생할 경우"
date: 2023-11-20 17:56:00 +0900
background: '/img/posts/pattern01.jpg'
category: T∙I∙L
tags: [linux]
---

서버에서 웹을 띄워 실행 시키는데 토큰 검증 과정 중 오류가 발생했습니다. 

> com.auth0.jwt.exceptions.InvalidClaimException: The Token can't be used before

대략 이런 오류. 현재 시간이 발급 시간보다 전이라 미래의 토큰을 쓸 수 없어서 발생한 오류로 로컬에선 잘 되지만 배포 시에 오류가 발생했습니다.

```jsx
nptp -p  // Remote 서버 시간과 시스템 시간 offset 확인
systemctl restart ntpd // ntp 재시작을 통해 ntp 서버와 시스템 시간 동기화
hwclock --show // RTC 시간 확인
hwclock --hctosys // RTC를 시스템 시간으로 동기화
```

NTP(Network Time Protocol)의 **`offset`**은 현재 시스템 시간과 NTP 서버의 시간과의 차이를 나타냅니다. 이 값이 0에 가까울수록 시스템 시간과 NTP 서버의 시간이 정확하게 동기화되어 있다는 것을 의미합니다.

**`ntpq -p`** 명령을 사용하여 NTP 서버와의 연결 상태를 확인할 때 출력에서 **`offset`** 열을 찾을 수 있습니다. 이 값은 시스템의 현재 시간과 NTP 서버의 시간과의 차이를 밀리초(ms) 단위로 나타냅니다. **`offset`**이 0이거나 매우 작은 경우에는 시간 동기화가 잘 이루어진 것입니다.

1. 시스템 시간을 ntp 서버 시간과 동기화 
2. RTC 시간과 시스템 시간 동기화

위 두 가지를 실행한 후 재배포 하여 정상 작동을 확인할 수 있었습니다.

> [time.bora.net](http://time.bora.net) : 한국 표준시(KST)를 맞출 수 있게 지원하는 Remote 서버

*****

감사합니다.

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>
