const ContatoModel = require("../models/ContatoModel");

exports.index = async (req, res) => {
  res.render("contato", {
    title: "Gerenciar Contatos",
  });
  return;
};

exports.add = async (req, res) => {
  try {
    const payload = {
      id: req.session.user._id,
      email: req.body.email,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      phonenumber: req.body.phonenumber,
    };

    const contato = new ContatoModel(payload);
    await contato.register();

    if (contato.errors.length > 0) {
      req.flash("errors", contato.errors);
      req.session.save(() => {
        res.redirect("/contatos");
      });
      return;
    }

    req.flash("success", "Contato registrado com sucesso!");
    req.session.save(() => {
      res.redirect("/");
    });
  } catch (e) {
    console.log(e);
    res.render("404", {
      title: "Não Encontrado",
    });
  }
  return;
};

exports.edit = async (req, res) => {
  if (!req.params.id)
    return res.render("404", {
      title: "Não Encontrado",
    });

  try {
    const contact_id = req.params.id;
    const user_id = req.session.user._id;

    const contato = new ContatoModel(req.body);
    const contact = await contato.getById(contact_id, user_id);
    if (!contact) {
      res.render("404", {
        title: "Não Encontrado",
      });
    }

    res.render("contato_edit", {
      title: "Gerenciar Contatos",
      contato: contact,
    });
  } catch (e) {
    console.log(e);
    res.render("404", {
      title: "Não Encontrado",
    });
  }
  return;
};

exports.detail = async (req, res) => {
  if (!req.params.id)
    return res.render("404", {
      title: "Não Encontrado",
    });

  try {
    const contact_id = req.params.id;
    const user_id = req.session.user._id;

    const contato = new ContatoModel(req.body);
    const contact = await contato.getById(contact_id, user_id);
    if (!contact) {
      res.render("404", {
        title: "Não Encontrado",
      });
    }

    res.render("contato_edit", {
      title: "Gerenciar Contatos",
      contato: contact,
    });
  } catch (e) {
    console.log(e);
    res.render("404", {
      title: "Não Encontrado",
    });
  }
  return;
};

exports.list = async (req, res) => {
  try {
    const contato = new ContatoModel(req.body);

    const contacts = await contato.getAll(req.session.user._id);
    if (!contacts) {
      res.render("404", {
        title: "Não Encontrado",
      });
    }

    res.render("contato_list", {
      title: "Gerenciar Contatos",
      contacts: contacts,
    });
  } catch (e) {
    console.log(e);
    res.render("404", {
      title: "Não Encontrado",
    });
  }
  return;
};

exports.delete = async (req, res) => {
  res.render("contato", {
    title: "Gerenciar Contatos",
  });
  return;
};
