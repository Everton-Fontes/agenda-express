exports.middlewareGlobal = (req, res, next) => {
  res.locals.errors = req.flash("errors");
  res.locals.success = req.flash("success");
  res.locals.user = req.session.user ? req.session.user : null;
  next();
};

exports.autheticateMiddleware = (req, res, next) => {
  if (!req.session.user) {
    req.flash("errors", "Você precisa estar logado para acessar esta página");
    req.session.save(() => {
      res.redirect("/login");
    });
    return;
  }
  next();
};

exports.checkCsrfError = (err, req, res, next) => {
  if (err) {
    return res.render("404", {
      title: "Página Não Existe",
    });
  }
  next();
};

exports.csrfMiddleware = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
};
