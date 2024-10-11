FROM python:3.11.3-slim-buster

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
WORKDIR /src

# install dependencies
RUN pip install --upgrade pip
COPY requirements.txt /src/requirements.txt
RUN pip install -r requirements.txt

# copy project
#COPY ./app /src

#CMD ["flask", "run", "--host=0.0.0.0", "server.py"]

