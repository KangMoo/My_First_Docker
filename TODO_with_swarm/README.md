# Still Working....



# TODO app with docker



## How to build

1. Make Swarm
2. Build MySQL service



#### 0.Visualizer (Not Necessary)

>`$ docker stack deploy -c /stack/visualizer.yml visualizer`



#### 1.Make Swarm

1. Need register container, manager container, and 3 worker container

   > `$ docker-compose up`

2. init swarm

   > `$ docker exec -it manager docker swarm init`

3. copy swarm command

4. join swarm

   > `$ docker exec -it worker03 docker swarm ~~~~`



#### 2. BuildMySQL service

1. Go to directory : toto/tododb 

2. Build image

   > `$ docker build -t localhost:5000/ch04/tododb:latest .`

3. Register built image

   > `$ docker push localhost:5000/ch04/tododb:latest`

   Check 

   > `$ curl http://localhost:5000/v2/_catalog` 
   >
   > check 'ch04/tododb' repository

4. Pull registered image

   > `$ docker exec -it manager docker pull registry:5000/ch04/tododb `

5. Create network

   > `$ docker exec -it manager docker network create --driver=overlay --attachable todoapp`

6. Make Stack

   > `$ docker exec -it manager docker stack deploy -c /stack/todo-mysql.yml todo_mysql`

7. Init container data (In my case 'worker01' is Master of MySQL)

   1. `$ docker exec -it [containerName] sh`

      * **Before do commad check the container is Master of MySQL**

        > How to check
        >
        > 1. `docker exec -it [containerName] docker ps`
        > 2. If the container is Mater of MySQL, you can see `todo_mysql_master.1....`

   2. `$ docker exec -it $(docker ps -q) init-data.sh`



#### 3.Nginx

1. Go to directory : todo/todongninx

2. Build api image

   > `$ docker build -t localhost:5000/ch04/nginx`

3. Push Image

   > `docker push localhost:5000/ch04/nginx`

   

#### 4.API

1. Go to directory : toto/todoapi

2. Build api image

   > `$ docker image build -t localhost:5000/ch04/todoapi:latest .`

3. Push image

   > `$ docker image push localhost:5000/ch04/todoapi:latest`

4. Deploy

   > `$ docker container exec -it manager docker stack deploy -c /stack/todo-app.yml todo_app`

5. Check

   * Go to container which have 'todo_app' and do command

     > Get, Post, Put test
     >
     > ```shell
     > $ curl -XGET http://localhost:8080/todo?status=TODO
     > $ curl -XPOST -d '{"title":"Test1","content":"Test Content1"}' http://localhost:8080/todo
     > $ curl -XPUT -d '{"id":9, "title":"Test modified", "content":"Test Content modified", "status":"DONE"}' http://localhost:8080/todo
     > ```

     > Port Check
     >
     > ```shell
     > $ apt-get update
     > $ apt-get install -y net-tools
     > $ netstat -ntpl
     > ```





---

#### Visualizer

>`$ docker stack deploy -c /stack/visualizer.yml visualizer`





```
docker container exsec -it manager \
docker service ps todo_mysql_master \
--no-trunc \
--filter "desired-state=running" \
--format "docker container exec -it{{.Node}} docker container exec -it {{.Name}}.{{.ID}} bash"
```

```
docker container exsec -it manager `
docker service ps todo_mysql_master `
--no-trunc `
--filter "desired-state=running" `
--format "docker container exec -it{{.Node}} docker container exec -it {{.Name}}.{{.ID}} bash"
```



위의 커맨드 실행시켜 나온 명령어를 powershell에 입력하면 바로 db접속 가능







#### 요구사항

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



## Nginx 구축

* 클라이언트 요청 -> (8000) Nginx  rexerve proxi (8080) Backend Web service
* 이점
  * 접근 로그 생성 (단일 접근)
  * 캐시 제어
  * 라우팅 설정



## API 서비스 구축

* TODO 앱의 도메인 담당
* Go 언어로 구현
  * cmd/main.go 실행
    * MySQL접속에 필요한 환경 변수 값 얻어오기
    * HTTP요청 핸들러 생성 및 앤드포인트 등록, 서버 실행
  * env.go
    * 환경 변수 값을 받아 오는 코드
  * db.go
    * MySQL접속 및 테이블 매핑
  * handler.go
    * 핸들러
    * TODO API의 요청처리 -> TodoHandelr
      * serveGET -> `$ curl -s -XGET http://localhost:8080/todo?status=PROGRESS`
      * servePOST -> `$ curl -XPOST -d '{ "title": "4장 집필하기", "content":"내용 검토 중}' http://localhost:8000/todo `
      * servePUT -> `$ curl -XPUT -d '{"id:":1,"title":"4장 집필하기","content":"도커를 이용한 실전적 웹 어플개발","status":"PROGRESS"}' http://localhost:8080/todo`





---

> ```shell
> $ docker-compose up 
> $ docker ps (registry, manager, worker01, worker02, worker03)
> $ docker exec -it manager sh
> 	(M) $ docker swarm init  (-> join token 생성 됨)
> $ docker exec -it worker01 sh  (worker02, worker03에서도 실행)
> 	(W1) $ docker swarm join (with join token) 
> $ docker exec -t manager sh	
> 	(M) $ docker node ls (worker01~worker03, manager 확인)
> 	(M)	$ docker network create --driver=overlay --attachable todoapp
> 	(M) $ docker stack deploy -c /stack/visualizer.yml visualizer
> 	(M) $ docker stack deploy -c /stack/todo-mysql.yml todo_mysql
> $ docker exec -it worker01 (or worker02, worker03) sh -> MASTER DB 접속
> 	ex, W1) $ docker exec -it [MASTER DB Container] bash
> 	ex, W1, Master Container) $ init-data.sh 
> 	ex, W1, Master Container) $ mysql -uroot -p tododb
> 	ex, W1, Master Container) mysql> select * from todo;
> $ docker push localhost:5000/ch04/todoapi:latest 	
> ```
>
> 