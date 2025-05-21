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
    console.log("clicked btn");
  });
}
