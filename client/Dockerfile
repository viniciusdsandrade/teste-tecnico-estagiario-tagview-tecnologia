FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL="http://localhost:3000"
ENV NODE_ENV=production
RUN npm run build

FROM nginx:1.27-alpine

COPY ./deploy/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://localhost/ >/dev/null 2>&1 || exit 1
CMD ["nginx", "-g", "daemon off;"]
