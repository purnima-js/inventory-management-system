import connectDB from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config({
  path:"./.env"
})

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server running on port ${process.env.PORT || 8000 }`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to DB", error);
  });
