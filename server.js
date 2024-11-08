const express = require("express"),
  port = 5000;

const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: ["http://localhost:8080"],
  credential: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const downloadRoutes = require("./server/api/youtube");
app.use("/youtube", downloadRoutes);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})
