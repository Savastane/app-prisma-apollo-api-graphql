const { ApolloServer, gql } = require('apollo-server-express');
const { PrismaClient } = require('@prisma/client');
const express = require('express');
require('dotenv').config();

const prisma = new PrismaClient();
const app = express();

const typeDefs = gql`
  // Cole o conteúdo do arquivo schema.graphql aqui
`;

const resolvers = {
  Query: {
    usuarios: async () => {
      return prisma.usuario.findMany();
    },
    tarefas: async () => {
      return prisma.tarefa.findMany();
    },
  },
  Mutation: {
    criarUsuario: async (_, { nome, email }) => {
      return prisma.usuario.create({
        data: {
          nome,
          email,
        },
      });
    },
    criarTarefa: async (_, { titulo, descricao, concluida, usuarioId }) => {
      return prisma.tarefa.create({
        data: {
          titulo,
          descricao,
          concluida,
          usuario: {
            connect: { id: parseInt(usuarioId) },
          },
        },
      });
    },
  },
  Usuario: {
    tarefas: async (parent) => {
      return prisma.tarefa.findMany({
        where: {
          usuarioId: parent.id,
        },
      });
    },
  },
  Tarefa: {
    usuario: async (parent) => {
      return prisma.usuario.findUnique({
        where: {
          id: parent.usuarioId,
        },
      });
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app });

const PORT = 4000;

app.listen({ port: PORT }, () =>
  console.log(`Servidor Apollo pronto em http://localhost:${PORT}${server.graphqlPath}`)
);
