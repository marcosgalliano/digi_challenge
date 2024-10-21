import express from "express";
import routes from "./routes/index";
import connectDB from "./db";
import { saveDataCronJob } from "./cronJobs";

const app = express();
connectDB();
saveDataCronJob();

app.use(express.json());
app.use("/api", routes);

const PORT = 3001;
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export { app, server };
