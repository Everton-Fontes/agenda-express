exports.index = async (req, res) => {
  res.render("index", {
    title: "Agenda Simples",
  });
  return;
};
