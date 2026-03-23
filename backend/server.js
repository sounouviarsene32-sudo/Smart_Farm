import app from "./app.js";
import  connectDb  from "./src/config/db.js";

const PORT = process.env.PORT ?? 6000;

await connectDb();

app.listen(PORT, () => {
  console.log(`API: http://localhost:${PORT}`);
});