/**
 * CRUD Transactions - JavaScript Logic v3.0
 * Clean Professional Design - No Animations
 */

// Store current editing/deleting item
let currentItemId = null;
let selectedItems = new Set();
let currentPage = 1;
const itemsPerPage = 10;
let isTotalVisible = false;

// SAR Icon SVG for PDF
const SAR_ICON_SVG = `<svg width="24" height="24" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <path fill="#ee9f0d" d="M407.214478,747.282104 C395.177673,756.804626 381.216370,760.296082 366.890991,763.199341 C343.739105,767.891357 320.697235,773.123657 297.582855,778.004333 C266.654388,784.534973 235.690018,790.895569 204.762909,797.432556 C188.652451,800.837830 172.595108,804.493958 156.496094,807.954529 C154.470123,808.389954 152.423065,809.542297 149.821838,808.431152 C149.168732,801.584412 150.929794,794.936462 152.127823,788.341248 C156.036621,766.823181 162.445068,746.017639 170.708832,725.756958 C172.205978,722.086365 174.244537,720.315979 178.119232,719.492676 C230.671112,708.325500 283.189209,696.999573 335.720337,685.734497 C351.660309,682.316223 367.612305,678.953613 383.563141,675.585999 C390.663605,674.086914 390.890839,673.909485 390.877045,666.821716 C390.820953,637.990906 390.748383,609.159973 390.635101,580.329285 C390.606995,573.180969 389.703339,572.537170 382.668274,574.020142 C324.228088,586.339600 265.789001,598.664185 207.344040,610.960876 C201.210632,612.251343 195.041504,613.371887 188.725113,614.603210 C187.292480,610.411804 188.510086,606.788879 189.027573,603.330078 C192.760315,578.380676 199.169739,554.152466 209.190109,530.933350 C210.327942,528.296753 211.703461,526.555664 214.745636,525.917297 C241.771820,520.245667 268.771027,514.445679 295.775970,508.672974 C325.051483,502.414948 354.328979,496.165894 383.595673,489.866791 C390.551178,488.369781 390.681244,488.120392 390.682007,480.893097 C390.692627,379.233917 390.719299,277.574707 390.634583,175.915604 C390.630768,171.338058 391.682251,167.714966 394.734528,164.135559 C414.155914,141.360397 436.627472,122.229080 462.284882,106.853348 C465.212250,105.099037 467.665710,102.446541 471.411316,101.519569 C472.895233,103.955650 472.288849,106.496086 472.289581,108.867737 C472.325806,226.192490 472.320618,343.517242 472.320007,460.842010 C472.319977,462.008575 472.306641,463.175354 472.322754,464.341705 C472.398529,469.816010 473.187561,470.530914 478.497711,469.418060 C500.805786,464.743042 523.077393,459.888916 545.423462,455.404724 C550.344666,454.417175 551.790649,452.238159 551.784729,447.344666 C551.691162,369.683899 551.788025,292.022888 551.766968,214.361954 C551.766113,211.020020 552.486877,208.283875 554.705750,205.684998 C575.879517,180.884918 600.198181,159.837814 628.481140,143.482407 C629.751587,142.747726 630.864380,141.592300 632.643372,141.813950 C634.605713,143.430237 633.912415,145.750397 633.913513,147.800552 C633.961975,241.126938 633.970947,334.453339 633.982910,427.779755 C633.983032,428.612915 633.937683,429.446625 633.956421,430.279114 C634.078613,435.710785 634.892639,436.327515 640.257996,435.198547 C653.937683,432.320068 667.621887,429.462738 681.302856,426.590332 C730.792358,416.199738 780.282043,405.809570 829.769592,395.409332 C834.756287,394.361359 835.406433,395.013214 834.677246,399.903839 C830.809631,425.841309 824.541077,451.115906 814.672791,475.485260 C812.751526,480.229675 810.501465,482.959412 805.123169,484.069336 C768.463867,491.634460 731.887756,499.601807 695.277100,507.403412 C676.568237,511.390167 657.858093,515.374023 639.113831,519.189026 C635.288513,519.967651 633.938049,521.764709 633.958679,525.641479 C634.082581,548.972107 634.064636,572.304077 633.951660,595.634949 C633.930664,599.966248 635.272156,601.033081 639.625244,600.086243 C673.593689,592.697571 707.609802,585.527466 741.611816,578.293274 C771.386780,571.958496 801.168274,565.654114 830.929932,559.257751 C834.072510,558.582397 835.506409,559.385864 834.998901,562.665100 C830.890808,589.212097 824.945190,615.254944 814.598267,640.188171 C812.438354,645.392883 809.299377,647.892273 803.874084,649.011108 C772.262329,655.530640 740.712158,662.348328 709.131287,669.018250 C661.436707,679.091309 613.719727,689.058960 566.043274,699.216919 C551.764526,702.259216 551.791321,702.481567 551.783813,688.020996 C551.759460,641.024475 551.763062,594.027954 551.726379,547.031433 C551.720093,538.971802 550.802734,538.306458 543.044983,539.959656 C522.055359,544.432495 501.082916,548.991882 480.048920,553.246460 C474.997803,554.268127 473.227875,556.634094 473.257263,561.723145 C473.409302,588.053467 473.233765,614.385498 473.278564,640.716736 C473.297546,651.883972 470.533630,661.905334 463.572052,670.966370 C453.207855,684.456238 445.159027,699.507690 435.906342,713.754089 C427.888794,726.098755 419.048035,737.735107 407.214478,747.282104 z"/>
  <path fill="#ee9f0d" d="M581.944824,776.715210 C613.421326,770.061890 644.488159,763.486572 675.554443,756.908875 C709.557007,749.709595 743.563049,742.526245 777.559814,735.299622 C794.633728,731.670166 811.692261,727.968567 828.753967,724.282104 C835.147034,722.900757 835.364563,723.191956 834.416992,729.536316 C830.493774,755.803833 824.275330,781.427002 813.912964,805.984009 C812.221130,809.993225 809.981934,811.874695 805.741211,812.768250 C754.642273,823.535278 703.574158,834.449646 652.515320,845.406067 C621.299133,852.104553 590.109436,858.926941 558.915466,865.728638 C552.028931,867.230225 551.783386,867.062134 552.665771,860.182068 C556.003784,834.154602 562.314331,808.918457 572.359985,784.622986 C574.185486,780.208069 576.554138,777.158813 581.944824,776.715210 z"/>
</svg>`;

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
  initializeEventListeners();
  updateSelectionUI();
  initializePagination();
  calculateTotal();
  initializeTableScroll();
});

