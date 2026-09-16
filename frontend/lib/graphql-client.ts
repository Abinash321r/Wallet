import { GraphQLClient } from 'graphql-request';

const API_URL = process.env.NEXT_PUBLIC_API_URL;


export const gqlClient = new GraphQLClient( `${API_URL}/graphql`, {
  credentials: 'include', 
});
