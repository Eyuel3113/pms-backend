import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;
console.log("DATABASE_URL:", process.env.DATABASE_URL);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
