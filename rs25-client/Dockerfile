FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ARG BUG_REPORT_EMAIL
ENV BUG_REPORT_EMAIL=$BUG_REPORT_EMAIL
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
