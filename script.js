// 1. Page Switching
function showPage(pageId) {
    document.getElementById('studentPage').style.display = pageId === 'student' ? 'block' : 'none';
    document.getElementById('adminPage').style.display = pageId === 'admin' ? 'block' : 'none';
    if(pageId === 'admin') updateAdminTable();
}

// 2. Barcode-Only Scanner Setup
const formatsToSupport = [
    Html5QrcodeSupportedFormats.CODE_128,
    Html5QrcodeSupportedFormats.CODE_39,
    Html5QrcodeSupportedFormats.EAN_13,
    Html5QrcodeSupportedFormats.UPC_A
];

let html5QrcodeScanner = new Html5QrcodeScanner(
    "reader", 
    { 
        fps: 20, 
        qrbox: { width: 280, height: 120 }, // Wider box for horizontal barcodes
        formatsToSupport: formatsToSupport 
    }
);

html5QrcodeScanner.render((barcodeText) => {
    document.getElementById('studentID').innerText = barcodeText;
    if (navigator.vibrate) navigator.vibrate(70); 
});

// 3. Save Data
function requestBook() {
    const id = document.getElementById('studentID').innerText;
    const book = document.getElementById('bookTitle').value;

    if(id === "Scan barcode..." || book === "") {
        alert("Please scan a barcode and enter the book name.");
        return;
    }

    const newRequest = { id, book };
    let list = JSON.parse(localStorage.getItem('libData')) || [];
    list.push(newRequest);
    localStorage.setItem('libData', JSON.stringify(list));

    alert("Request Registered for tomorrow!");
    document.getElementById('bookTitle').value = "";
}

// 4. Librarian Panel
function updateAdminTable() {
    const container = document.getElementById('issueList');
    const list = JSON.parse(localStorage.getItem('libData')) || [];
    
    container.innerHTML = list.map((item, index) => `
        <tr>
            <td>${item.id}</td>
            <td>${item.book}</td>
            <td><button onclick="deleteItem(${index})">Done</button></td>
        </tr>
    `).join('');
}

function deleteItem(i) {
    let list = JSON.parse(localStorage.getItem('libData'));
    list.splice(i, 1);
    localStorage.setItem('libData', JSON.stringify(list));
    updateAdminTable();
}

function clearData() {
    if(confirm("Clear all data?")) {
        localStorage.removeItem('libData');
        updateAdminTable();
    }
}
