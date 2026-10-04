FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN mkdir -p temp
ENV NODE_ENV=production
EXPOSE 9000
CMD ["node", "index.js"]
