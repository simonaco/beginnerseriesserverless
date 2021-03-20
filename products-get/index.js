const MongoClient = require("mongodb").MongoClient;
const { format } = require("date-fns");
const auth = {
  user: process.env.user,
  password: process.env.password,
};
let db = null;
const loadDB = async () => {
  if (db) {
    return db;
  }
  const client = await MongoClient.connect(
    `mongodb://${process.env.url}:${process.env.port}/?ssl=true`,
    {
      auth: auth,
    }
  );
  db = client.db("serverless");
  return db;
};
module.exports = async function (context, req) {
  try {
    //const products = data.getProducts();
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