// Initialize RTL table scroll position
function initializeTableScroll() {
  const tableWrapper = document.querySelector('.crud-table-wrapper');
  if (tableWrapper && document.dir === 'rtl' || document.documentElement.dir === 'rtl') {
    // For RTL, scroll to the start (right side)
    tableWrapper.scrollLeft = tableWrapper.scrollWidth;
  }
}

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

// Calculate Total Amount
function calculateTotal() {
  const rows = document.querySelectorAll('#tableBody tr');
  let total = 0;
  let count = 0;
  
  rows.forEach(row => {
    if (row.style.display !== 'none') {
      const sarCell = row.querySelectorAll('td')[4];
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
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      if (!this.disabled) changePage(currentPage - 1);
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      if (!this.disabled) changePage(currentPage + 1);
    });
  }
  
  document.querySelectorAll('.crud-pagination-btn:not(.nav-btn)').forEach(btn => {
    btn.addEventListener('click', function() {
      const page = parseInt(this.textContent);
      if (!isNaN(page)) {
        changePage(page);
      }
    });
  });
}

// Change Page
function changePage(page) {
  const pageButtons = document.querySelectorAll('.crud-pagination-btn:not(.nav-btn)');
  const totalPages = pageButtons.length;
  if (page < 1 || page > totalPages) return;
  
  currentPage = page;
  
  // Update active state
  pageButtons.forEach(btn => {
    btn.classList.remove('active');
    if (parseInt(btn.textContent) === currentPage) {
      btn.classList.add('active');
    }
  });
  
  // Update nav buttons
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  if (prevBtn) prevBtn.disabled = currentPage === 1;
  if (nextBtn) nextBtn.disabled = currentPage === totalPages;
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
    work: cells[3].textContent,
    sar: cells[4].textContent,
    paymentType: cells[5].textContent.trim(),
    date: cells[6].textContent
  };
  
  currentItemId = id;
  
  const modalBody = document.getElementById('viewModalBody');
  modalBody.innerHTML = `
    <div class="crud-view-grid cols-6">
      <div class="crud-view-detail">
        <span class="crud-view-label">رقم</span>
        <span class="crud-view-value">${data.number}</span>
      </div>
      <div class="crud-view-detail">
        <span class="crud-view-label">الاسم</span>
        <span class="crud-view-value">${data.name}</span>
      </div>
      <div class="crud-view-detail">
        <span class="crud-view-label">العمل</span>
        <span class="crud-view-value">${data.work}</span>
      </div>
      <div class="crud-view-detail">
        <span class="crud-view-label">ريال</span>
        <span class="crud-view-value">${data.sar}</span>
      </div>
      <div class="crud-view-detail">
        <span class="crud-view-label">نوع الدفع</span>
        <span class="crud-view-value">${data.paymentType}</span>
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
  document.getElementById('editWork').value = cells[3].textContent;
  document.getElementById('editSar').value = cells[4].textContent.replace(/,/g, '');
  document.getElementById('editPaymentType').value = cells[5].textContent.trim();
  document.getElementById('editDate').value = cells[6].textContent;
  
  openModal('editModal');
}

// Search Handler with Empty State
function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase();
  const rows = document.querySelectorAll('#tableBody tr');
  const emptyState = document.getElementById('emptyState');
  const tableWrapper = document.querySelector('.crud-table-wrapper');
  const pagination = document.getElementById('paginationContainer');
  
  let visibleCount = 0;
  
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    if (text.includes(searchTerm)) {
      row.style.display = '';
      visibleCount++;
    } else {
      row.style.display = 'none';
    }
  });
  
  // Show/hide empty state
  if (visibleCount === 0 && searchTerm.length > 0) {
    emptyState.classList.add('show');
    tableWrapper.style.display = 'none';
    pagination.style.display = 'none';
  } else {
    emptyState.classList.remove('show');
    tableWrapper.style.display = '';
    pagination.style.display = '';
  }
  
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
    work: cells[3].textContent,
    sar: cells[4].textContent,
    paymentType: cells[5].textContent.trim(),
    date: cells[6].textContent
  };
  
  currentItemId = row.dataset.id;
  
  const modalBody = document.getElementById('viewModalBody');
  modalBody.innerHTML = `
    <div class="crud-view-grid cols-6">
      <div class="crud-view-detail">
        <span class="crud-view-label">رقم</span>
        <span class="crud-view-value">${data.number}</span>
      </div>
      <div class="crud-view-detail">
        <span class="crud-view-label">الاسم</span>
        <span class="crud-view-value">${data.name}</span>
      </div>
      <div class="crud-view-detail">
        <span class="crud-view-label">العمل</span>
        <span class="crud-view-value">${data.work}</span>
      </div>
      <div class="crud-view-detail">
        <span class="crud-view-label">ريال</span>
        <span class="crud-view-value">${data.sar}</span>
      </div>
      <div class="crud-view-detail">
        <span class="crud-view-label">نوع الدفع</span>
        <span class="crud-view-value">${data.paymentType}</span>
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
  document.getElementById('editWork').value = cells[3].textContent;
  document.getElementById('editSar').value = cells[4].textContent.replace(/,/g, '');
  document.getElementById('editPaymentType').value = cells[5].textContent.trim();
  document.getElementById('editDate').value = cells[6].textContent;
  
  openModal('editModal');
}

