## Mongo



**This is for MongoDB on Docker (Replica test) and how to share volume**



#### How to build

>1. Make image from Dockerfile
>   * `$ docker build -t hkm0629/mongo_repl_setup .`
>2. compose up
>   * `$ docker-compose up`
>3. go to container and do replica
>   * `$ docker exec -it mongo1 mogo rs.initate()`
>   * `$ docker exec -it mongo1 mogo rs.add([mongo2 contianerIP])`
>   * `$ docker exec -it mongo1 mogo rs.add([mongo3 contianerIP])`



#### How to Check

>1. go to Master container
>
>   * `$ docker exec -it mongo1 mongo use bookstore`
>   * `$ docker exec -it mongo1 mongo db.books.insert({title: "Oliver Twist"})`
>   * `$ docker exec -it mongo1 mongo show dbs`
>
>2. check Slave container 
>
>   * `$ docker exec -it mongo2 mongo rs.slaveOk()`
>   * `$ docker exec -it mongo1 mongo show dbs`
>   * `$ docker exec -it mongo1 mongo db.books.find()`
>
>3. Stop master container
>
>   * `$ docker stop mongo1`
>
>4. Go to slave and check it is master now
>
>   * `$ docker exec -it mongo2 mongo db.isMaster()`
>
>     or
>
>   * `$ docker exec -it mongo3 mongo db.isMaster()`