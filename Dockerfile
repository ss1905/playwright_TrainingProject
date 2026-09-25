FROM mcr.microsoft.com/playwright:v1.62.1-noble

WORKDIR /app

COPY . .

RUN npm ci

CMD ["npx", "playwright", "test"]