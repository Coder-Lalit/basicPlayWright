FROM mcr.microsoft.com/playwright:v1.63.0-jammy

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx playwright install --with-deps

CMD ["sh", "-lc", "PORT=4200 npm run dev:app & npx playwright test --project=chromium --reporter=list,html"]
