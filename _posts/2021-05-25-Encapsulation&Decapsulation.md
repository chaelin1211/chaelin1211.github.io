---
layout: post
title: "[네트워크] 인캡슐레이션과 디캡슐레이션"
subtitle: "IT 엔지니어를 위한 네트워크 입문"
date: 2021-05-25 7:55:00 +0900
background: '/img/posts/cable.jpg'
category: Study
tags: [network]
---
### 1.5 인캡슐레이션과 디캡슐레이션
상위 계층에서 하위 계층으로 데이터를 보내면 물리 계층에서 전기 신호 형태로 네트워크를 통해 신호를 보냅니다. 이 과정을 **인캡슐레이션**이라 합니다.

보낸 신호를 받는 쪽에서 다시 하위 계층에서 상위 계층으로 데이터를 보냅니다. 이 과정을 **디캡슐레이션**이라 합니다.

<img class="img-fluid" src="/img/posts/inPost/capsulation-01.png">

*****

현대 네트워크는 패킷 기반으로 데이터를 작은 단위로 쪼개 보냅니다. 이런 기법으로 하나의 통신이 회선 전첼를 점유하지 않고 동시에 여러 단말이 통신하도록 해줍니다.

데이터를 패킷으로 쪼개고 네트워크를 이용해 목적지로 보내고 받는 쪽에서는 패킷을 다시 큰 데이터 형태로 결합해 사용합니다.

##### 인캡슐레이션
애플리케이션에서 데이터를 데이터 플로 계층으로 내려보내면서 패킷에 데이터를 넣을 수 있도록 분할하는 과정
* 네트워크 상황을 고려해 적절한 크기로 데이터를 쪼개고, 4계층부터 네트워크 전송을 위한 정보를 헤더에 붙여넣습니다.
* 4, 3, 2계층에서 각각 필요한 헤더를 추가해 데이터 플로 계층에서만 3개의  헤더 정보가 추가됩니다.

##### 디캡슐레이션
받는 쪽에서 디캡슐레이션 과정을 수행합니다.
1. 받은 전기 신호를 데이터 형태로 만들어 2계층으로 올려보냅니다.
2. 2계층에서는 송신자가 작성한 2계층 헤더에 포함된 정보를 확인합니다.
    * 만약 정보 중 목적지가 자신이 아니라면 자신에게 온 패킷이 아니므로 버립니다.
    * 이 부분은 랜 카드가 담당합니다.
3. 목적지가 자신이 맞다면 3계층으로 이 정보를 보냅니다. 이때 2계층의 헤더 정보는 더 이상 필요없으므로 벗겨내고 올려보내 줍니다.
4. 이 데이터를 받은 3계층에서는 2계층이 동작했던 것처럼 상대방이 적은 3계층의 헤더 정보를 확인해 자신에게 온 것이 맞는지 확인하고, 맞다면 헤더를 벗겨내 4계층으로 보냅니다.
5. 이를 받은 4계층도 3계층과 같은 과정을 거쳐 애플리케이션에 데이터를 올려보내 줍니다.

이렇게 복잡한 데이터 전달 과정을 두 가지 정보 흐름으로 정리하면 다음과 같습니다.
* 인캡슐레이션, 디캡슐레이션 과정을 통해 데이터가 전송되는 과정
* 각 계층 헤더를 이용해 송신자 계층과 수신자 계층 간의 논리적 통신 과정

만약 4계층에서 헤더를 추가했다면 그 정보는 받는 쪽의 4계층에서 확인합니다. 중간에 적힌 헤터 정보는 받는 계층에서 참고하고 버립니다.

정리하면 실제 데이터는 상위 계층 -> 하위 계층, 하위 계층 -> 상위 계층으로 전달되고 헤더 정보는 각 계층끼리 전달됩니다.

#### 헤더에 포함될 정보들
인캡슐레이션 과정에서 헤더에 넣는 정보들이 꽤 많아 모두 이해하기 힘들며 프로토콜마다 특성이 달라 적어 넣는 정보가 다르므로 이 정보를 모두 이해하려면 많은 공부가 필요합니다.

하지만 이런 복잡한 정보들에도 규칙이 있으며 헤더에 두 가지 정보는 반드시 포함되어야 합니다.

1. 현재 계층에서 정의하는 정보
2. 상위 프로토콜 지시자

##### 1. 현재 계층에서 정의하는 정보
OSI 7계층의 각 계층에서의 목적에 맞는 정보들이 포함됩니다.

* 4계층의 목적은 큰 데이터를 잘 분할하고 받는 쪽에서 잘 조립하는 것입니다.
    * 데이터의 순서를 정하고 받은 패킷의 순서가 맞는지, 빠진 패킷은 없는지 점검하는 역할이 중요하여 이 정보를 헤더에 적어 넣게 됩니다.
    * TCP/IP의 4계층 프로토콜인 TCP에서는 시퀀스, 애크 번호 필드로 이 데이터를 표현합니다.
* 3계층 헤더에는 3계층에서 정의하는 논리적인 주소인 출발지, 도착지 **IP 주소**를 헤더에 적어놓습니다.
* 2계층은 MAC 주소를 정의하는데 3계층처럼 2계층도 출발지, 도착지 MAC 주소 정보를 헤더에 넣습니다.

##### 2. 상위 프로토콜 지시자
프로토콜 스택은 상위 계층으로 올라갈수록 종류가 많아집니다.

3계층 프로토콜인 IP는 4계층에서는 다시 TCP와 UDP로 나뉘고 그보다 더 상위 계층에서는 FTP, HTTP, SMTP, POP3 등 더 다양한 프로토콜로 다시 나뉩니다.

인캡슐레이션 과정에선 상위 프로토콜이 많아도 문제가 없지만 디캡슐레이션하는 목적지 쪽에선 헤더에 아무 정보가 없으면 어떤 사위 프로토콜로 올려보내 주어야 할지 결정할 수 없습니다. 이런 문제가 발생하지 않도록 인캡슐레이션하는 쪽에서 헤더에 상위 프로토콜 지시자 정보를 포함해야 합니다.

각 계층마다 이 상위 프로토콜 지시자를 가지고 있지만 이름이 다릅니다.

* 4계층: 포트 번호
* 3계층: 프로토콜 번호
* 2계층: 이더 타입

디캡슐레이션할 때 상위 프로토콜 지시자 정보를 이용해 어느 상위 계층 프로토콜로 보내야 할지 구분해야 하므로 동작하는 계층보다 한 계층 위의 정보가 적혀있게 됩니다.

#### 참조) MSS & MTU (데이터 크기 조절)
* MSS(Maximum Segment Size): 4계층에서 가질 수 있는 최대 데이터 값
    * 네트워크에서 수용할 수 있는 크기를 역산정해 데이터가 4계층으로 내려올 때 적절한 크기로 쪼개질 수 있도록 유도하는데 이 크기를 MSS라 합니다.
* MTU(Maximum Transmission Unit): 2계층에서 헤더들의 크기를 제외한 데이터 크기
    * 네트워크에서 한 번에 보낼 수 있는 데이터 크기로 일반적인 이더넷에서 수용할 수 있는 크기는 1500바이트 입니다. (Jumbo Fram 제외)
    * 일반적으로 IP 헤더와 TCP 헤더의 표준 헤더 크기는 각각 20바이트이므로 일반 이더넷인 경우, MSS 값을 1460바이트로 사용합니다. (1500 - 20 - 20)

*****

### 끝
[IT 엔지니어를 위한 네트워크 입문] 도서를 참조해 공부한 내용입니다.

감사합니다.

<p class = "placeholder">Photographs by Chaelin, Unsplash.</p>