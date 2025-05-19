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

// 코드 작성 CodeMirror가져오기
const codeTextarea = document.getElementById("code");
let editor = null;

if (codeTextarea) {
  editor = CodeMirror.fromTextArea(codeTextarea, {
    lineNumbers: true,
    mode: "python",
    theme: "idea",
  });
}

//코드 실행 pyodide사용
let pyodide = null;

async function initPyodide() {
  pyodide = await loadPyodide();
  console.log("Pyodide loaded");
}

initPyodide();

// 있으면 input값 변경
const testInput = `5\n`;

if (runCodeBtn && codeDisplayArea && editor) {
  runCodeBtn.addEventListener("click", async () => {
    if (!pyodide) {
      alert("Pyodide is still loading...");
      return;
    }

    const code = editor.getValue();
    let output = "";

    try {
      pyodide.setStdout({
        batched: (msg) => (output += msg + "\n"),
      });
      pyodide.setStderr({
        batched: (msg) => (output += msg),
      });

      let inputLines = testInput.split("\n");
      let inputIndex = 0;
      // input값이 받는지 않받는지 예외처리
      pyodide.globals.set("input", () => {
        if (inputIndex < inputLines.length) {
          return inputLines[inputIndex++];
        }
        return "";
      });

      await pyodide.runPythonAsync(code);
      codeDisplayArea.textContent = output;
    } catch (err) {
      codeDisplayArea.textContent = err;
    }
  });
}

// 연습모드 챗본창 켜기
if (practiceModeBtn && chatbotSection) {
  practiceModeBtn.addEventListener("click", () => {
    const isVisible = chatbotSection.style.display === "block";
    chatbotSection.style.display = isVisible ? "none" : "block";
    console.log("clicked btn");
  });
}
