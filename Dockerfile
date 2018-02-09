FROM daocloud.io/library/node:8.4.0-onbuild

# Create app directory
RUN mkdir -p /home/Service
WORKDIR /home/Service

# Bundle app source
COPY . /home/Service
RUN npm install --registry=https://registry.npm.taobao.org

EXPOSE 3000
CMD [ "npm", "start" ]
