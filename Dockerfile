FROM mcr.microsoft.com/playwright:v1.62.1-noble

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN rm -rf test-results playwright-report

CMD ["npx", "playwright", "test"]