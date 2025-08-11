FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run nx build api-users

FROM node:20-alpine
WORKDIR /srv
ENV NODE_ENV=production
COPY --from=build /app/dist/apps/api-users ./dist
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
EXPOSE 3001
CMD ["node", "dist/main.js"]