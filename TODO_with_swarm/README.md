# Still Working....



## TODO app with docker



#### 요구조건

* TODO를 등록, 수정 삭제할 수 있어야 한다
* 등록된 TODO의 목록을 출력할 수 있어야 한다
* 브라우저에서 사용할 수 있는 웹 어플리케이션이어야 한다
* 브라우저 외에도 이용할 수 있도록 JSON API 엔드포인트를 제공해야 한다



#### 구성요소

| 이미지명 | 용도                                 | 서비스명                  | 스택명               |
| -------- | ------------------------------------ | ------------------------- | -------------------- |
| MySQL    | 데이터스토어                         | mysql_master, mysql_slave | MySQL                |
| API      | 데이터스토어를 다룰 API 서버         | app_api                   | Application          |
| Web      | 뷰 생성을 담당하는 어플리케이션 서버 | frontend_web              | Frontend             |
| Nginx    | 프록시 서버                          | app_nginx, frontend_nginx | Application Frontend |



#### 전체 구조

* 데이터스토어 역할을 할 MySQL 서비스를 Master-slave 구조로 구축
* MySQL과 데이터를 주고받을받을 API 구현
* Nginx를 웹 어플리케이션과 API사이에서 리버스 프록시 역할을 하도록 수정
* API를 사용해 서버 사이드 렌더링을 수행할 웹 어플리케이션 구현
* 프론트엔드쪽에 리버스 프록시(Nginx) 배치



## MySQL 서비스 구축

#### 개요

* Master/Slave 이미지 생성
* 컨테이너의 설정 파일 및 스크립트 다루는 방법
* 데이터베이스 초기화
* Master-Laver간의 Replication 설정



#### Master/Slave 구조구축

* Docker hub의 Mysql:5.7 이미지로 생성
* Master/Slave 컨테이너는 두 역할을 모두 수행할 수 있는 하나의 임지리소 생성
* MYSQL_MASTER 환경변수의 유무에 따라 해당 컨테이너가 마스터로 작동할지가 결정됨
* replicas 값을 조절해 슬레이브를 늘릴 수 있게 한다. 이때 마스터, 슬레이브 모두 일시정지(다운타임)를 허용한다



