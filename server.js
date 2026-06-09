const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

const FILE_PATH = "./faqs.json";

function readFAQs() {
  const data = fs.readFileSync(FILE_PATH);
  return JSON.parse(data);
}

function writeFAQs(data) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
}

app.get("/api/faqs", (req, res) => {
  const faqs = readFAQs();
  res.json(faqs);
});

app.post("/api/faqs", (req, res) => {
  const { question, answer } = req.body;

  if (!question || !answer) {
    return res.status(400).json({
      message: "Question and Answer required"
    });
  }

  const faqs = readFAQs();

  const newFAQ = {
    id: Date.now(),
    question,
    answer
  };

  faqs.push(newFAQ);

  writeFAQs(faqs);

  res.json({
    message: "FAQ Added Successfully",
    faq: newFAQ
  });
});

app.delete("/api/faqs/:id", (req, res) => {
  const id = parseInt(req.params.id);

  let faqs = readFAQs();

  faqs = faqs.filter(faq => faq.id !== id);

  writeFAQs(faqs);

  res.json({
    message: "FAQ Deleted Successfully"
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
