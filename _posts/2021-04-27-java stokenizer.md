---
layout: post
title: "[Java] StringTokenizer"
subtitle: "Split과 StringTokenizer"
date: 2021-04-27 19:47:00 +0900
background: '/img/posts/design-pattern.jpg'
category: Study
tags: [java]
---
### 1. StringTokenizer 생성과 사용
문자열을 토큰으로 나누기 위해 사용되며, 구분자는 생성시 설정할 수 있습니다.

간단히 생성하고 사용하는 방법은 다음 예제를 통해 보실 수 있습니다.

```
StringTokenizer stk = new StringTokenizer("this is test");

while (stk.hasMoreTokens()) {
    System.out.println(stk.nextToken());
}
```

```
this
is
test
```

* 위처럼 특정 구분자를 입력하지 않으면 다음처럼 default 구분자를 이용해 생성합니다.
* hasMoreTokens은 다음 위치와 끝 위치를 비교해 boolean을 리턴합니다.
* nextToken은 다음으로 이동해 string 토큰을 출력합니다.
    - 이동 후! 리턴하는 역할이기 때문에 위에서 hasMoreTokens로 확인하지 않고 바로 사용하면 NoSuchElementException이 발생할 수도 있습니다.

```
public StringTokenizer(String str) {
    this(str, " \t\n\r\f", false);
}
```

문자열, 구분자, flag 순으로 입력받으며 문자열은 필수이고 나머지는 default가 따로 있습니다.

```
public StringTokenizer(String str, String delim) {
    this(str, delim, false);
}

public StringTokenizer(String str, String delim, boolean returnDelims){
    currentPosition = 0;
    newPosition = -1;
    delimsChanged = false;
    this.str = str;
    maxPosition = str.length();
    delimiters = delim;
    retDelims = returnDelims;
    setMaxDelimCodePoint();
}
```

flag의 값에 따른 차이
* true: delimiter characters are themselves considered to be tokens.
    - 구분자 또한 하나의 토큰으로 인식된다.
* false: delimiter characters serve to separate tokens.
    - 구분자는 토큰을 나누기 위해 사용된다.

```
StringTokenizer stk = new StringTokenizer("apple/banana/pear","/",true);

while (stk.hasMoreTokens()) {
    System.out.println(stk.nextToken());
}
```

```
apple
/
banana
/
pear
```

이렇게 구분자로 사용한 "/" 또한 하나의 토큰이 되어 출력됩니다.

#### 자주 사용되는 메소드
|Return|Method|Desrption|
|---|---|---|
|int|countTokens()|현재 남아있는 토큰 수 반환|
|boolean|hasMoreTokens()|토큰이 남아있다면 true, 없다면 false|
|boolean|hasMoreElements()|hasMoreTokens()와 동일|
|String|nextToken()|토큰을 읽어오며, 수행 시 읽어온 토큰은 빠진다|
|String|nextElement()|nextToken()와 동일|

*****

### 2. StringTokenizer와 Split의 차이
둘은 문자열 구분에 있어서 결과적으로도 속도적으로도 차이가 있습니다.

#### split의 원리
```public String[] split(String regex, int limit)```
split은 입력 받은 정규식을 이용해 문자열을 분리해 배열을 리턴합니다. 정규식을 이용한 분리를 이용하기 때문에 속도 면에서 StringTokenizer 보다 느립니다.

하지만 좀 더 구체적이고 유연한 구분이 가능합니다.

#### StringTokenizer
```public class StringTokenizer implements Enumeration<Object>``` 
StringTokenizer는 Enumeration을 구현하는 클래스로 문자열을 배열로 접근하기 보단 구분자로 구분해 입력 받을 때 사용할 때 적절합니다.

구분자를 하나밖에 이용할 수 없고 비교적 정확도가 떨어집니다.

#### 정리
**split**은 유연하고 구체적인 구분을 위해 사용하는 것이 좋으며, **StringTokenizer**는 비교적 단순한 구분과 나은 속도 성능을 필요로 할 때 사용하는 것이 좋다.

*****

### 3. 예제로 보는 split과 StringTokenizer 차이
#### 1. 구분자가 한 글자 이상인 경우
예시 문자열이 다음과 같을 때, 구분자를 "/&"으로 했습니다.
```String test = "apple/&banana/chicken&/";```

```
StringTokenizer stk = new StringTokenizer(test,"/&");
String[] splitArr = test.split("/&");
```

```
StringTokenizer============
apple
banana
chicken
split============
apple
banana/chicken&/
```

출력은 위처럼 다르게 나타납니다.

우선 StringTokenizer의 경우 구분자 중의 하나만 포함해도 구분자로 인식합니다.

split은 정확히 같아야 구분자로 인식됩니다.

#### 2. 구분자를 "*"할 경우
예시 문자열이 다음과 같을 때, 구분자를 "*"으로 했습니다.
```String test = "apple/*banana/chicken*/";```

```
StringTokenizer stk = new StringTokenizer(test,"*");
String[] splitArr = test.split("*");
```

<img class="img-fluid" src="/img/posts/inPost/split-01.png">

위처럼 되는 이유는 *이 정규식에서 특별한 의미를 가지는 메타 문자이기 때문입니다.

split에서 특정 문자는 단독으로 사용될 수 없습니다. 그 종류는 다음과 같습니다.

".$|()[{^?*+\\" 이 문자들을 split에서 구분자로 사용하기 위해선 \\(역슬래쉬 두 번)을 앞에 붙여주어야 합니다.

```
String[] splitArr = test.split("\\*");
```

이렇게요! 

*****

### 끝
특수한 경우의 예시만 간단히 가져왔습니다.

눈에 보이진 않지만 속도 차이가 좀 나긴 하는 것 같습니다.

백준 알고리즘 문제를 풀다가 시간 초과 문제가 발생해서 질문 검색의 비슷한 경우의 답변을 봤는데, split을 StringTokenizer로 고쳐 해결했다고 해서 해봤는데 저도 도움이 되어 비교해 조사해 보았습니다.

*****

>참조
* <a href="https://soobarkbar.tistory.com/55">https://soobarkbar.tistory.com/55</a>
* <a href="https://docs.oracle.com/javase/7/docs/api/java/util/StringTokenizer.html">https://docs.oracle.com/javase/7/docs/api/java/util/StringTokenizer.html</a>

감사합니다.

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>