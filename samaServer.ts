import "./src/config/configuration";

import settings from "./src/config/settings";

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path from "path";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { error } from "./src/middlewares/error";
import db from "./src/modules";

import authRouter from "./src/routers/auth";
import categoryRouter from "./src/routers/categories";
import clientRouter from "./src/routers/clients";
import employeeRouter from "./src/routers/employees";
import governorateRouter from "./src/routers/governorates";
import personRouter from "./src/routers/persons";
import ownerRouter from "./src/routers/owners";
import propertyFeaturesRouter from "./src/routers/propertyFeatures";
import propertyRouter from "./src/routers/properties";
import RoleRouter from "./src/routers/roles";

const globalLimiter = rateLimit({
  windowMs: settings.maxRequestTime,
  max: settings.maxRequestNumberPerTime,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
});

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
    contentSecurityPolicy:
      settings.nodeEnvironment === "production"
        ? undefined
        : false,
  }),
);

app.disable("x-powered-by");

app.use(
  cors({
    origin: [settings.frontendURL],
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
    ],
    credentials: true,
  }),
);

app.use(globalLimiter);

app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));

app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "10mb",
  }),
);

app.use(
  "/uploads",
  (_, res, next) => {
    res.setHeader(
      "X-Content-Type-Options",
      "nosniff",
    );

    res.setHeader(
      "Content-Disposition",
      "inline",
    );

    next();
  },
  express.static(
    path.join(process.cwd(), "uploads"),
  ),
);

app.use("/api/v0/auth", authRouter);
app.use("/api/v0/categories", categoryRouter);
app.use("/api/v0/clients", clientRouter);
app.use("/api/v0/employees", employeeRouter);
app.use("/api/v0/governorates", governorateRouter);
app.use("/api/v0/owners", ownerRouter);
app.use("/api/v0/properties", propertyRouter);
app.use("/api/v0/persons", personRouter);
app.use(
  "/api/v0/property-features",
  propertyFeaturesRouter,
);
app.use("/api/v0/roles", RoleRouter);

app.use(error);

const startServer = async () => {
  try {
    await db.sequelize?.authenticate();

    const port = Number(
      settings.port ||
      5010,
    );

    app.listen(port, "0.0.0.0", () => {
      console.log(
        `Server is running on port ${port}`,
      );
    });
  } catch (err) {
    console.error(
      "Failed to start server:",
      err,
    );

    process.exit(1);
  }
};

startServer();