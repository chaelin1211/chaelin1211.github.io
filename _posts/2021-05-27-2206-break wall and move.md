---
layout: post
title: "[2206] 벽 부수고 이동하기"
subtitle: "도중에 한 개의 벽을 부수고 이동하는 것이 좀 더 경로가 짧아진다면, 벽을 한 개 까지 부수고 이동하여도 된다."
date: 2021-05-27 16:3:00 +0900
background: '/img/posts/wall.jpg'
category: Study
tags: [algorithm, baekjoon]
result: Success
---
### 문제
N×M의 행렬로 표현되는 맵이 있다. 맵에서 0은 이동할 수 있는 곳을 나타내고, 1은 이동할 수 없는 벽이 있는 곳을 나타낸다. 당신은 (1, 1)에서 (N, M)의 위치까지 이동하려 하는데, 이때 최단 경로로 이동하려 한다. 최단경로는 맵에서 가장 적은 개수의 칸을 지나는 경로를 말하는데, 이때 시작하는 칸과 끝나는 칸도 포함해서 센다.

만약에 이동하는 도중에 한 개의 벽을 부수고 이동하는 것이 좀 더 경로가 짧아진다면, 벽을 한 개 까지 부수고 이동하여도 된다.

한 칸에서 이동할 수 있는 칸은 상하좌우로 인접한 칸이다.

맵이 주어졌을 때, 최단 경로를 구해 내는 프로그램을 작성하시오.

### 입력
첫째 줄에 N(1 ≤ N ≤ 1,000), M(1 ≤ M ≤ 1,000)이 주어진다. 다음 N개의 줄에 M개의 숫자로 맵이 주어진다. (1, 1)과 (N, M)은 항상 0이라고 가정하자.

### 출력
첫째 줄에 최단 거리를 출력한다. 불가능할 때는 -1을 출력한다.

***** 

### 접근
이전에 풀었던 문제처럼 브루트 포스 알고리즘을 이용해서 모든 벽을 하나씩 부셔서 최소를 구하는 방법을 사용하려 했는데 시간 초과가 발생했습니다.

<a href="https://chaelin1211.github.io/study/2021/05/02/14502-lab.html">[14502] 연구소</a>이 문제는 벽을 3개 세우는 문제인데 브루트 포스와 BFS를 활용해 풀었던 문제입니다.

연구소 문제의 입력은 N, M의 최대 크기가 8인데다가 벽을 세우는 경우의 수가 많아 브루트 포스가 적합했지만 이번 문제는 N, M의 최대가 1000이며 벽을 부수는 횟수가 최대 1번이기 때문에 브루트 포스가 적합하지 않는데 이 부분을 간과해서 시간 초과를 겪었습니다.

*****

전체적인 구성은 BFS를 이용해 최단 거리를 구하는 것입니다.

#### 벽을 부순 경험이 있나요?
평소처럼 좌표를 큐에 넣어 BFS를 하던 형식에 한 가지를 더 추가해줍니다. 바로 이전에 벽을 부순 적이 있는지에 대해 저장하는 필드 입니다.

즉 큐에 **좌표와 이 루트가 벽을 부수는 동작을 했는지에 대한 boolean 값**을 저장해야 합니다.

이것을 위해 클래스를 하나 작성합니다.

##### Position
<script src="https://gist.github.com/chaelin1211/86156f54c31523a89ab9531b71b1bb5a.js"></script>

BFS를 순회하면서 주변 좌표를 큐에 넣을 때, 이전에 벽을 부수고 지금 위치에 도달한 것인지에 대한 Boolean 값도 같이 저장하므로써 1을 만났을 때의 동작을 두 가지로 나눌 수 있습니다.

* 이전에 벽을 부순 적이 있다 -> 무시하고 처음으로 돌아간다 (continue;)
```
if ((isBreaked && arr[dx][dy] == 1)) {
	continue;
}
```
* 이전에 벽을 부순 적이 없다 -> 벽을 부수고 주위 좌표를 큐에 넣는다.


#### 방문한 적이 있나요?
BFS에서 이전에 방문한 좌표는 다시 방문하지 않도록 boolean array 등을 이용해 확인해주어야 합니다. 아니면 무한루프를 돌게 됩니다.

이 문제에선 visited를 두 가지 경우로 나눠 확인합니다.

* 벽을 부순 루트로 방문했는지
* 벽을 부수지 않은 루트로 방문했는지

만약 이전에 벽을 부순 후 x, y에 도달했을 때, 다른 경로로 [이전에 벽을 부순 후] x, y에 도달한 적이 있는지 확인해야 합니다.

벽을 부수지 않고 x, y에 도달한 것과 구분 없이 visited를 확인한다면 최단 경로가 수행 중단 될 수 있습니다.

```
0010
1010
```

위의 경우 1, 1의 좌표에 도달하기 위해 벽을 안 부수고 도달할 수 있지만 벽을 부수고 도달하는 경우도 있습니다.

만약 visited를 구분하지 않았다면 순서에 따라 벽을 안 부수고 1, 1에 도달하는 경로가 무시될 수 있습니다. 그렇게 되면 벽에 의해 1,3의 좌표에 도달할 수 없습니다.

그래서 visited array를 3차원 배열을 이용해서 boolean[N+1][M+1][2]로 해서 만들어 줍니다.

#### 종합적인 Solution

|Method|Return|Description|
|---|---|---|
|solution(int N, int M, int[][] arr)|int|최초 맵의 크기와 맵을 입력 받아 1, 1에서 N, M까지 도달하는 최단 경로 이동 수를 리턴합니다.|

****

|Field|Description|
|---|---|
|boolean[][][] visited|해당 좌표를 방문한 적이 있는지 확인하는 3차원 배열|
|Queue<Position> queue|BFS 탐색을 위한 큐|
|int sizeOfQueue|큐를 가상의 큐로 나누기 위해 가상의 큐의 크기를 저장하는 정수|
|int[][] terms|해당 좌표에서 주위 좌표와의 차이 값을 저장한 배열으로 현재 좌표에 각각 더해주면 주위 좌표의 값을 얻을 수 있다|

*****

<script src="https://gist.github.com/chaelin1211/da09da4fbaa620f2f7520771df05f61a.js"></script>

#### 결과
사용 연어: Java 11

|메모리|시간|
|145208 KB|724 ms|

감사합니다.

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>