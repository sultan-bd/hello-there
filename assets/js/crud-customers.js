/**
 * CRUD Customers - JavaScript Logic v2.0
 * 4 Column Table (No, Name, SAR, Date)
 * Premium UI/UX with smooth animations
 */

// Store current editing/deleting item
let currentItemId = null;
let selectedItems = new Set();
let currentPage = 1;
const itemsPerPage = 10;
let isTotalVisible = false;

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
  initializeEventListeners();
  updateSelectionUI();
  initializePagination();
  calculateTotal();
});

// Toggle Total Section
function toggleTotalSection() {
  const content = document.getElementById('totalContent');
  const btn = document.getElementById('toggleTotalBtn');
  
  isTotalVisible = !isTotalVisible;
  
  if (isTotalVisible) {
    content.style.display = 'block';
    btn.innerHTML = '<i class="fa-solid fa-eye-slash"></i><span>إخفاء المجموع</span>';
    btn.classList.add('active');
    calculateTotal();
  } else {
    content.style.display = 'none';
    btn.innerHTML = '<i class="fa-solid fa-calculator"></i><span>إظهار المجموع</span>';
    btn.classList.remove('active');
  }
}

// Calculate Total Amount (SAR column is index 3 for customers)
function calculateTotal() {
  const rows = document.querySelectorAll('#tableBody tr');
  let total = 0;
  let count = 0;
  
  rows.forEach(row => {
    if (row.style.display !== 'none') {
      const sarCell = row.querySelectorAll('td')[3];
      if (sarCell) {
        const value = parseFloat(sarCell.textContent.replace(/,/g, ''));
        if (!isNaN(value)) {
          total += value;
          count++;
        }
      }
    }
  });
  
  document.getElementById('totalAmount').textContent = total.toLocaleString();
  document.getElementById('totalItemsCount').textContent = count;
}

// Initialize all event listeners
function initializeEventListeners() {
  // Select All checkbox
  const selectAll = document.getElementById('selectAll');
  if (selectAll) {
    selectAll.addEventListener('change', handleSelectAll);
  }

  // Individual row checkboxes
  document.querySelectorAll('.row-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', handleRowSelect);
  });

  // Search functionality
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
  }

  // Floating Action Bar buttons
  const singleViewBtn = document.getElementById('singleViewBtn');
  if (singleViewBtn) {
    singleViewBtn.addEventListener('click', handleSingleView);
  }
  
  const singleEditBtn = document.getElementById('singleEditBtn');
  if (singleEditBtn) {
    singleEditBtn.addEventListener('click', handleSingleEdit);
  }

  // Bulk delete
  const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
  if (bulkDeleteBtn) {
    bulkDeleteBtn.addEventListener('click', handleBulkDelete);
  }
  
  // Bulk print
  const bulkPrintBtn = document.getElementById('bulkPrintBtn');
  if (bulkPrintBtn) {
    bulkPrintBtn.addEventListener('click', handleBulkPrint);
  }

  // Close modal on overlay click
  document.querySelectorAll('.crud-modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function(e) {
      if (e.target === this) {
        closeModal(this.id);
      }
    });
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });
}

// Initialize Pagination
function initializePagination() {
  document.querySelectorAll('.crud-pagination-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      if (this.disabled) return;
      
      const icon = this.querySelector('i');
      if (icon) {
        if (icon.classList.contains('fa-chevron-right')) {
          changePage(currentPage - 1);
        } else if (icon.classList.contains('fa-chevron-left')) {
          changePage(currentPage + 1);
        }
      } else {
        const page = parseInt(this.textContent);
        if (!isNaN(page)) {
          changePage(page);
        }
      }
    });
  });
}

// Change Page
function changePage(page) {
  const totalPages = document.querySelectorAll('.crud-pagination-btn:not(:first-child):not(:last-child)').length;
  if (page < 1 || page > totalPages) return;
  
  currentPage = page;
  
  // Update active state
  document.querySelectorAll('.crud-pagination-btn').forEach((btn, index) => {
    btn.classList.remove('active');
    if (index === 0) {
      btn.disabled = currentPage === 1;
    } else if (index === document.querySelectorAll('.crud-pagination-btn').length - 1) {
      btn.disabled = currentPage === totalPages;
    } else if (parseInt(btn.textContent) === currentPage) {
      btn.classList.add('active');
    }
  });
  
  // Animation for page change
  const tableWrapper = document.querySelector('.crud-table-wrapper');
  tableWrapper.style.opacity = '0';
  tableWrapper.style.transform = 'translateY(10px)';
  
  setTimeout(() => {
    tableWrapper.style.transition = 'all 0.3s ease';
    tableWrapper.style.opacity = '1';
    tableWrapper.style.transform = 'translateY(0)';
  }, 150);
}

