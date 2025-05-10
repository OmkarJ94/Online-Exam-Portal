FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

RUN chmod +x wait-for-it.sh

CMD ["npm", "run", "dev"]
