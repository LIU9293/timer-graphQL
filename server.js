import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphql';
import { rootSchema } from './server/schema';
import { getUser } from './server/objects';

// Construct a schema, using GraphQL schema language
const schema = buildSchema(rootSchema);

// The root provides a resolver function for each API endpoint
const rootValue = {
  getUser: ({UserID}) => getUser(UserID)
};

const app = express();

// Helmet helps you secure your Express apps by setting various HTTP headers
// https://github.com/helmetjs/helmet
app.use(helmet());

// Enable CORS with various options
// https://github.com/expressjs/cors
app.use(cors());

// Request logger
// https://github.com/expressjs/morgan
app.use(morgan('combined'));

// Parse incoming request bodies
// https://github.com/expressjs/body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Lets you use HTTP verbs such as PUT or DELETE
// https://github.com/expressjs/method-override
app.use(methodOverride());

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue,
  graphiql: true,
}));

app.listen(3000);

console.log('Running a GraphQL API server at localhost:3000/graphql');
