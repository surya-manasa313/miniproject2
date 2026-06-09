const faqContainer = document.getElementById("faqContainer");
const searchInput = document.getElementById("searchInput");

async function fetchFAQs() {
  const res = await fetch("/api/faqs");
  const faqs = await res.json();

  displayFAQs(faqs);
}

function displayFAQs(faqs) {

  faqContainer.innerHTML = "";

  faqs.forEach(faq => {

    const faqDiv = document.createElement("div");
    faqDiv.classList.add("faq");

    faqDiv.innerHTML = `
      <div class="question">
        <span>${faq.question}</span>

        <div>
          <button class="delete-btn"
            onclick="deleteFAQ(${faq.id})">
            Delete
          </button>
        </div>
      </div>

      <div class="answer">
        ${faq.answer}
      </div>
    `;

    const question = faqDiv.querySelector(".question");
    const answer = faqDiv.querySelector(".answer");

    question.addEventListener("click", (e) => {

      if (e.target.classList.contains("delete-btn")) return;

      answer.classList.toggle("show");
    });

    faqContainer.appendChild(faqDiv);
  });
}

async function addFAQ() {

  const question = document.getElementById("question").value;
  const answer = document.getElementById("answer").value;

  if (!question || !answer) {
    alert("Please fill all fields");
    return;
  }

  await fetch("/api/faqs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      question,
      answer
    })
  });

  document.getElementById("question").value = "";
  document.getElementById("answer").value = "";

  fetchFAQs();
}

async function deleteFAQ(id) {

  await fetch(`/api/faqs/${id}`, {
    method: "DELETE"
  });

  fetchFAQs();
}

searchInput.addEventListener("input", async () => {

  const searchText = searchInput.value.toLowerCase();

  const res = await fetch("/api/faqs");
  const faqs = await res.json();

  const filtered = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchText)
  );

  displayFAQs(filtered);
});

fetchFAQs();
