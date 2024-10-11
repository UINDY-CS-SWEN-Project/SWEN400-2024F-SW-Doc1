# Web: ReactJS + Nginx + Flask + MySQL
A docker container environment for ReactJS, Nginx, Flask, and MySQL

## Docker environment
Backend: Flask 
Backend-Storage: MySQL
Proxy: Nginx
Frontend: ReactJS

Project structure:
```
.
├── clean-all.sh
├── clean-start.sh
├── compose.yaml
├── flask
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app
|       └── server.py
├── nginx
│   ├── nginx.conf
│   ├── index.html
│   └── Dockerfile
├── mysql
│   ├── Dockerfile
│   └── init.sql
│ 
└── react
    ├── client-app (app folder)
    ├── package.json
    └── Dockerfile
```

The compose file defines an application with three services `web`, `backend` and `db`.
When deploying the application, docker compose maps port 80 of the web service container to port 80 of the host as specified in the file.
Make sure port 80 on the host is not being used by another container, otherwise the port should be changed.

## Deploy with docker compose

```
$ docker compose up -d
Creating network "nginx-flask-mongo_default" with the default driver
Pulling mongo (mongo:)...
latest: Pulling from library/mongo
423ae2b273f4: Pull complete
...
...
Status: Downloaded newer image for nginx:latest
Creating nginx-flask-mongo_mongo_1 ... done
Creating nginx-flask-mongo_backend_1 ... done
Creating nginx-flask-mongo_web_1     ... done

```

## Expected result

Listing containers must show three containers running and the port mapping as below:
```

```

After the application starts, navigate to `http://localhost:8080` in your web browser or run:
```

```

Stop and remove the containers
```

```