// Save Edit
function saveEdit() {
  const row = document.querySelector(`tr[data-id="${currentItemId}"]`);
  if (!row) return;
  
  const cells = row.querySelectorAll('td');
  const number = document.getElementById('editNumber').value;
  const name = document.getElementById('editName').value;
  const work = document.getElementById('editWork').value;
  const sar = parseInt(document.getElementById('editSar').value).toLocaleString();
  const paymentType = document.getElementById('editPaymentType').value;
  const date = document.getElementById('editDate').value;
  
  // Get badge class
  const badgeClass = getBadgeClass(paymentType);
  
  cells[1].textContent = number;
  cells[2].textContent = name;
  cells[3].textContent = work;
  cells[4].textContent = sar;
  cells[5].innerHTML = `<span class="crud-badge ${badgeClass}">${paymentType}</span>`;
  cells[6].textContent = date;
  
  // Simple success highlight
  row.classList.add('edit-success');
  setTimeout(() => {
    row.classList.remove('edit-success');
  }, 1500);
  
  closeModal('editModal');
  showToast('تم تحديث البيانات بنجاح', 'success');
  
  // Recalculate total after edit
  calculateTotal();
}

// Get Badge Class
function getBadgeClass(paymentType) {
  switch(paymentType) {
    case 'کاش': return 'crud-badge-cash';
    case 'شبكة': return 'crud-badge-network';
    case 'تحویل': return 'crud-badge-transfer';
    case 'نقل آخر': return 'crud-badge-other';
    default: return 'crud-badge-cash';
  }
}