// Handle Select All
function handleSelectAll(e) {
  const isChecked = e.target.checked;
  document.querySelectorAll('.row-checkbox').forEach(checkbox => {
    checkbox.checked = isChecked;
    const row = checkbox.closest('tr');
    if (isChecked) {
      selectedItems.add(row.dataset.id);
      row.classList.add('selected');
    } else {
      selectedItems.delete(row.dataset.id);
      row.classList.remove('selected');
    }
  });
  updateSelectionUI();
}

// Handle Individual Row Select
function handleRowSelect(e) {
  const row = e.target.closest('tr');
  if (e.target.checked) {
    selectedItems.add(row.dataset.id);
    row.classList.add('selected');
  } else {
    selectedItems.delete(row.dataset.id);
    row.classList.remove('selected');
  }
  
  // Update select all checkbox
  const allCheckboxes = document.querySelectorAll('.row-checkbox');
  const selectAll = document.getElementById('selectAll');
  selectAll.checked = [...allCheckboxes].every(cb => cb.checked);
  
  updateSelectionUI();
}

// Update Selection UI
function updateSelectionUI() {
  const actionBar = document.getElementById('floatingActionBar');
  const countBadge = document.getElementById('selectedCount');
  const viewBtn = document.getElementById('singleViewBtn');
  const editBtn = document.getElementById('singleEditBtn');
  
  if (selectedItems.size > 0) {
    actionBar.style.display = 'block';
    countBadge.textContent = selectedItems.size;
    
    // Enable/disable view and edit buttons based on selection count
    if (selectedItems.size === 1) {
      viewBtn.disabled = false;
      editBtn.disabled = false;
      viewBtn.style.opacity = '1';
      editBtn.style.opacity = '1';
    } else {
      viewBtn.disabled = true;
      editBtn.disabled = true;
      viewBtn.style.opacity = '0.5';
      editBtn.style.opacity = '0.5';
    }
  } else {
    actionBar.style.display = 'none';
  }
}

// Handle Single View from floating bar
function handleSingleView() {
  if (selectedItems.size !== 1) return;
  
  const id = [...selectedItems][0];
  const row = document.querySelector(`tr[data-id="${id}"]`);
  if (!row) return;
  
  const cells = row.querySelectorAll('td');
  
  const data = {
    number: cells[1].textContent,
    name: cells[2].textContent,
    sar: cells[3].textContent,
    date: cells[4].textContent
  };
  
  currentItemId = id;
  
  const modalBody = document.getElementById('viewModalBody');
  modalBody.innerHTML = `
    <div class="crud-view-grid cols-4">
      <div class="crud-view-detail">
        <span class="crud-view-label">رقم</span>
        <span class="crud-view-value">${data.number}</span>
      </div>
      <div class="crud-view-detail">
        <span class="crud-view-label">الاسم</span>
        <span class="crud-view-value">${data.name}</span>
      </div>
      <div class="crud-view-detail">
        <span class="crud-view-label">ريال</span>
        <span class="crud-view-value">${data.sar}</span>
      </div>
      <div class="crud-view-detail">
        <span class="crud-view-label">التاريخ</span>
        <span class="crud-view-value">${data.date}</span>
      </div>
    </div>
  `;
  
  openModal('viewModal');
}

// Handle Single Edit from floating bar
function handleSingleEdit() {
  if (selectedItems.size !== 1) return;
  
  const id = [...selectedItems][0];
  const row = document.querySelector(`tr[data-id="${id}"]`);
  if (!row) return;
  
  const cells = row.querySelectorAll('td');
  
  currentItemId = id;
  
  document.getElementById('editNumber').value = cells[1].textContent;
  document.getElementById('editName').value = cells[2].textContent;
  document.getElementById('editSar').value = cells[3].textContent.replace(/,/g, '');
  document.getElementById('editDate').value = cells[4].textContent;
  
  openModal('editModal');
}

