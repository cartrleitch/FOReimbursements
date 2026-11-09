FROM node:22-alpine as build
WORKDIR /app
COPY package*.json ./
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
ARG VITE_BUG_REPORT_EMAIL
ENV VITE_BUG_REPORT_EMAIL=$VITE_BUG_REPORT_EMAIL
ARG VITE_REIMBURSEMENT_REPORT_EMAIL
ENV VITE_REIMBURSEMENT_REPORT_EMAIL=$VITE_REIMBURSEMENT_REPORT_EMAIL
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
