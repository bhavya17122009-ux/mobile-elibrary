// 1. Navigation Logic
function showPage(pageId) {
    document.getElementById('studentPage').style.display = pageId === 'student' ? 'block' : 'none';
    document.getElementById('adminPage').style.display = pageId === 'admin' ? 'block' : 'none';
    if(pageId === 'admin') updateAdminTable();
}

// 2. Barcode Scanner Setup
let html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
html5QrcodeScanner.render((text) => {
    document.getElementById('studentID').innerText = text;
});

// 3. Request Logic (Save to localStorage)
function requestBook() {
    const studentID = document.getElementById('studentID').innerText;
    const bookTitle = document.getElementById('bookTitle').value;

    if(studentID === "None" || bookTitle === "") {
        alert("Scan ID and enter book name first!");
        return;
    }

    const request = { studentID, bookTitle, date: new Date().toLocaleDateString() };
    
    // Get existing data or start new array
    let allRequests = JSON.parse(localStorage.getItem('bookRequests')) || [];
    allRequests.push(request);
    localStorage.setItem('bookRequests', JSON.stringify(allRequests));

    alert("Success! Collect your book tomorrow.");
    document.getElementById('bookTitle').value = ""; 
}

// 4. Librarian Update Logic
function updateAdminTable() {
    const list = document.getElementById('issueList');
    const allRequests = JSON.parse(localStorage.getItem('bookRequests')) || [];
    
    list.innerHTML = allRequests.map(req => `
        <tr>
            <td>${req.studentID}</td>
            <td>${req.bookTitle}</td>
            <td>Pending</td>
        </tr>
    `).join('');
}

function clearData() {
    if(confirm("Clear all collection records?")) {
        localStorage.removeItem('bookRequests');
        updateAdminTable();
    }
}