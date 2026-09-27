// Local dev only: spins up an in-memory MongoDB on a fixed port so the backend
// can run without a system mongod. Not committed to any workflow — just a
// convenience for `node scripts/dev-mongo.cjs` while developing.
const { MongoMemoryServer } = require("mongodb-memory-server");

(async () => {
  const mongod = await MongoMemoryServer.create({
    instance: { port: 27017, dbName: "glimpsehub" },
  });
  console.log("[dev-mongo] listening at", mongod.getUri());
  const shutdown = async () => {
    await mongod.stop();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
})();
