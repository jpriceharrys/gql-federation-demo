import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import gql from "graphql-tag";
import { buildSubgraphSchema } from "@apollo/subgraph";

const products = [
  {
    id: "prod-truman",
    name: "Truman",
  },
  {
    id: "prod-winston",
    name: "Winston",
  },
  {
    id: "prod-blades",
    name: "8 Blades",
  },
  {
    id: "prod-redwood-shower",
    name: "Redwood Shower Gel",
  },
];

const typeDefs = gql`
  type Product @key(fields: "id") {
    id: ID!
    name: String!
  }

  type Query {
    products: [Product]
    product(id: ID!): Product
  }
`;

const resolvers = {
  Product: {
    __resolveReference(object) {
      return products.find((product) => product.id === object.id);
    },
  },
  Query: {
    products: () => products,
    product(_, args) {
      return products.find((product) => product.id === args.id);
    },
  },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});
const { url } = await startStandaloneServer(server, { listen: { port: 4001 } });
console.log(`Product service listening at: ${url}`);
