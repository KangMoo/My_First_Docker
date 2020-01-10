## Swarm



**This is for swarm setting and testing**



#### How to build

>1. compose up
>   * `$ docker-compose up`
>2. init swarm
>   * `$ docker sarm init`
>3. stack deploy from `my-api.yml` file
>   * `$ docker exec -it manager docker stack deploy -c /stack/my-webapi.yml echo`
>4. stack deploy ingress for HAProxy
>   * `$ docker exec -it manager docker stack deploy -c /stack/03-ingress.yml ingress`
>5. stack deploy for visual check
>   * `$ docker exec -it manager docker stack deploy -c /stack/visualizer.yml visualizer`



#### How to Check

>1. Open web browser
>2. go to url : http://localhost:9000/
>3. go to url : http://localhost:8000/

