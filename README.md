[![Codacy Badge](https://app.codacy.com/project/badge/Grade/f395d979637144eb85dec003a3346aaf)](https://www.codacy.com/gh/Knawat/knawat-moleculer-template?utm_source=github.com&utm_medium=referral&utm_content=Knawat/knawat-moleculer-template&utm_campaign=Badge_Grade)

# Moleculer TypeScript Example App

Built from [Knawat Moleculer Template](https://github.com/Knawat/knawat-moleculer-template)

It's a microservice Node.js application, It's demonstrate how to run a simple App with two serivces (api, products) buit on [Moleculer Microservices Framework](https://moleculer.services/)

## Usage

Start the project with `npm run dev` command.
After starting, try to request the products service

`curl --location --request GET 'http://localhost:3000/api/products/list'`

It will return "products.list"

## Use the docker image

There is a docker image for this project Docker Hub you can find it on this [URL](https://hub.docker.com/r/mhm0ud/moleculer)

To run this image run the following command:

`docker run -d -p 8080:3000 --env SERVICEDIR=build/services mhm0ud/moleculer`

After starting, try to request the products service

`curl --location --request GET 'http://localhost:8080/api/products/list'`

It will return "products.list"

## Services

- **api**: API Gateway service
- **products**: Sample service with `list`, `update` and `get` actions.
