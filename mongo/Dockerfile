FROM mongo

RUN mkdir /usr/src/configs
WORKDIR /usr/src/configs
COPY replicaSet.js .
# COPY setup.sh .

CMD ["mongo", "mongodb://mongo1:27017", "./replicaSet.js"]