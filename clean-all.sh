#docker image rm -f mariadb nginx object-3d-editor-backend
docker container stop nginx_web
docker container stop backend_flask
docker container stop mysql-db8
docker container stop mysql-db

docker compose down --volumes
docker volume rm object-3d-editor_mysql_data
docker image rm -f docker_fullstack_web_env1-web docker_fullstack_web_env1-client docker_fullstack_web_env1-backend docker_fullstack_web_env1-db mysql
docker container prune -f
docker builder prune
 