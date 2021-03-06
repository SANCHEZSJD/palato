import 'reflect-metadata'
import { importSchema } from 'graphql-import'
import { GraphQLServer } from 'graphql-yoga'
import { createConnection } from 'typeorm'
import * as path from 'path'
import * as fs from 'fs'
import { mergeSchemas, makeExecutableSchema } from 'graphql-tools'
import { GraphQLSchema } from 'graphql';

const startServer = async () => {   
    const schemas: GraphQLSchema[] = [];
    
    const folders = fs.readdirSync(path.join(__dirname, './modules'))
    
    folders.forEach((folder) => {
        const { resolvers } = require(`./modules/${folder}/resolvers`)
        const typeDefs = importSchema(path.join(__dirname, `./modules/${folder}/schema.graphql`))
        schemas.push(makeExecutableSchema({ resolvers, typeDefs }));
    });

    const server = new GraphQLServer({ schema: mergeSchemas({ schemas }) })
    await createConnection()
    await server.start()
    console.log('Server is running on localhost:4000')
}

startServer()


