# #docker image rm -f mariadb nginx object-3d-editor-backend
# docker container stop nginx_web
# docker container stop backend-flask
# docker container stop mysql8-db
# docker container stop client_react
# docker image rm -f docker_fullstack_web_env1-web docker_fullstack_web_env1-client docker_fullstack_web_env1-backend docker_fullstack_web_env1-db mysql
 

# docker compose up  --remove-orphans

# !/bin/bash

# Stop and remove the React container if it exists
docker container stop client_react || true
docker image rm -f docker_fullstack_web_env1-client || true

# Run only the React client service
docker compose up client --remove-orphans


