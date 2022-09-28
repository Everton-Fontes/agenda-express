const mongoose = require("mongoose");
const validator = require("validator");

const ContatoSchema = new mongoose.Schema({
  id: { type: String, required: true },
  email: { type: String, required: false, default: "" },
  first_name: { type: String, required: true },
  last_name: { type: String, required: false, default: "" },
  phonenumber: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ContatoModel = mongoose.model("Contato", ContatoSchema);

class Contato {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.contact = null;
  }

  async register() {
    this.validate();
    if (this.errors.length > 0) return;

    // user not be in register
    const exists = await this.contactExists();
    if (exists) {
      this.errors.push("Contato já existe!");
      return;
    }

    this.contact = await ContatoModel.create(this.body);
  }

  async contactExists() {
    this.contact = await ContatoModel.findOne({
      phonenumber: this.body.phonenumber,
      id: this.body.id,
    });
    if (this.contact) return true;
    return false;
  }

  async getById(id_contact, user_id) {
    if (typeof id_contact !== "string" || typeof user_id !== "string") return;

    const contact = await ContatoModel.findOne({
      _id: id_contact,
      id: user_id,
    });
    return contact;
  }

  async getAll(user_id) {
    if (typeof user_id !== "string") return;
    const contacts = await ContatoModel.find({
      id: user_id,
    });
    return contacts;
  }

  validate() {
    this.cleanUp();
    // email needs to be valid
    if (this.body.email && !validator.isEmail(this.body.email)) {
      this.errors.push("Email Inválido");
    }
    // Need a Name
    if (!this.body.first_name) this.errors.push("O Contato precisa de um nome");
    if (!this.body.phonenumber)
      this.errors.push("O Contato precisa de um Telefone");
    if (this.body.phonenumber.length != 11 || isNaN(this.body.phonenumber))
      this.errors.push(
        "Número de telefone precisa ter 11 caracteres e ser apenas números"
      );
  }

  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== "string") {
        this.body[key] = "";
      }
    }

    this.body = {
      id: this.body.id,
      email: this.body.email,
      first_name: this.body.first_name,
      last_name: this.body.last_name,
      phonenumber: this.body.phonenumber,
    };
  }
}

module.exports = Contato;
