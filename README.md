[![Codacy Badge](https://app.codacy.com/project/badge/Grade/f395d979637144eb85dec003a3346aaf)](https://www.codacy.com/gh/Knawat/knawat-moleculer-template?utm_source=github.com&utm_medium=referral&utm_content=Knawat/knawat-moleculer-template&utm_campaign=Badge_Grade)

# Moleculer TypeScript Template by Knawat

We built our own template in Knawat and decided to share it with community as a full featured Moleculer TypeScript template:

- One command to run, build and hot reloaded using tsc-watch
- Using Shopify Eslint plugin
- OpenAPI Example ready
- Using Mongoose
- Deployment template files for Docker, AppEngine and more later

## Usage

Start the project with `npm run dev` command.
After starting, open the http://localhost:3000/ URL in your browser.
On the welcome page you can test the generated services via API Gateway and check the nodes & services.

In the terminal, try the following commands:

- `nodes` - List all connected nodes.
- `actions` - List all registered service actions.
- `call greeter.hello` - Call the `greeter.hello` action.
- `call greeter.welcome --name John` - Call the `greeter.welcome` action with the `name` parameter.
- `call products.list` - List the products (call the `products.list` action).

## Services

- **api**: API Gateway services
- **greeter**: Sample service with `hello` and `welcome` actions.
- **products**: Sample DB service. To use with MongoDB, set `MONGO_URI` environment variables and install MongoDB adapter with `npm i moleculer-db-adapter-mongo`.

## Mixins

- **db.mixin**: Database access mixin for services. Based on [moleculer-db](https://github.com/moleculerjs/moleculer-db#readme)

## Useful links

- Moleculer website: https://moleculer.services/
- Moleculer Documentation: https://moleculer.services/docs/0.14/

## NPM scripts

- `npm run dev`: Start development mode (load all services locally with hot-reload & REPL).
- `npm run start`: Start production mode (set `SERVICES` env variable to load certain services).
- `npm run cli`: Start a CLI and connect to production. Don't forget to set production namespace with `--ns` argument in script
- `npm run lint`: Run ESLint
- `npm run ci`: Run continuous test mode with watching
- `npm test`: Run tests & generate coverage report

## K8S SETUP

## CREATE CLUSTER

- `gcloud config set project mahmoud-test-gke`: To set the project name
- `gcloud config set compute/zone us-central1-c`: To set the zone
- `gcloud container clusters create sea-dev`: To create a cluster

## CREATE PUBLIC IP

- `gcloud compute addresses create sea-dev-ip --global`: To get a global ip address

## DEPLOY THE APP

- `gcloud builds submit --config=cloudbuild.yaml \`
  ` --substitutions=_PROJECT_IMAGE=$PROJECT_IMAGE,_SECRET_NAME=$SECRET_NAME,_DEPLOY_FOLDER=$DEPLOY_FOLDER,``_ENV_NAME=$ENV_NAME,_PROJECT_LOCATION=$PROJECT_LOCATION,_CLUSTER_NAME=$CLUSTER_NAME,``_BUDDY_EXECUTION_REVISION=$BUDDY_EXECUTION_REVISION . `

## CERTIFICATE MANAGEMENT

- `kubectl describe managedcertificate sea-dev-mhm`: see if the certificate activated or not yet (it takes some time, around 15 mins)
