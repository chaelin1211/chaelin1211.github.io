---
layout: post
title: "[1011] Fly me to the Alpha Centauri"
subtitle: "우현이는 어린 시절, 지구 외의 다른 행성에서도 인류들이 살아갈 수 있는 미래가 오리라 믿었다."
date: 2021-02-12 00:56:00 +0900
background: '/img/posts/algorithm-01.jpg'
category: Study
---
### 문제
우현이는 어린 시절, 지구 외의 다른 행성에서도 인류들이 살아갈 수 있는 미래가 오리라 믿었다. 그리고 그가 지구라는 세상에 발을 내려 놓은 지 23년이 지난 지금, 세계 최연소 ASNA 우주 비행사가 되어 새로운 세계에 발을 내려 놓는 영광의 순간을 기다리고 있다.

그가 탑승하게 될 우주선은 Alpha Centauri라는 새로운 인류의 보금자리를 개척하기 위한 대규모 생활 유지 시스템을 탑재하고 있기 때문에, 그 크기와 질량이 엄청난 이유로 최신기술력을 총 동원하여 개발한 공간이동 장치를 탑재하였다. 하지만 이 공간이동 장치는 이동 거리를 급격하게 늘릴 경우 기계에 심각한 결함이 발생하는 단점이 있어서, 이전 작동시기에 k광년을 이동하였을 때는 **k-1 , k 혹은 k+1** 광년만을 다시 이동할 수 있다. 

예를 들어, 이 장치를 처음 작동시킬 경우 -1 , 0 , 1 광년을 이론상 이동할 수 있으나 사실상 음수 혹은 0 거리만큼의 이동은 의미가 없으므로 1 광년을 이동할 수 있으며, 그 다음에는 0 , 1 , 2 광년을 이동할 수 있는 것이다. ( 여기서 다시 2광년을 이동한다면 다음 시기엔 1, 2, 3 광년을 이동할 수 있다. )

<img class="img-fluid" src="/img/posts/inPost/algorithm-01.JPG">

김우현은 공간이동 장치 작동시의 에너지 소모가 크다는 점을 잘 알고 있기 때문에 x지점에서 y지점을 향해 최소한의 작동 횟수로 이동하려 한다. 하지만 y지점에 도착해서도 공간 이동장치의 안전성을 위하여 **y지점에 도착하기 바로 직전의 이동거리는 반드시 1광년**으로 하려 한다.

김우현을 위해 x지점부터 정확히 y지점으로 이동하는데 필요한 공간 이동 장치 작동 횟수의 최솟값을 구하는 프로그램을 작성하라.

*****

저는 반복문을 통해 x부터 y까지 가능한 이동 범위 중 가장 큰 k+1을 추가하되 도착 직전에 이동 범위가 1이 아닌 경우 이전으로 돌아가도록 코드를 작성하였습니다.

``` java

while (i < y) {             // i: 현재 위치
    k = termList.peek();    // 이전 이동 범위
    term[0] = k + 1;        // 가능한 이동 범위 세가지 모두 추출
    term[1] = k;
    term[2] = k - 1;

    k = -1;
    for (int tmp : term) {  // 이동 범위 중 가능한 범위 추출 (큰 순으로)
        if (i + tmp < y || (i+tmp == y && tmp ==1)) {
                            // y를 벗어나지 않거나 y 직전일 때 이동 거리가 1인 경우 
            k = tmp;
            break;
        }
    }
    if (k <= 0) {           // 가능한 이동 범위가 없음
        termList.add(termList.pop() - 1);
    }else if(i+k == y && k != 1){   // 마지막 이동이 1이 아닌 경우
        termList.add(termList.pop() - 1);
    }else{                  // 가능한 이동 범위인 경우 stack에 저장
        i+=k;             
        location.add(i);
        termList.add(k);   
    }
}

```

이전으로 돌아가기 위해 거쳐온 위치를 **stack**에 저장했습니다. 또 이동 범위도 같이 스택에 저장하였습니다.

끝으로는 이 stack의 size를 return하며 종료합니다.

> 근데 이 방법으로는 **시간초과**가 발생하네요.... 다시 풀어보고 추가하겠습니다!

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin.</p>