// Search Handler
function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase();
  const rows = document.querySelectorAll('#tableBody tr');
  
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    if (text.includes(searchTerm)) {
      row.style.display = '';
      row.style.animation = 'fadeIn 0.3s ease';
    } else {
      row.style.display = 'none';
    }
  });
  
  // Recalculate total after search
  calculateTotal();
}

// View Handler
function handleView(e) {
  const row = e.target.closest('tr');
  const cells = row.querySelectorAll('td');
  
  const data = {
    number: cells[1].textContent,
    name: cells[2].textContent,
    sar: cells[3].textContent,
    date: cells[4].textContent
  };
  
  currentItemId = row.dataset.id;
  
  const modalBody = document.getElementById('viewModalBody');
  modalBody.innerHTML = `
    <div class="crud-view-grid cols-4">
      <div class="crud-view-detail">
        <span class="crud-view-label">رقم</span>
        <span class="crud-view-value">${data.number}</span>
      </div>
      <div class="crud-view-detail">
        <span class="crud-view-label">الاسم</span>
        <span class="crud-view-value">${data.name}</span>
      </div>
      <div class="crud-view-detail">
        <span class="crud-view-label">ريال</span>
        <span class="crud-view-value">${data.sar}</span>
      </div>
      <div class="crud-view-detail">
        <span class="crud-view-label">التاريخ</span>
        <span class="crud-view-value">${data.date}</span>
      </div>
    </div>
  `;
  
  openModal('viewModal');
}

// Edit Handler
function handleEdit(e) {
  const row = e.target.closest('tr');
  const cells = row.querySelectorAll('td');
  
  currentItemId = row.dataset.id;
  
  document.getElementById('editNumber').value = cells[1].textContent;
  document.getElementById('editName').value = cells[2].textContent;
  document.getElementById('editSar').value = cells[3].textContent.replace(/,/g, '');
  document.getElementById('editDate').value = cells[4].textContent;
  
  openModal('editModal');
}

// Save Edit
function saveEdit() {
  const row = document.querySelector(`tr[data-id="${currentItemId}"]`);
  if (!row) return;
  
  const cells = row.querySelectorAll('td');
  const number = document.getElementById('editNumber').value;
  const name = document.getElementById('editName').value;
  const sar = parseInt(document.getElementById('editSar').value).toLocaleString();
  const date = document.getElementById('editDate').value;
  
  cells[1].textContent = number;
  cells[2].textContent = name;
  cells[3].textContent = sar;
  cells[4].textContent = date;
  
  // Premium success animation for row
  row.classList.add('edit-success');
  row.style.animation = 'none';
  row.offsetHeight;
  row.style.animation = 'editSuccessGlow 1s ease';
  
  setTimeout(() => {
    row.classList.remove('edit-success');
  }, 1000);
  
  closeModal('editModal');
  showToast('تم تحديث البيانات بنجاح', 'success');
  
  // Recalculate total after edit
  calculateTotal();
}

// Delete Handler
function handleDelete(e) {
  const row = e.target.closest('tr');
  currentItemId = row.dataset.id;
  selectedItems.clear();
  selectedItems.add(currentItemId);
  
  document.getElementById('deleteItemInfo').textContent = 
    `سيتم حذف العميل: ${row.querySelectorAll('td')[2].textContent}`;
  
  openModal('deleteModal');
}

// Bulk Delete Handler
function handleBulkDelete() {
  if (selectedItems.size === 0) {
    showToast('الرجاء تحديد عناصر للحذف', 'warning');
    return;
  }
  
  document.getElementById('deleteItemInfo').textContent = 
    `سيتم حذف ${selectedItems.size} عميل`;
  
  openModal('deleteModal');
}

// Confirm Delete
function confirmDelete() {
  selectedItems.forEach(id => {
    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (row) {
      row.style.animation = 'fadeOutSlide 0.4s ease forwards';
      setTimeout(() => row.remove(), 400);
    }
  });
  
  selectedItems.clear();
  updateSelectionUI();
  
  // Reset select all
  document.getElementById('selectAll').checked = false;
  
  closeModal('deleteModal');
  showToast('تم الحذف بنجاح', 'success');
  
  // Recalculate total after delete
  setTimeout(() => calculateTotal(), 500);
}

