import express from "express";
import routes from "./routes/index";
import morgan from "morgan";
import connectDB from "./db";
import { saveDataCronJob } from "./cronJobs";
import cors from "cors";

const app = express();
connectDB();
saveDataCronJob();

app.use(cors({ origin: "https://digi-challenge.vercel.app/" })); //http://localhost:3000

app.use(morgan("dev"));
app.use(express.json());
app.use("/api", routes);

const PORT = 3001;
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export { app, server };
