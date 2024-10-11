FROM mysql:latest

COPY init.sql /docker-entrypoint-initdb.d/init.sql
RUN chown -R mysql:mysql /var/lib/mysql


EXPOSE 3306