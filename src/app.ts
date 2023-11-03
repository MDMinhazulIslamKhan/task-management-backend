import express, { Application, Request, Response } from "express";
import cors from "cors";

const app: Application = express();

app.use(cors());

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Testing
app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to Task management application.",
  });
});

// No routes
app.use((req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    message: "Not found",
    errorMessage: {
      path: req.originalUrl,
      message: "Api not found!!! Wrong url, there is no route in this url.",
    },
  });
});

export default app;
