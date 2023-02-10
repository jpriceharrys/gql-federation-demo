import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import gql from "graphql-tag";
import { buildSubgraphSchema } from "@apollo/subgraph";

const reviews = [
  {
    id: "rev-1",
    rating: 5,
    product: "prod-truman",
  },
  {
    id: "rev-2",
    rating: 3,
    product: "prod-truman",
  },
  {
    id: "rev-3",
    rating: 3,
    product: "prod-blades",
  },
  {
    id: "rev-4",
    rating: 1,
    product: "prod-blades",
  },
  {
    id: "rev-5",
    rating: 5,
    product: "prod-redwood-shower",
  },
];

const typeDefs = gql`
  extend type Product @key(fields: "id") {
    id: ID! @external
    reviews: [Review]
    overallRating: Float!
  }

  type Review {
    id: ID!
    rating: Int!
    product: Product!
  }

  type Query {
    reviews: [Review]
    review(id: ID!): Review
  }

  type Mutation {
    submitReview(input: ProductReviewInput): SubmitReviewResponse
  }
  input ProductReviewInput {
    productId: String!
    rating: Int!
  }
  type SubmitReviewResponse {
    review: Review
  }
`;

const resolvers = {
  Product: {
    reviews(product) {
      return reviews.filter((review) => review.product === product.id);
    },
    overallRating(product) {
      const allReviews = reviews.filter(
        (review) => review.product === product.id
      );
      return allReviews.length
        ? allReviews.reduce((acc, review) => acc + review.rating, 0) /
            allReviews.length
        : 0;
    },
  },
  Review: {
    product(review) {
      // return a product representation
      return { __typename: "Product", id: review.product };
    },
  },
  Query: {
    reviews: () => reviews,
    review(_, args) {
      return reviews.find((review) => review.id === args.id);
    },
  },
  Mutation: {
    submitReview: (_, { input }) => {
      const newReview = {
        id: `rev-${reviews.length + 1}`,
        rating: input.rating,
        product: input.productId,
      };
      reviews.push(newReview);
      return { review: newReview };
    },
  },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});
const { url } = await startStandaloneServer(server, { listen: { port: 4002 } });
console.log(`Review service listening at: ${url}`);
