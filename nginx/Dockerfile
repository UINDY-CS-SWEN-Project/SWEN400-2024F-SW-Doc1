# 2. Nginx
FROM ubuntu:latest

RUN apt-get update
RUN apt-get install nginx -y

# for debugging editing purpose
RUN apt-get install vim -y
WORKDIR /var/www/html

# Copy config nginx
RUN rm /etc/nginx/sites-enabled/default
RUN mkdir /var/www/html/shtml
COPY nginx.conf /etc/nginx/sites-enabled/default.conf
COPY shtml/index.html /var/www/html
COPY shtml/index.html /var/www/html/shtml


RUN apt-get install curl -y

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]