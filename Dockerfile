FROM node:10
RUN mkdir -p /usr/src/backend/
WORKDIR /usr/src/backend/
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json /usr/src/backend/

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
COPY . .
RUN npm install
# do not forget to add it back
#RUN npm run deploy
EXPOSE 4444
#CMD [ "npm", "run", "start" ]
CMD [ "npm", "run", "dev" ]

####The line below was used to create the container
####docker build -t stephane/docker-ecom-backend .
###docker run -p 4444:4444 -d stephane/docker-ecom-backend
