const gutterVertical = document.querySelector(".gutter-vertical");
const problemSection = document.querySelector(".problem-section");
const editorArea = document.querySelector(".editor-area");
const practiceModeBtn = document.querySelector(".practice-mode-btn");
const chatbotSection = document.querySelector(".chatbot-section");

let isDragging = false;
let gutterVerticalPosition = 0;
let mousedownPosition = 0;
let newProblemSectionWitdh;

let lineForm = `<div class="editor-line">
              <p>1</p>
              <input type="text" />
            </div>`;

gutterVertical.addEventListener("mousedown", (e) => {
  isDragging = true;
  gutterVerticalPosition = problemSection.getBoundingClientRect().width;
  mousedownPosition = e.clientX;
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});

document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    const diff = e.clientX - mousedownPosition;

    if (Math.abs(diff) <= 70) return;

    newProblemSectionWitdh = gutterVerticalPosition + diff;
    problemSection.style.width = newProblemSectionWitdh + "px";
  }
});

function addInputListeners() {
  const inputs = document.querySelectorAll(".editor-line > input");
  inputs.forEach((input) => {
    input.addEventListener("keydown", onKeyDown);
  });
}

function onKeyDown(e) {
  if (e.key === "Enter") {
    editorArea.insertAdjacentHTML("beforeend", lineForm);
    addInputListeners();
  }
  if (e.key === "Backspace") {
    if (e.target.value.trim() === "") {
      e.target.parentElement.remove();
    }
  }
}

addInputListeners();

practiceModeBtn.addEventListener("click", () => {
  const isVisible = chatbotSection.style.display === "block";
  chatbotSection.style.display = isVisible ? "none" : "block";
});
