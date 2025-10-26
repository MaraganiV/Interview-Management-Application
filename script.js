
document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const user = username.value.trim();
  const pass = password.value.trim();

  if (user === "admin" && pass === "1234") {
    localStorage.setItem("loggedIn", "true");
    loginPage.classList.add("hidden");
    app.classList.remove("hidden");
    document.getElementById("navMenu").classList.remove("hidden");
    showPage("home");
  } else {
    alert("Invalid username or password!");
  }
});

function checkLogin() {
  if (localStorage.getItem("loggedIn") === "true") {
    loginPage.classList.add("hidden");
    app.classList.remove("hidden");
    document.getElementById("navMenu").classList.remove("hidden");
    showPage("home");
  }
}

function logout() {
  localStorage.removeItem("loggedIn");
  app.classList.add("hidden");
  loginPage.classList.remove("hidden");
  document.getElementById("navMenu").classList.add("hidden");

  
  document.getElementById("loginForm").reset();
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
}


checkLogin();


function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById(pageId).classList.remove("hidden");
  if (pageId === "view") loadInterviews();
}


function getInterviews() {
  return JSON.parse(localStorage.getItem("interviews")) || [];
}
function saveInterviews(data) {
  localStorage.setItem("interviews", JSON.stringify(data));
}


document.getElementById("interviewForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const candidateVal = candidate.value.trim();
  const emailVal = email.value.trim();
  const roleVal = role.value.trim();
  const dateVal = date.value;
  const timeVal = time.value;
  const interviewerVal = interviewer.value.trim();
  const editIndex = editIndexInput.value;

  if (!candidateVal || !emailVal || !roleVal || !dateVal || !timeVal || !interviewerVal) {
    alert("Please fill all fields!");
    return;
  }

  let interviews = getInterviews();

  if (editIndex === "") {
    interviews.push({ candidate: candidateVal, email: emailVal, role: roleVal, date: dateVal, time: timeVal, interviewer: interviewerVal });
    alert("Interview scheduled successfully!");
  } else {
    interviews[editIndex] = { candidate: candidateVal, email: emailVal, role: roleVal, date: dateVal, time: timeVal, interviewer: interviewerVal };
    alert("Interview updated successfully!");
  }

  saveInterviews(interviews);
  this.reset();
  editIndexInput.value = "";
  submitBtn.textContent = "Schedule";
});


function loadInterviews(list = null) {
  let interviews = list || getInterviews();
  const tbody = document.querySelector("#interviewTable tbody");
  tbody.innerHTML = "";

  if (interviews.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7">No interviews scheduled.</td></tr>`;
    return;
  }

  interviews.forEach((intv, index) => {
    tbody.innerHTML += `
      <tr>
        <td>${intv.candidate}</td>
        <td>${intv.email}</td>
        <td>${intv.role}</td>
        <td>${intv.date}</td>
        <td>${intv.time}</td>
        <td>${intv.interviewer}</td>
        <td>
          <button class="edit" onclick="editInterview(${index})">Edit</button>
          <button class="delete" onclick="deleteInterview(${index})">Delete</button>
        </td>
      </tr>`;
  });
}

function editInterview(index) {
  const intv = getInterviews()[index];
  candidate.value = intv.candidate;
  email.value = intv.email;
  role.value = intv.role;
  date.value = intv.date;
  time.value = intv.time;
  interviewer.value = intv.interviewer;
  editIndexInput.value = index;
  submitBtn.textContent = "Update";
  showPage("schedule");
}

function deleteInterview(index) {
  let interviews = getInterviews();
  if (confirm("Are you sure you want to delete this interview?")) {
    interviews.splice(index, 1);
    saveInterviews(interviews);
    loadInterviews();
  }
}


function searchInterview() {
  const query = document.getElementById("search").value.toLowerCase();
  const filtered = getInterviews().filter(i => i.candidate.toLowerCase().includes(query));
  loadInterviews(filtered);
}

function filterByDate() {
  const date = document.getElementById("filterDate").value;
  if (!date) return loadInterviews();
  const filtered = getInterviews().filter(i => i.date === date);
  loadInterviews(filtered);
}
                                                                                                                                        