// Delete Handler
function handleDelete(e) {
  const row = e.target.closest('tr');
  currentItemId = row.dataset.id;
  selectedItems.clear();
  selectedItems.add(currentItemId);
  
  document.getElementById('deleteItemInfo').textContent = 
    `سيتم حذف العنصر رقم ${row.querySelectorAll('td')[1].textContent}`;
  
  openModal('deleteModal');
}

// Bulk Delete Handler
function handleBulkDelete() {
  if (selectedItems.size === 0) {
    showToast('الرجاء تحديد عناصر للحذف', 'warning');
    return;
  }
  
  document.getElementById('deleteItemInfo').textContent = 
    `سيتم حذف ${selectedItems.size} عنصر`;
  
  openModal('deleteModal');
}

// Confirm Delete
function confirmDelete() {
  selectedItems.forEach(id => {
    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (row) {
      row.remove();
    }
  });
  
  selectedItems.clear();
  updateSelectionUI();
  
  // Reset select all
  document.getElementById('selectAll').checked = false;
  
  closeModal('deleteModal');
  showToast('تم الحذف بنجاح', 'success');
  
  // Recalculate total after delete
  calculateTotal();
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
        <th>العمل</th>
        <th>ريال</th>
        <th>نوع الدفع</th>
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
        <td>${cells[5].textContent.trim()}</td>
        <td>${cells[6].textContent}</td>
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

// SVG Logo for PDF (inline favicon)
const PDF_LOGO_SVG = `<svg width="40" height="40" viewBox="0 0 15.4 15.4" xmlns="http://www.w3.org/2000/svg"><rect fill="#16243b" width="15.4" height="15.4" rx="2.6"/><path fill="#eb5a32" d="M9,5.89c-.26-.17-.48-.33-.71-.45a.35.35,0,0,0-.29,0c-.6.37-1.19.75-1.85,1.18,0-.33,0-.6,0-.87a.38.38,0,0,1,.18-.22c.33-.23.67-.45,1.06-.7-.66-.33-1.17-.72-.85-1.55l1.33.91a.34.34,0,0,0,.46,0c.46-.32.94-.62,1.5-1a2.78,2.78,0,0,1-.11,1c-.16.25-.53.38-.84.59.6.41,1.18.81,1.77,1.18a.56.56,0,0,1,.29.56c0,1.21,0,2.43,0,3.71-.29-.19-.54-.35-.77-.53-.06-.05-.06-.19-.06-.29,0-.77,0-1.55,0-2.32a.7.7,0,0,0-.42-.75L6.32,8.61a.85.85,0,0,0-.48.86c0,.58,0,1.16,0,1.73a1.29,1.29,0,0,0,1.29,1.34,1.36,1.36,0,0,0,1.34-1.35c0-.79,0-1.59,0-2.39a.58.58,0,0,1,.37-.65,3.91,3.91,0,0,0,.42-.24c0,.09,0,.15,0,.21,0,1.06,0,2.11,0,3.16a2,2,0,0,1-1.39,2,2.05,2.05,0,0,1-2.3-.5A1.93,1.93,0,0,1,5,11.34c0-.9,0-1.8,0-2.7a.48.48,0,0,1,.22-.34c1-.67,2.09-1.32,3.13-2Z" transform="translate(-0.3 -0.3)"/><path fill="#f49625" d="M7.8,7.68l-1.47.93a.83.83,0,0,0-.48.86c0,.58,0,1.16,0,1.73a1.29,1.29,0,0,0,1.3,1.34,1.35,1.35,0,0,0,1.33-1.35c0-.79,0-1.59,0-2.39a.6.6,0,0,1,.37-.65,3.14,3.14,0,0,0,.42-.24,1.07,1.07,0,0,1,0,.21c0,1.06,0,2.11,0,3.16a2,2,0,0,1-1.39,2,2,2,0,0,1-2.29-.5A1.9,1.9,0,0,1,5,11.34c0-.9,0-1.8,0-2.7a.51.51,0,0,1,.22-.34L6.5,7.52" transform="translate(-0.3 -0.3)"/><path fill="#f49625" d="M11,9.4v.93c-.29-.19-.54-.35-.77-.53-.06-.05-.05-.19-.05-.29,0-.37,0-.75,0-1.12" transform="translate(-0.3 -0.3)"/><path fill="#f49625" d="M7.58,8.88c0,.81,0,1.56,0,2.3,0,.15-.21.29-.32.44-.35-.18-.54-.37-.49-.75a6.37,6.37,0,0,0,0-1.07.56.56,0,0,1,.35-.63C7.25,9.1,7.38,9,7.58,8.88Z" transform="translate(-0.3 -0.3)"/><path fill="#f49625" d="M10.11,13V11c.27.16.53.29.77.46a.38.38,0,0,1,.09.3A1.62,1.62,0,0,1,10.11,13Z" transform="translate(-0.3 -0.3)"/><path fill="#eb5a32" d="M7.38,2.75c.24-.19.43-.37.65-.51a.27.27,0,0,1,.26,0c.23.16.43.33.68.52a6.26,6.26,0,0,1-.67.49.33.33,0,0,1-.29,0C7.81,3.09,7.62,2.93,7.38,2.75Z" transform="translate(-0.3 -0.3)"/></svg>`;

// Download PDF - Simple Clean Black & White Professional Template
function downloadPDF() {
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
  
  // Get table data
  const tableContent = document.getElementById('printTableContent').innerHTML;
  const totalAmount = document.getElementById('totalAmount').textContent;
  
  const printWindow = window.open('', '', 'width=900,height=700');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <title>طباعة - مكتب أبو عوض</title>
      <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&family=Alexandria:wght@400;600;700;800&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { 
          font-family: 'Rubik', 'Alexandria', sans-serif;
          padding: 30px;
          direction: rtl;
          background: #f8f9fa;
          min-height: 100vh;
          color: #1a1a1a;
        }
        
        .print-wrapper {
          max-width: 800px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }
        
        /* Clean Header */
        .print-header {
          background: #ffffff;
          padding: 40px 35px 30px;
          text-align: center;
          border-bottom: 2px solid #1a1a1a;
        }
        
        .print-logo-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin-bottom: 12px;
        }
        
        .print-logo-svg {
          width: 42px;
          height: 42px;
          flex-shrink: 0;
        }
        
        .print-logo-svg svg {
          width: 100%;
          height: 100%;
          border-radius: 8px;
        }
        
        .print-company-name {
          font-family: 'Alexandria', serif;
          font-size: 32px;
          font-weight: 800;
          color: #1a1a1a;
          letter-spacing: -0.5px;
        }
        
        .print-subtitle {
          color: #6b7280;
          font-size: 14px;
          margin-top: 8px;
          font-weight: 500;
        }
        
        /* Content Area */
        .print-content {
          padding: 35px;
          background: #ffffff;
        }
        
        /* Date Row - Clean Text Style */
        .print-date-row {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 30px;
          padding: 14px 20px;
          margin-bottom: 28px;
          background: #fafafa;
          border-radius: 10px;
          border: 1px solid #e8e8e8;
        }
        
        .print-date-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #6b7280;
          font-size: 12px;
        }
        
        .print-date-label {
          color: #9ca3af;
          font-weight: 500;
        }
        
        .print-date-value {
          color: #1a1a1a;
          font-weight: 600;
          font-size: 13px;
        }
        
        .print-date-separator {
          width: 4px;
          height: 4px;
          background: #d1d5db;
          border-radius: 50%;
        }
        
        /* Section Title */
        .print-section-title {
          font-family: 'Alexandria', serif;
          font-size: 16px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 18px;
          padding-bottom: 10px;
          border-bottom: 2px solid #1a1a1a;
          display: inline-block;
        }
        
        /* Main Table - Highlighted with Beautiful Rounded Design */
        .print-table-wrapper {
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
          border: 2px solid #1a1a1a;
          margin-bottom: 30px;
          background: #ffffff;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
        }
        
        thead {
          background: #1a1a1a;
        }
        
        th {
          color: #ffffff;
          font-weight: 600;
          padding: 16px 14px;
          text-align: center;
          font-size: 13px;
          letter-spacing: 0.3px;
        }
        
        td {
          padding: 14px;
          text-align: center;
          border-bottom: 1px solid #e5e7eb;
          color: #374151;
          font-size: 13px;
          font-weight: 500;
        }
        
        tbody tr {
          background: #ffffff;
        }
        
        tbody tr:nth-child(even) { 
          background: #f9fafb;
        }
        
        tbody tr:last-child td {
          border-bottom: none;
        }
        
        /* Clean Total Section */
        .print-total {
          background: #f9fafb;
          border-radius: 16px;
          padding: 25px 30px;
          border: 2px solid #1a1a1a;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 30px;
        }
        
        .print-total-icon {
          width: 50px;
          height: 50px;
          background: #1a1a1a;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 22px;
        }
        
        .print-total-info {
          text-align: center;
        }
        
        .print-total-label {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 6px;
          font-weight: 500;
        }
        
        .print-total-value {
          font-family: 'Alexandria', serif;
          font-size: 28px;
          font-weight: 800;
          color: #1a1a1a;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        
        .print-total-value svg {
          width: 24px;
          height: 24px;
        }
        
        .print-total-value svg path {
          fill: #1a1a1a;
        }
        
        /* Footer */
        .print-footer {
          background: #f9fafb;
          padding: 25px 30px;
          text-align: center;
          border-top: 1px solid #e5e7eb;
        }
        
        .print-footer-text {
          color: #9ca3af;
          font-size: 11px;
          margin-bottom: 6px;
        }
        
        .print-footer-brand {
          color: #6b7280;
          font-size: 12px;
          font-weight: 600;
        }
        
        .print-footer-decoration {
          width: 60px;
          height: 3px;
          background: #1a1a1a;
          border-radius: 2px;
          margin: 12px auto 0;
        }
        
        @media print {
          body { 
            padding: 0;
            background: #ffffff;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .print-wrapper {
            box-shadow: none;
            border-radius: 0;
            border: none;
          }
          
          .print-header {
            padding: 30px 25px 20px;
          }
          
          .print-content {
            padding: 25px;
          }
        }
        
        @media (max-width: 600px) {
          body { padding: 15px; }
          .print-wrapper { border-radius: 16px; }
          .print-header { padding: 30px 20px 24px; }
          .print-content { padding: 24px; }
          .print-company-name { font-size: 24px; }
          .print-date-row { flex-direction: column; gap: 14px; padding: 16px; }
          .print-total { flex-direction: column; text-align: center; padding: 20px; }
          .print-total-info { text-align: center; }
          .print-total-value { justify-content: center; font-size: 24px; }
        }
      </style>
    </head>
    <body>
      <div class="print-wrapper">
        <div class="print-header">
          <div class="print-logo-row">
            <div class="print-logo-svg">${PDF_LOGO_SVG}</div>
            <div class="print-company-name">مكتب أبو عوض</div>
          </div>
          <div class="print-subtitle">سجل المعاملات المالية</div>
        </div>
        
        <div class="print-content">
          <div class="print-date-row">
            <div class="print-date-item">
              <span class="print-date-label">التاريخ:</span>
              <span class="print-date-value">${printDate}</span>
            </div>
            <div class="print-date-separator"></div>
            <div class="print-date-item">
              <span class="print-date-label">الوقت:</span>
              <span class="print-date-value">${printTime}</span>
            </div>
          </div>
          
          <div class="print-section-title">تفاصيل المعاملات</div>
          
          <div class="print-table-wrapper">
            <table>
              ${tableContent}
            </table>
          </div>
          
          ${isTotalVisible ? `
          <div class="print-total">
            <div class="print-total-icon">💰</div>
            <div class="print-total-info">
              <div class="print-total-label">إجمالي المبلغ</div>
              <div class="print-total-value">
                ${totalAmount}
                <svg width="24" height="24" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#1a1a1a" d="M407.214478,747.282104 C395.177673,756.804626 381.216370,760.296082 366.890991,763.199341 C343.739105,767.891357 320.697235,773.123657 297.582855,778.004333 C266.654388,784.534973 235.690018,790.895569 204.762909,797.432556 C188.652451,800.837830 172.595108,804.493958 156.496094,807.954529 C154.470123,808.389954 152.423065,809.542297 149.821838,808.431152 C149.168732,801.584412 150.929794,794.936462 152.127823,788.341248 C156.036621,766.823181 162.445068,746.017639 170.708832,725.756958 C172.205978,722.086365 174.244537,720.315979 178.119232,719.492676 C230.671112,708.325500 283.189209,696.999573 335.720337,685.734497 C351.660309,682.316223 367.612305,678.953613 383.563141,675.585999 C390.663605,674.086914 390.890839,673.909485 390.877045,666.821716 C390.820953,637.990906 390.748383,609.159973 390.635101,580.329285 C390.606995,573.180969 389.703339,572.537170 382.668274,574.020142 C324.228088,586.339600 265.789001,598.664185 207.344040,610.960876 C201.210632,612.251343 195.041504,613.371887 188.725113,614.603210 C187.292480,610.411804 188.510086,606.788879 189.027573,603.330078 C192.760315,578.380676 199.169739,554.152466 209.190109,530.933350 C210.327942,528.296753 211.703461,526.555664 214.745636,525.917297 C241.771820,520.245667 268.771027,514.445679 295.775970,508.672974 C325.051483,502.414948 354.328979,496.165894 383.595673,489.866791 C390.551178,488.369781 390.681244,488.120392 390.682007,480.893097 C390.692627,379.233917 390.719299,277.574707 390.634583,175.915604 C390.630768,171.338058 391.682251,167.714966 394.734528,164.135559 C414.155914,141.360397 436.627472,122.229080 462.284882,106.853348 C465.212250,105.099037 467.665710,102.446541 471.411316,101.519569 C472.895233,103.955650 472.288849,106.496086 472.289581,108.867737 C472.325806,226.192490 472.320618,343.517242 472.320007,460.842010 C472.319977,462.008575 472.306641,463.175354 472.322754,464.341705 C472.398529,469.816010 473.187561,470.530914 478.497711,469.418060 C500.805786,464.743042 523.077393,459.888916 545.423462,455.404724 C550.344666,454.417175 551.790649,452.238159 551.784729,447.344666 C551.691162,369.683899 551.788025,292.022888 551.766968,214.361954 C551.766113,211.020020 552.486877,208.283875 554.705750,205.684998 C575.879517,180.884918 600.198181,159.837814 628.481140,143.482407 C629.751587,142.747726 630.864380,141.592300 632.643372,141.813950 C634.605713,143.430237 633.912415,145.750397 633.913513,147.800552 C633.961975,241.126938 633.970947,334.453339 633.982910,427.779755 C633.983032,428.612915 633.937683,429.446625 633.956421,430.279114 C634.078613,435.710785 634.892639,436.327515 640.257996,435.198547 C653.937683,432.320068 667.621887,429.462738 681.302856,426.590332 C730.792358,416.199738 780.282043,405.809570 829.769592,395.409332 C834.756287,394.361359 835.406433,395.013214 834.677246,399.903839 C830.809631,425.841309 824.541077,451.115906 814.672791,475.485260 C812.751526,480.229675 810.501465,482.959412 805.123169,484.069336 C768.463867,491.634460 731.887756,499.601807 695.277100,507.403412 C676.568237,511.390167 657.858093,515.374023 639.113831,519.189026 C635.288513,519.967651 633.938049,521.764709 633.958679,525.641479 C634.082581,548.972107 634.064636,572.304077 633.951660,595.634949 C633.930664,599.966248 635.272156,601.033081 639.625244,600.086243 C673.593689,592.697571 707.609802,585.527466 741.611816,578.293274 C771.386780,571.958496 801.168274,565.654114 830.929932,559.257751 C834.072510,558.582397 835.506409,559.385864 834.998901,562.665100 C830.890808,589.212097 824.945190,615.254944 814.598267,640.188171 C812.438354,645.392883 809.299377,647.892273 803.874084,649.011108 C772.262329,655.530640 740.712158,662.348328 709.131287,669.018250 C661.436707,679.091309 613.719727,689.058960 566.043274,699.216919 C551.764526,702.259216 551.791321,702.481567 551.783813,688.020996 C551.759460,641.024475 551.763062,594.027954 551.726379,547.031433 C551.720093,538.971802 550.802734,538.306458 543.044983,539.959656 C522.055359,544.432495 501.082916,548.991882 480.048920,553.246460 C474.997803,554.268127 473.227875,556.634094 473.257263,561.723145 C473.409302,588.053467 473.233765,614.385498 473.278564,640.716736 C473.297546,651.883972 470.533630,661.905334 463.572052,670.966370 C453.207855,684.456238 445.159027,699.507690 435.906342,713.754089 C427.888794,726.098755 419.048035,737.735107 407.214478,747.282104 z"/>
                  <path fill="#1a1a1a" d="M581.944824,776.715210 C613.421326,770.061890 644.488159,763.486572 675.554443,756.908875 C709.557007,749.709595 743.563049,742.526245 777.559814,735.299622 C794.633728,731.670166 811.692261,727.968567 828.753967,724.282104 C835.147034,722.900757 835.364563,723.191956 834.416992,729.536316 C830.493774,755.803833 824.275330,781.427002 813.912964,805.984009 C812.221130,809.993225 809.981934,811.874695 805.741211,812.768250 C754.642273,823.535278 703.574158,834.449646 652.515320,845.406067 C621.299133,852.104553 590.109436,858.926941 558.915466,865.728638 C552.028931,867.230225 551.783386,867.062134 552.665771,860.182068 C556.003784,834.154602 562.314331,808.918457 572.359985,784.622986 C574.185486,780.208069 576.554138,777.158813 581.944824,776.715210 z"/>
                </svg>
              </div>
            </div>
          </div>
          ` : ''}
        </div>
        
        <div class="print-footer">
          <div class="print-footer-text">هذا المستند تم إنشاؤه إلكترونياً</div>
          <div class="print-footer-brand">© مكتب أبو عوض - جميع الحقوق محفوظة</div>
          <div class="print-footer-decoration"></div>
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

// Premium Toast Notification with Icons
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  
  // Define icons for each type
  const icons = {
    success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`
  };
  
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.success}</span>
    <span class="toast-message">${message}</span>
  `;
  toast.className = `crud-toast ${type} show`;
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
