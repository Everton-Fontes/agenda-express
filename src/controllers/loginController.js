const LoginModel = require("../models/LoginModel");

exports.index = async (req, res) => {
  if (req.session.user) {
    req.flash("errors", "Você já esta logado!");
    req.session.save(() => {
      res.redirect("/");
    });
    return;
  }

  res.render("login", {
    title: "Login | Signup",
  });
  return;
};

exports.login = async (req, res) => {
  try {
    const login = new LoginModel(req.body);
    await login.login();

    if (login.errors.length > 0) {
      req.flash("errors", login.errors);
      req.session.save(() => {
        res.redirect("/login");
      });
      return;
    }

    req.flash("success", "Login realizado com sucesso!");

    req.session.user = login.user;

    req.session.save(() => {
      res.redirect("/");
    });
  } catch (e) {
    console.log(e);
    return res.render("404", {
      title: "Página Não Existe",
    });
  }
  return;
};

exports.register = async (req, res) => {
  try {
    const login = new LoginModel(req.body);
    await login.register();

    if (login.errors.length > 0) {
      req.flash("errors", login.errors);
      req.session.save(() => {
        res.redirect("/login");
      });
      return;
    }

    req.flash("success", "Cadastrado com sucesso!");
    req.session.save(() => {
      res.redirect("/login");
    });
  } catch (e) {
    console.log(e);
    return res.render("404", {
      title: "Página Não Existe",
    });
  }
};

exports.logout = async (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};
