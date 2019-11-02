const { ApolloServer } = require('apollo-server');
const { importSchema } = require('graphql-import');
const { makeExecutableSchema } = require('graphql-tools');
const isEmail = require('isemail');
const path = require('path');

const { createStore } = require('./utils');
const resolvers = require('./resolvers');
const typeDefs = importSchema(
  path.join(__dirname, '../../graphql/schema.graphql')
);
const LaunchAPI = require('./datasources/launch');
const UserAPI = require('./datasources/user');

const schema = makeExecutableSchema({
  resolvers,
  typeDefs
});
const store = createStore();

const server = new ApolloServer({
  schema,
  // リクエストオブジェクトが呼び出される関数
  // このリクエストオブジェクトから認証用のヘッダーを取得する
  context: async ({ req }) => {
    const auth = (req.headers && req.headers.authorization) || '';
    const email = Buffer.from(auth, 'base64').toString('ascii');
    if (!isEmail.validate(email)) return { user: null };

    const users = await store.users.findOrCreate({ where: { email } });
    const user = (users && users[0]) || null;

    return { user: { ...user.dataValues } };
  },
  dataSources: () => ({
    launchAPI: new LaunchAPI(),
    userAPI: new UserAPI({ store })
  })
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
