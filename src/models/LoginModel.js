const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const LoginModel = mongoose.model("Login", LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async login() {
    this.validate();
    if (this.errors.length > 0) return;

    const exists = await this.userExists();
    if (!exists) {
      this.errors.push("Usuário) ou senha incorretos");
      return;
    }

    if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.errors.push("Usuário ou senha incorretos");
      this.user = null;
      return;
    }
  }

  async register() {
    this.validate();
    if (this.errors.length > 0) return;

    // user not be in register
    const exists = await this.userExists();
    if (exists) {
      this.errors.push("Usuário já existente, faça login!");
      return;
    }

    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt);

    this.user = await LoginModel.create(this.body);
  }

  async userExists() {
    this.user = await LoginModel.findOne({ email: this.body.email });
    if (this.user) return true;
    return false;
  }

  validate() {
    this.cleanUp();
    // email needs to be valid
    if (!validator.isEmail(this.body.email)) {
      this.errors.push("Email Inválido");
    }
    // password length need to be > 3 <=50
    if (this.body.password.length < 4 || this.body.password.length > 50) {
      this.errors.push("A senha precisa ter entre 4 à 50 caracteres");
    }
  }

  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== "string") {
        this.body[key] = "";
      }
    }

    this.body = {
      email: this.body.email,
      password: this.body.password,
    };
  }
}

module.exports = Login;