// Print Handler
function handlePrint(e) {
  const row = e.target.closest('tr');
  currentItemId = row.dataset.id;
  selectedItems.clear();
  selectedItems.add(currentItemId);
  
  preparePrintContent([row]);
  openModal('printModal');
}

// Bulk Print Handler
function handleBulkPrint() {
  if (selectedItems.size === 0) {
    showToast('الرجاء تحديد عناصر للطباعة', 'warning');
    return;
  }
  
  const rows = [...selectedItems].map(id => 
    document.querySelector(`tr[data-id="${id}"]`)
  ).filter(Boolean);
  
  preparePrintContent(rows);
  openModal('printModal');
}

// Prepare Print Content
function preparePrintContent(rows) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('ar-SA', { 
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  document.getElementById('printDate').textContent = `تاريخ الطباعة: ${dateStr}`;
  
  let tableHTML = `
    <thead>
      <tr>
        <th>رقم</th>
        <th>الاسم</th>
        <th>ريال</th>
        <th>التاريخ</th>
      </tr>
    </thead>
    <tbody>
  `;
  
  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    tableHTML += `
      <tr>
        <td>${cells[1].textContent}</td>
        <td>${cells[2].textContent}</td>
        <td>${cells[3].textContent}</td>
        <td>${cells[4].textContent}</td>
      </tr>
    `;
  });
  
  tableHTML += '</tbody>';
  document.getElementById('printTableContent').innerHTML = tableHTML;
}

// Print Current Item (from View Modal)
function printCurrentItem() {
  closeModal('viewModal');
  const row = document.querySelector(`tr[data-id="${currentItemId}"]`);
  if (row) {
    preparePrintContent([row]);
    openModal('printModal');
  }
}

