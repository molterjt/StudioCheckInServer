
const { prisma } = require('./generated/prisma-client');
const { GraphQLServer } = require('graphql-yoga');
const resolvers = require('./resolvers');
const { permissions } = require('./permissions')



const server = new GraphQLServer({
    typeDefs: './schema.graphql',
    resolvers,
    // middlewares: [permissions],
    context: request => {
        return {
            ...request,
            prisma,
        }
    },
});


server.start( () => console.log('server is running on http://localhost:4000'));

