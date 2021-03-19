FROM node 

WORKDIR /bot

COPY source ./source
COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./

RUN yarn install
RUN yarn build

CMD ["yarn", "bot"]