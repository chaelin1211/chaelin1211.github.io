---
layout: post
title: "[짧은글][JavaScript] submit event 무시하기"
subtitle: "submit해도 reload 안 되도록 하기"
date: 2021-04-23 12:13:00 +0900
background: '/img/posts/jekyll-02.png'
category: Study
tags: [javascript]
---
form에서 onsubmit 이벤트를 사용하려 하는데 화면 reload 없이 원하는 function만 수행하도록 할 때 사용하는 방법입니다.

저는 버튼에 onclick시 ajax를 통해 데이터를 DB에 삽입하고 화면을 수정되도록 했는데, Enter 키를 누르면 submit이 되어서 reload 되더라구요!

그래서 애초에 onsubmit으로 하고, reload되지 않도록 하는 방법을 써보았습니다.

```
<form onsubmit="submitFunction(event)">
```

위와 같은 코드가 있을 때 submmitFunction(event)는 다음처럼 작성합니다.

```
function submmitFunction(event){
    event.preventDefault();
    
    ~~ 필요한 부분 ~~
}
```

```event.preventDefault();```을 이용하면 function의 내용은 수행하되, 화면 reload는 방지할 수 있습니다.

만약 파라미터가 더 있다면, ```submitFunction(form, event)```처럼 하면 됩니다.

감사합니다.

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>