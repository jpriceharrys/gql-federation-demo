# GraphQL Federation Demo

This demo has been written to show a very simple example how we could use Apollo Federation at Harry's.

This isn't a production-ready codebase and maybe corners have been cut to make it as simple to understand as possible.

## Prerequisite tools

The package runs on NodeJS v18. You will also need a package manager like `npm` or `yarn` installed.

To run this demo locally you will need to install 2 tools.

**Apollo Router** - the gateway that you will use from clients to query your supergraph. To install this, follow the instructions here: https://www.apollographql.com/docs/router/quickstart/

**Rover (optional)** - used to combine subschemas into a single superschema. The combined schema has already been created in the `./schema` directory so you only need to do this if you want to make changes to the superschema. Follow the instructions at this URL: https://www.apollographql.com/docs/rover/getting-started/

---

## Running the demo

Clone this repository to a local directory

```bash
git clone git@github.com:jpriceharrys/gql-federation-demo.git ./
```

`cd` into the newly created directory and install the project dependencies

```bash
cd ./gql-deferation-demo
npm install
```

Start up the Product service and the Review service concurrently using an npm script. The product service will be running at

```bash
npm start
```

Now you need to boot up Apollo Router

```bash
npm run router
```

This will run at `http://127.0.0.1:4000/`. Open in your browser and you should be able to run GraphQL. Try this query as a test

```graphql
query ProductsWithReviews {
  products {
    id
    name
    overallRating
    reviews {
      rating
    }
  }
}
```

## Making changes to the superschema

If you want to test out making changes to the schema, make sure you have the **Rover** CLI tool installed (see above). Shut down your router service (but make sure to keep the services running - these are used to generate the superschema!)

```bash
npm run gen:schema
```

As long as you get no errors, this schema will be used when you next boot up the router
