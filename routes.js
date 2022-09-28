const express = require("express");
const route = express.Router();
const homeController = require("./src/controllers/homeController");
const loginController = require("./src/controllers/loginController");
const contatoController = require("./src/controllers/contatoController");
const { autheticateMiddleware } = require("./src/middlewares/middleware");

// Rotas da home
route.get("/", autheticateMiddleware, homeController.index);

// Rotas de Login
route.get("/login", loginController.index);
route.post("/login", loginController.login);
route.post("/login/register", loginController.register);
route.get("/login/logout", loginController.logout);

// Rotas de Login
route.get("/contatos", autheticateMiddleware, contatoController.index);
route.get("/contatos/list", autheticateMiddleware, contatoController.list);
route.post("/contatos/add", autheticateMiddleware, contatoController.add);
route.post("/contatos/edit/:id", autheticateMiddleware, contatoController.edit);
route.get(
  "/contatos/detail/:id",
  autheticateMiddleware,
  contatoController.detail
);
route.post(
  "/contatos/delete/:id",
  autheticateMiddleware,
  contatoController.delete
);

module.exports = route;
