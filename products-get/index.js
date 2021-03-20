const MongoClient = require("mongodb").MongoClient;
const { format } = require("date-fns");
const auth = {
  user: process.env.user,
  password: process.env.password,
};
const loadDB = async () => {
  const client = await MongoClient.connect(
    `mongodb://${process.env.url}:${process.env.port}/?ssl=true`,
    {
      auth: auth,
    }
  );
  return client.db("serverless");
};
module.exports = async function (context, req) {
  try {
    const database = await loadDB();
    let products = await database.collection("Product").find().toArray();

    // Format the dates
    products.forEach((product) => {
      product.expires = format(new Date(product.expires), "yyyy-MM-dd");
    });

    context.res.status(200).json(products);
  } catch (error) {
    context.res.status(500).send(error);
  }
};
