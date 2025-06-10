let token = null;
let userRole = '';

document.addEventListener('DOMContentLoaded', () => {
  loadLogin();
});

function loadLogin() {
  document.getElementById('app').innerHTML = `
    <div id="login">
      <h1>Login</h1>
      <form id="loginForm">
        <input type="text" id="phone" placeholder="Username" required>
        <input type="password" id="password" placeholder="Password" required>
        <button type="submit">Log In</button>
      </form>
    </div>
  `;

  document.getElementById('loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const phone = e.target.phone.value;
    const password = e.target.password.value;

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password })
    });

    const data = await res.json();
    if (!res.ok) return alert(data.msg);

    token = data.token;
    userRole = data.user.role;
    loadDashboard();
  });
}

function loadDashboard() {
  let tabs = `
    <span class="tab" onclick="showTab('attendance')">Attendance</span>
    <span class="tab" onclick="showTab('notices')">Notices</span>
    <span class="tab" onclick="showTab('holidays')">Holidays</span>
  `;

  if (userRole === 'admin') {
    tabs += `
      <span class="tab" onclick="showTab('addStaff')">Add Staff</span>
      <span class="tab" onclick="showTab('addStudent')">Add Student</span>
    `;
  } else if (userRole === 'staff') {
    tabs += `<span class="tab" onclick="showTab('addStudent')">Add Student</span>`;
  }

  tabs += `<span class="tab" onclick="logout()">Logout</span>`;

  document.getElementById('app').innerHTML = `
    <h2>Welcome, ${userRole}</h2>
    <div>${tabs}</div>
    <div id="content" style="margin-top:20px;"></div>
    <footer>Designed by Jit Das - XI(Science)</footer>
  `;

  showTab('attendance');
}

function showTab(tab) {
  const content = document.getElementById('content');

  if (tab === 'attendance') {
    const today = new Date().toLocaleDateString();
    content.innerHTML = `
      <h3>Mark Attendance</h3>
      <form id="attendanceForm">
        <input type="text" id="studentName" placeholder="Student Name" required>
        <select id="status">
          <option value="present">Present</option>
          <option value="absent">Absent</option>
        </select>
        <button type="submit">Submit</button>
      </form>
      <div id="msg"></div>
    `;

    document.getElementById('attendanceForm').addEventListener('submit', async e => {
      e.preventDefault();
      const studentName = document.getElementById('studentName').value;
      const status = document.getElementById('status').value;

      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ studentName, status, date: today })
      });

      const data = await res.json();
      document.getElementById('msg').innerHTML = `<p>${data.msg}</p>`;
    });
  }

  else if (tab === 'addStaff' || tab === 'addStudent') {
    const label = tab === 'addStaff' ? 'Staff' : 'Student';
    const roleValue = tab === 'addStaff' ? 'staff' : 'student';

    content.innerHTML = `
      <h3>Add ${label}</h3>
      <form id="userForm">
        <input type="text" id="name" placeholder="Name" required>
        <input type="text" id="phone" placeholder="Username" required>
        <input type="password" id="password" placeholder="Password" required>
        <button type="submit">Create ${label}</button>
      </form>
      <div id="msg"></div>
    `;

    document.getElementById('userForm').addEventListener('submit', async e => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const phone = document.getElementById('phone').value;
      const password = document.getElementById('password').value;

      const res = await fetch('/api/auth/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, password, role: roleValue })
      });

      const data = await res.json();
      document.getElementById('msg').innerHTML = res.ok
        ? `<span style="color:green;">${data.msg}</span>`
        : `<span style="color:red;">${data.msg}</span>`;
    });
  }

  else if (tab === 'notices') {
    content.innerHTML = `
      <h3>📢 Notices</h3>
      <ul id="noticeList"></ul>
      ${userRole === 'staff' || userRole === 'admin' ? `
      <form id="noticeForm">
        <input type="text" id="noticeText" placeholder="Notice text" required>
        <button type="submit">Add Notice</button>
      </form>` : ''}
    `;

    fetch('/api/notices')
      .then(res => res.json())
      .then(data => {
        const list = data.notices.map(n => `<li>${n}</li>`).join('');
        document.getElementById('noticeList').innerHTML = list;
      });

    const form = document.getElementById('noticeForm');
    if (form) form.addEventListener('submit', async e => {
      e.preventDefault();
      const text = document.getElementById('noticeText').value;
      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify({ text })
      });
      const json = await res.json();
      alert(json.msg);
      showTab('notices');
    });
  }

  else if (tab === 'holidays') {
    content.innerHTML = `
      <h3>📅 Holidays</h3>
      <ul id="holidayList"></ul>
      ${userRole === 'staff' || userRole === 'admin' ? `
      <form id="holidayForm">
        <input type="date" id="holidayDate" required>
        <input type="text" id="holidayText" placeholder="Holiday name" required>
        <button type="submit">Add Holiday</button>
      </form>` : ''}
    `;

    fetch('/api/holidays')
      .then(res => res.json())
      .then(data => {
        const list = data.holidays.map(h => `<li>${h.date} — ${h.name}</li>`).join('');
        document.getElementById('holidayList').innerHTML = list;
      });

    const form = document.getElementById('holidayForm');
    if (form) form.addEventListener('submit', async e => {
      e.preventDefault();
      const date = document.getElementById('holidayDate').value;
      const name = document.getElementById('holidayText').value;
      const res = await fetch('/api/holidays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify({ date, name })
      });
      const json = await res.json();
      alert(json.msg);
      showTab('holidays');
    });
  }
}

function logout() {
  token = null;
  userRole = '';
  loadLogin();
}
