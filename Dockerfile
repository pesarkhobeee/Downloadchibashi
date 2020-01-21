From python:2.7
MAINTAINER Farid Ahmadian "pesarkhobeee@gmail.com"
RUN apt-get update -y && \
    apt-get install -y python-pip python-dev python-mysqldb cron

WORKDIR /app
COPY . /app
RUN pip install -r requirements.txt

COPY crontab /etc/cron.d/downloadchibashi
RUN chmod 0644 /etc/cron.d/downloadchibashi
RUN service cron start


ENTRYPOINT [ "gunicorn" ]
CMD [ "-w", "4", "-b", "0.0.0.0:8080", "downloadchibashi:app" ]
