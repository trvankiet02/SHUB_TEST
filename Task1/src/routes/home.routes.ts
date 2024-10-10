import { Router } from "express";
import {
  welcome,
  uploadFile,
  getTransactions,
} from "../controllers/home.controller";
import {
  validateUpload,
  validateTransactionQuery,
} from "../middlewares/homeMiddleware";

class HomeRoutes {
  router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get("/", welcome);
    this.router.post("/upload", uploadFile);
    this.router.get("/transactions", getTransactions);
  }
}

export default new HomeRoutes().router;