// Download PDF - Premium Template
function downloadPDF() {
  const printContent = document.querySelector('.crud-print-preview').innerHTML;
  const now = new Date();
  const printDate = now.toLocaleDateString('ar-SA', { 
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const printTime = now.toLocaleTimeString('ar-SA', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const printWindow = window.open('', '', 'width=900,height=700');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <title>طباعة - مكتب أبو عوض</title>
      <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&family=Alexandria:wght@400;600;700&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { 
          font-family: 'Rubik', sans-serif;
          padding: 40px;
          direction: rtl;
          background: #f8fafc;
          min-height: 100vh;
        }
        
        .print-wrapper {
          max-width: 700px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        
        .print-header-top {
          background: linear-gradient(145deg, #14243b 0%, #1a3152 100%);
          padding: 30px 40px;
          text-align: center;
          border-bottom: 4px solid #ee9f0d;
        }
        
        .print-logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin-bottom: 15px;
        }
        
        .print-logo-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(145deg, #ee9f0d 0%, #f8a203 100%);
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
          box-shadow: 0 8px 20px rgba(238, 159, 13, 0.4);
        }
        
        .print-company-name {
          font-family: 'Alexandria', serif;
          font-size: 32px;
          font-weight: 700;
          color: white;
          letter-spacing: 1px;
        }
        
        .print-subtitle {
          color: rgba(255,255,255,0.8);
          font-size: 14px;
          margin-top: 8px;
        }
        
        .print-date-bar {
          background: linear-gradient(90deg, #f8fafc 0%, #e2e8f0 50%, #f8fafc 100%);
          padding: 15px 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 30px;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .print-date-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #475569;
          font-size: 14px;
          font-weight: 500;
        }
        
        .print-date-item strong {
          color: #14243b;
        }
        
        .print-content {
          padding: 30px 40px 40px;
        }
        
        .print-section-title {
          font-family: 'Alexandria', serif;
          font-size: 18px;
          font-weight: 600;
          color: #14243b;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 2px solid #ee9f0d;
          display: inline-block;
        }
        
        table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 15px rgba(0,0,0,0.06);
        }
        
        th {
          background: linear-gradient(145deg, #14243b 0%, #1a3152 100%);
          color: white;
          font-weight: 600;
          padding: 16px 15px;
          text-align: center;
          font-size: 14px;
          letter-spacing: 0.3px;
        }
        
        td {
          padding: 15px;
          text-align: center;
          border-bottom: 1px solid #f1f5f9;
          color: #334155;
          font-size: 14px;
          font-weight: 500;
        }
        
        tr:nth-child(even) { 
          background: #f8fafc; 
        }
        
        tr:last-child td {
          border-bottom: none;
        }
        
        .print-footer {
          background: linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%);
          padding: 20px 40px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        
        .print-footer-text {
          color: #64748b;
          font-size: 12px;
        }
        
        .print-footer-brand {
          color: #14243b;
          font-weight: 600;
          margin-top: 8px;
          font-size: 13px;
        }
        
        .print-total-section {
          margin-top: 30px;
          padding-top: 25px;
          border-top: 2px dashed #e2e8f0;
        }
        
        .print-total-card {
          background: linear-gradient(145deg, #fef3c7 0%, #fde68a 100%);
          border-radius: 16px;
          padding: 25px 35px;
          text-align: center;
          border: 2px solid #f59e0b;
          box-shadow: 0 4px 15px rgba(245, 158, 11, 0.2);
        }
        
        .print-total-label {
          font-size: 14px;
          color: #92400e;
          font-weight: 500;
          margin-bottom: 8px;
        }
        
        .print-total-value {
          font-family: 'Alexandria', serif;
          font-size: 32px;
          font-weight: 700;
          color: #14243b;
          margin-bottom: 8px;
        }
        
        .print-total-items {
          font-size: 13px;
          color: #78350f;
          background: rgba(255, 255, 255, 0.6);
          padding: 6px 16px;
          border-radius: 20px;
          display: inline-block;
        }
        
        @media print {
          body { 
            padding: 0; 
            background: white;
          }
          .print-wrapper {
            box-shadow: none;
            border-radius: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="print-wrapper">
        <div class="print-header-top">
          <div class="print-logo-container">
            <div class="print-logo-icon">👥</div>
            <div class="print-company-name">مكتب أبو عوض</div>
          </div>
          <div class="print-subtitle">سجل العملاء</div>
        </div>
        
        <div class="print-date-bar">
          <div class="print-date-item">
            <span>📅</span>
            <span>تاريخ الطباعة:</span>
            <strong>${printDate}</strong>
          </div>
          <div class="print-date-item">
            <span>🕐</span>
            <span>الوقت:</span>
            <strong>${printTime}</strong>
          </div>
        </div>
        
        <div class="print-content">
          <div class="print-section-title">تفاصيل العملاء</div>
          ${document.getElementById('printTableContent').outerHTML}
          ${isTotalVisible ? `
          <div class="print-total-section">
            <div class="print-total-card">
              <div class="print-total-label">إجمالي المبلغ</div>
              <div class="print-total-value">${document.getElementById('totalAmount').textContent} ريال</div>
              <div class="print-total-items">${document.getElementById('totalItemsCount').textContent} عميل</div>
            </div>
          </div>
          ` : ''}
        </div>
        
        <div class="print-footer">
          <div class="print-footer-text">هذا المستند تم إنشاؤه إلكترونياً</div>
          <div class="print-footer-brand">© مكتب أبو عوض - جميع الحقوق محفوظة</div>
        </div>
      </div>
      
      <script>
        window.onload = function() {
          window.print();
          window.onafterprint = function() { window.close(); };
        };
      <\/script>
    </body>
    </html>
  `);
  printWindow.document.close();
  
  closeModal('printModal');
  showToast('جاري فتح نافذة الطباعة...', 'success');
}

// Modal Functions
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function closeAllModals() {
  document.querySelectorAll('.crud-modal-overlay').forEach(modal => {
    modal.classList.remove('active');
  });
  document.body.style.overflow = '';
}

// Toast Notification with Premium Animation
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  
  // Create icon element
  const iconContent = type === 'success' ? '' : (type === 'warning' ? '⚠' : '✕');
  
  toast.innerHTML = `
    <span class="toast-icon">${iconContent}</span>
    <span class="toast-message">${message}</span>
  `;
  toast.className = `crud-toast ${type} show`;
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

// Add custom animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOutSlide {
    from { 
      opacity: 1; 
      transform: translateX(0); 
    }
    to { 
      opacity: 0; 
      transform: translateX(30px); 
    }
  }
  
  .toast-message {
    font-weight: 600;
    letter-spacing: 0.3px;
  }
`;
document.head.appendChild(style);
