const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    launches(
      """
      表示する結果の数（1以上）、デフォルトは20
      """
      pageSize: Int
      """
      カーソル（データリスト内にある特定のアイテムにマークを付けたトークン）
      カーソルを指定した場合、そのカーソルを起点として、pageSize で指定した数のデータを返す
      """
      after: String
    ): LaunchConnection!
    launch(id: ID!): Launch
    me: User
  }

  type LaunchConnection {
    cursor: String!
    hasMore: Boolean!
    launches: [Launch]!
  }

  type Mutation {
    bookTrips(launchIds: [ID]!): TripUpdateResponse!

    cancelTrip(launchId: ID!): TripUpdateResponse!

    login(email: String): String
  }

  type TripUpdateResponse {
    success: Boolean!
    message: String
    launches: [Launch]
  }

  type Launch {
    id: ID!
    site: String
    mission: Mission
    rocket: Rocket
    isBooked: Boolean!
  }

  type Rocket {
    id: ID!
    name: String
    type: String
  }

  type User {
    id: ID!
    email: String!
    trips: [Launch]!
  }

  type Mission {
    name: String
    # String型の mission と PatchSize型の size を受け取り String型を返す
    missionPatch(mission: String, size: PatchSize): String
  }

  enum PatchSize {
    SMALL
    LARGE
  }
`;

module.exports = typeDefs;
