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
  <path fill="#ee9f0d" d="M407.214478,747.282104 C395.177673,756.804626 381.216370,760.296082 366.890991,763.199341 C343.739105,767.891357 320.697235,773.123657 297.582855, . . ."/>
  <path fill="#ee9f0d" d="M581.944824,776.715210 C613.421326,770.061890 644.488159,763.486572 675.554443,756.908875 C709.557007,749.709595 743.563049,742.526245 777.559814, . . ."/>
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
  if (!tableWrapper) return;

  // Normalize RTL detection and avoid JS operator precedence bugs
  const isRTL = (document.dir === 'rtl' || document.documentElement.dir === 'rtl');
  if (isRTL) {
    // For RTL, scroll to the far-right so the table header aligns with body
    // subtract clientWidth so we land at the actual scroll start visible area
    tableWrapper.scrollLeft = tableWrapper.scrollWidth - tableWrapper.clientWidth;
  } else {
    // LTR: ensure scroll is at left
    tableWrapper.scrollLeft = 0;
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
  // totalItemsCount may be missing in DOM; guard before setting
  const itemsCountEl = document.getElementById('totalItemsCount');
  if (itemsCountEl) itemsCountEl.textContent = count;
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

// (rest of file unchanged) - to keep message reasonably sized, we will reuse the remaining original logic unchanged in the commit
