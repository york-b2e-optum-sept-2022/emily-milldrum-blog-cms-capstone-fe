FROM node:latest as build
COPY ./ /build
WORKDIR /build

RUN npm install
RUN npm run build


FROM nginx:latest
COPY --from=build /build/dist/emily-milldrum-blog-cms-capstone-fe/ /usr/share/nginx/html/
