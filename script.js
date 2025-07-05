const reviewIntervals = [1, 3, 7, 14];

function showMainMenu() {
    document.getElementById("content").innerHTML = `
    <div id="main-menu" class="button-group">
      <button onclick="showAddProblem()">[ add problem ]</button>
      <button onclick="showDueProblems()">[ today's due ]</button>
      <button onclick="showAllProblems()">[ all problems ]</button>
      <button onclick="clearAll()">[ clear all ]</button>
    </div>
    <p class="disclaimer">
      📌 Add problem numbers you solve. They’ll automatically resurface for review after <strong>1, 3, 7, and 14 days</strong> based on spaced repetition. All data stays in your browser.
    </p>
  `;
}

function showAddProblem() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById("content").innerHTML = `
    <p>today: ${today}</p>
    <input type="text" id="problemNumber" placeholder="problem no.">
    <button onclick="addProblem()">[ add ]</button>
    <div class="back-btn">
      <button onclick="showMainMenu()">[ back ]</button>
    </div>
  `;
}

function addProblem() {
    const problemNumber = document.getElementById("problemNumber").value.trim();
    const today = new Date().toISOString().split('T')[0];
    if (!problemNumber) {
        alert("please enter a problem number.");
        return;
    }

    const data = JSON.parse(localStorage.getItem("problems") || "[]");
    data.push({ problemNumber, solvedDate: today });
    localStorage.setItem("problems", JSON.stringify(data));

    showAddProblem();
}

function showDueProblems() {
    const today = new Date();
    const problems = JSON.parse(localStorage.getItem("problems") || "[]");
    const reviewedToday = getReviewedToday();
    let output = `<h3>today's due</h3><ul>`;
    let dueToday = [];

    problems.forEach(({ problemNumber, solvedDate }) => {
        const solved = new Date(solvedDate);
        reviewIntervals.forEach(days => {
            const reviewDate = new Date(solved);
            reviewDate.setDate(reviewDate.getDate() + days);
            if (isSameDate(reviewDate, today) && !reviewedToday.includes(problemNumber)) {
                dueToday.push(problemNumber);
            }
        });
    });

    if (dueToday.length === 0) {
        output += `<p>no problems due today.</p>`;
    } else {
        dueToday.forEach(problemNumber => {
            output += `
        <li id="problem-${problemNumber}">
          <input type="checkbox" onchange="handleCheck(this, '${problemNumber}')">
          [ ] Problem #${problemNumber}
        </li>`;
        });
    }

    output += `</ul><div class="back-btn"><button onclick="showMainMenu()">[ back ]</button></div>`;
    document.getElementById("content").innerHTML = output;
}

function handleCheck(checkbox, problemNumber) {
    const listItem = document.getElementById(`problem-${problemNumber}`);
    if (checkbox.checked) {
        addReviewedToday(problemNumber);
        listItem.remove();
    }
}

function showAllProblems() {
    const problems = JSON.parse(localStorage.getItem("problems") || "[]");
    let output = `<h3>all problems</h3><ul>`;

    if (problems.length === 0) {
        output += `<p>no problems saved.</p>`;
    } else {
        problems.forEach(({ problemNumber, solvedDate }) => {
            output += `<li>[ ] #${problemNumber} | added: ${solvedDate}</li>`;
        });
    }

    output += `</ul><div class="back-btn"><button onclick="showMainMenu()">[ back ]</button></div>`;
    document.getElementById("content").innerHTML = output;
}

function clearAll() {
    if (confirm("clear all problems?")) {
        localStorage.removeItem("problems");
        localStorage.removeItem("reviewedToday");
        showMainMenu();
    }
}

function isSameDate(a, b) {
    return a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();
}

function getReviewedToday() {
    const todayStr = new Date().toISOString().split('T')[0];
    const data = JSON.parse(localStorage.getItem("reviewedToday") || "{}");
    return data[todayStr] || [];
}

function addReviewedToday(problemNumber) {
    const todayStr = new Date().toISOString().split('T')[0];
    const data = JSON.parse(localStorage.getItem("reviewedToday") || "{}");
    if (!data[todayStr]) data[todayStr] = [];
    data[todayStr].push(problemNumber);
    localStorage.setItem("reviewedToday", JSON.stringify(data));
}

function toggleTheme() {
    const isDark = document.body.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    document.getElementById("theme-toggle").innerText = isDark ? "☀️" : "🌙";
}

function applySavedTheme() {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
        document.body.classList.add("dark");
        document.getElementById("theme-toggle").innerText = "☀️";
    } else {
        document.getElementById("theme-toggle").innerText = "🌙";
    }
}

// Initial load
applySavedTheme();
showMainMenu();
