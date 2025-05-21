const gutterVertical = document.querySelector(".gutter-vertical");
const problemSection = document.querySelector(".problem-section");
const editorArea = document.querySelector(".editor-area");
const practiceModeBtn = document.querySelector(".practice-mode-btn");
const chatbotSection = document.querySelector(".chatbot-section");
const runCodeBtn = document.querySelector(".run-code-btn");
const codeDisplayArea = document.querySelector(".code-display-area");

let isDragging = false;
let gutterVerticalPosition = 0;
let mousedownPosition = 0;
let newProblemSectionWitdh;

// 드래그로 문제 영역 늘리기
if (gutterVertical && problemSection) {
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
}
// ✅ CodeMirror 에디터 설정
const codeTextarea = document.getElementById("code");
let editor = null;

if (codeTextarea) {
  editor = CodeMirror.fromTextArea(codeTextarea, {
    lineNumbers: true,
    mode: "python",
    theme: "idea",
  });
}

// ✅ Pyodide 초기화
let pyodide = null;

async function initPyodide() {
  pyodide = await loadPyodide();
  console.log("Pyodide loaded");
}
initPyodide();
const problemIndex = getProblemIndexFromURL();
if (problemIndex) {
  loadProblem(problemIndex);
} else {
  codeDisplayArea.textContent = "❌ URL에 problem_index가 없습니다.";
}

let testCases = [];

function getProblemIndexFromURL() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get("problem_index"));
}

async function loadProblem(index) {
  try {
    const response = await fetch(`/api/problem/${index}/`);
    const data = await response.json();

    if (data.error) {
      codeDisplayArea.textContent = "문제 로딩 실패: " + data.error;
      return;
    }
    testCases = data.testCase;
  } catch (err) {
    codeDisplayArea.textContent = "문제 불러오기 중 오류 발생: " + err.message;
  }
}

runCodeBtn.addEventListener("click", async () => {
  const code = editor.getValue();
  let finalOutput = "";

  for (let i = 0; i < testCases.length; i++) {
    const testInput = testCases[i].input;
    const expectedOutput = testCases[i].output;
    let output = "";

    try {
      pyodide.setStdout({
        batched: (msg) => (output += msg + "\n"),
      });
      pyodide.setStderr({
        batched: (msg) => (output += msg),
      });

      const inputLines = testInput.trim().split("\n");
      let inputIndex = 0;
      pyodide.globals.set("input", () => {
        if (inputIndex < inputLines.length) {
          return inputLines[inputIndex++];
        }
        return "";
      });

      await pyodide.runPythonAsync(code);
      const userOutput = output.trim();
      const expected = expectedOutput.trim();

      if (userOutput === expected) {
        finalOutput += `✅ 테스트 ${i + 1} 통과\n`;
      } else {
        finalOutput += `❌ 테스트 ${
          i + 1
        } 실패\n출력: ${userOutput}\n기댓값: ${expected}\n\n`;
      }
    } catch (err) {
      finalOutput += `❌ 테스트 ${i + 1} 중 오류 발생: ${err.message}\n\n`;
    }
  }

  codeDisplayArea.textContent = finalOutput;
});

// 연습모드 챗봇창 켜기
if (practiceModeBtn && chatbotSection) {
  practiceModeBtn.addEventListener("click", () => {
    const isVisible = chatbotSection.style.display === "block";
    chatbotSection.style.display = isVisible ? "none" : "block";
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const chatLog = document.getElementById("chat-log");

  chatForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    appendMessage("나", userMessage);

    chatInput.value = "";

    fetch("/chatbot/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCSRFToken(),
      },
      body: JSON.stringify({ message: userMessage }),
    })
      .then((res) => res.json())
      .then((data) => {
        appendMessage("GPT", data.reply);
      })
      .catch((err) => {
        appendMessage("❌ 오류", "서버 오류 발생", err);
      });
  });

  function appendMessage(sender, text) {
    const msg = document.createElement("div");
    msg.classList.add("chat-message");

    if (sender === "나") {
      msg.classList.add("chat-user");
    } else {
      msg.classList.add("chat-gpt");
    }

    const p = document.createElement("p");
    p.innerHTML = `<strong>${sender}:</strong> ${text}`;
    msg.appendChild(p);

    chatLog.appendChild(msg);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function getCSRFToken() {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      ?.split("=")[1];
  }
});
