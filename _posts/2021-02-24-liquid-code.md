---
layout: post
title: "[짧은글] Liquid 코드 그대로 출력하기"
subtitle: ".md 파일에 Liquid 코드를 그 자체로 출력하기"
date: 2021-02-24 19:39:00 +0900
background: '/img/posts/jekyll-02.png'
category: Study
tags: [githubBlog, markdown]
---

안녕하세요!

마크다운 글에서 liquid 코드를 첨부하면 자동으로 해석되어 첨부되는 부분 때문에 스크린샷으로 첨부하곤 했는데 그대로 작성하는 방법을 알아냈습니다~

`{%raw%}{% raw %}{%endraw%}`를 이용하는 것입니다.

그대로 출력하고자 할 코드 블록을 다음 형식 안에 입력해줍니다.

```
{% raw %}{%{% endraw %} raw %}
    그대로 출력하고자 할 Liquid 코드 블록
{% raw %}{%{% endraw %} endraw %}
```

##### +) raw, endraw 태그 자체를 그대로 출력하기

```
{% raw %}{% raw %}{% endraw %}{% raw %}{%{%{% endraw %} endraw {% raw %}%}{% endraw %} raw{% raw %} %}{% endraw %}
{% raw %}{% raw %}{% endraw %}{% raw %}{%{%{% endraw %} endraw {% raw %}%}{% endraw %} endraw{% raw %} %}{% endraw %}
```
다음 코드를 .md 파일에 작성하면 아래처럼 출력됩니다.

```
{% raw %}{%{% endraw %} raw %}
{% raw %}{%{% endraw %} endraw %}
```

감사합니다.
<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>
