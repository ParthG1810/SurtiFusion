const { LabelTemplate } = require("../models");

exports.getTemplate = async (req, res) => {
  try {
    const tpl = await LabelTemplate.findOne();
    res.json({ content: tpl?.content || "" });
  } catch (err) {
    console.error("getTemplate:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.saveTemplate = async (req, res) => {
  try {
    const { content } = req.body;
    let tpl = await LabelTemplate.findOne();
    if (tpl) {
      tpl.content = content;
      await tpl.save();
    } else {
      tpl = await LabelTemplate.create({ content });
    }
    res.json({ content: tpl.content });
  } catch (err) {
    console.error("saveTemplate:", err);
    res.status(500).json({ message: err.message });
  }
};
