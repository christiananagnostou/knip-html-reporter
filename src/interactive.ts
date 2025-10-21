/**
 * Client-side JavaScript for interactive features
 * This code is embedded in the generated HTML report
 */
export function getInteractiveScript(): string {
  return /* html */ `
<script>
(function() {
  'use strict';
  
  // State management
  let state = {
    searchQuery: '',
    activeFilters: new Set(),
    allIssueTypes: new Set(),
    currentTheme: 'system'
  };
  
  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeFilters();
    initializeSearch();
    collectIssueTypes();
  });
  
  /**
   * Get the effective theme (resolving 'system' to 'light' or 'dark')
   */
  function getEffectiveTheme(theme) {
    if (theme === 'system') {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
    return theme;
  }
  
  /**
   * Initialize theme management
   */
  function initializeTheme() {
    // Get saved theme or default to system
    const savedTheme = localStorage.getItem('knip-report-theme') || 'system';
    state.currentTheme = savedTheme;
    
    // Apply theme
    applyTheme(savedTheme);
    
    // Update button states
    updateThemeButtons(savedTheme);
    
    // Add click handlers to theme buttons
    const themeButtons = document.querySelectorAll('.theme-toggle-btn');
    themeButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        const theme = this.dataset.theme;
        state.currentTheme = theme;
        localStorage.setItem('knip-report-theme', theme);
        applyTheme(theme);
        updateThemeButtons(theme);
      });
    });
    
    // Listen for system theme changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (state.currentTheme === 'system') {
          applyTheme('system');
        }
      });
    }
  }
  
  /**
   * Apply theme to document
   */
  function applyTheme(theme) {
    const root = document.documentElement;
    const effectiveTheme = getEffectiveTheme(theme);
    root.setAttribute('data-theme', effectiveTheme);
  }
  
  /**
   * Update theme button states
   */
  function updateThemeButtons(activeTheme) {
    const themeButtons = document.querySelectorAll('.theme-toggle-btn');
    themeButtons.forEach(btn => {
      if (btn.dataset.theme === activeTheme) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
  
  /**
   * Collect all unique issue types from the page
   */
  function collectIssueTypes() {
    const categorySections = document.querySelectorAll('.category-section');
    categorySections.forEach(el => {
      const category = el.dataset.category;
      if (category) state.allIssueTypes.add(category);
    });
  }
  
  /**
   * Initialize filter functionality via summary cards
   */
  function initializeFilters() {
    const summaryCards = document.querySelectorAll('.summary-card');
    
    summaryCards.forEach(card => {
      // Add click handler
      card.addEventListener('click', function() {
        toggleCardFilter(this);
      });
      
      // Add keyboard support
      card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleCardFilter(this);
        }
      });
    });
  }
  
  /**
   * Toggle filter when a summary card is clicked
   */
  function toggleCardFilter(card) {
    const filterType = card.dataset.filter;
    if (!filterType) return;
    
    // Toggle this filter
    if (state.activeFilters.has(filterType)) {
      state.activeFilters.delete(filterType);
      card.classList.remove('active');
    } else {
      state.activeFilters.add(filterType);
      card.classList.add('active');
    }
    
    applyFiltersAndSearch();
  }
  
  /**
   * Initialize search functionality
   */
  function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('clear-search');
    
    if (searchInput) {
      searchInput.addEventListener('input', function(e) {
        state.searchQuery = e.target.value.toLowerCase();
        if (clearBtn) {
          clearBtn.style.display = state.searchQuery ? 'block' : 'none';
        }
        applyFiltersAndSearch();
      });
    }
    
    if (clearBtn) {
      clearBtn.addEventListener('click', function() {
        if (searchInput) {
          searchInput.value = '';
          state.searchQuery = '';
          this.style.display = 'none';
          applyFiltersAndSearch();
        }
      });
    }
  }
  
  /**
   * Apply both filters and search
   */
  function applyFiltersAndSearch() {
    const categorySections = document.querySelectorAll('.category-section');
    let visibleSections = 0;
    
    categorySections.forEach(section => {
      const category = section.dataset.category;
      
      // Check if this category should be visible based on filters
      const passesFilter = state.activeFilters.size === 0 || 
                          state.activeFilters.has(category);
      
      if (!passesFilter) {
        section.style.display = 'none';
        return;
      }
      
      // If no search query, show the entire category
      if (!state.searchQuery) {
        section.style.display = 'block';
        visibleSections++;
        // Reset all table rows to visible
        const rows = section.querySelectorAll('tbody tr');
        rows.forEach(row => row.style.display = '');
        return;
      }
      
      // Search at the individual issue (table row) level
      const rows = section.querySelectorAll('tbody tr');
      let visibleRowsCount = 0;
      
      rows.forEach(row => {
        if (rowMatchesSearch(row)) {
          row.style.display = '';
          visibleRowsCount++;
        } else {
          row.style.display = 'none';
        }
      });
      
      // Show category if it has visible rows
      if (visibleRowsCount > 0) {
        section.style.display = 'block';
        visibleSections++;
      } else {
        section.style.display = 'none';
      }
    });
    
    // Update no results message
    updateNoResultsMessage(visibleSections);
  }
  
  /**
   * Check if a table row matches the search query
   */
  function rowMatchesSearch(row) {
    if (!state.searchQuery) return true;
    
    // Get all searchable text from the row
    const symbol = row.querySelector('.symbol')?.textContent || '';
    const filePath = row.querySelector('.file-path')?.textContent || '';
    const position = row.querySelector('.position')?.textContent || '';
    
    // Combine all searchable fields
    const searchableText = (symbol + ' ' + filePath + ' ' + position).toLowerCase();
    
    return searchableText.includes(state.searchQuery);
  }
  
  /**
   * Update or create "no results" message
   */
  function updateNoResultsMessage(visibleCount) {
    const issuesSection = document.querySelector('.issues-section');
    let noResults = document.getElementById('no-results');
    
    if (visibleCount === 0) {
      if (!noResults && issuesSection) {
        noResults = document.createElement('div');
        noResults.id = 'no-results';
        noResults.className = 'no-results';
        noResults.innerHTML = '<p>No issues match your current filters and search.</p>';
        issuesSection.appendChild(noResults);
      }
    } else {
      if (noResults) {
        noResults.remove();
      }
    }
  }
  
  /**
   * Open file in IDE (VS Code by default)
   */
  window.openInIDE = function(filePath, line, col) {
    // Construct absolute path from current working directory
    // If path doesn't start with /, it's relative - need to make it absolute
    let absolutePath = filePath;
    
    // If the path is relative, we need to construct the absolute path
    // The working directory should be stored in a data attribute on the body
    if (!filePath.startsWith('/')) {
      const cwd = document.body.getAttribute('data-cwd') || '';
      if (cwd) {
        absolutePath = cwd + '/' + filePath;
      }
    }
    
    // Build VS Code URL without encoding the entire path
    // Format: vscode://file/absolute/path/to/file:line:col
    let vscodeUrl = 'vscode://file' + absolutePath;
    if (line) vscodeUrl += ':' + line;
    if (col) vscodeUrl += ':' + col;
    
    window.location.href = vscodeUrl;
    
    // Fallback message
    setTimeout(() => {
      console.log('Opening: ' + vscodeUrl);
      console.log('If file did not open, install VS Code or configure your IDE protocol handler');
    }, 500);
  };
  
})();
</script>
  `;
}
