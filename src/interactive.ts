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
    initializeCollapsible();
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
    const issueTypeElements = document.querySelectorAll('.issue-type');
    issueTypeElements.forEach(el => {
      const heading = el.querySelector('h4');
      if (heading) state.allIssueTypes.add(heading.textContent.trim());
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
   * Initialize collapsible sections
   */
  function initializeCollapsible() {
    const fileSections = document.querySelectorAll('.file-section');
    
    fileSections.forEach(section => {
      const fileName = section.querySelector('.file-name');
      if (fileName) {
        fileName.style.cursor = 'pointer';
        fileName.addEventListener('click', function(e) {
          section.classList.toggle('collapsed');
        });
      }
    });
  }
  
  /**
   * Apply both filters and search
   */
  function applyFiltersAndSearch() {
    const fileSections = document.querySelectorAll('.file-section');
    let visibleSections = 0;
    
    fileSections.forEach(section => {
      let sectionVisible = false;
      const issueTypes = section.querySelectorAll('.issue-type');
      
      issueTypes.forEach(issueType => {
        const heading = issueType.querySelector('h4');
        const issueTypeName = heading ? heading.textContent.trim() : '';
        
        // Check if this issue type should be visible based on filters
        const passesFilter = state.activeFilters.size === 0 || 
                            state.activeFilters.has(issueTypeName.toLowerCase());
        
        if (!passesFilter) {
          issueType.style.display = 'none';
          return;
        }
        
        // If no search query, show the entire issue type
        if (!state.searchQuery) {
          issueType.style.display = 'block';
          sectionVisible = true;
          // Reset all list items to visible
          const items = issueType.querySelectorAll('li');
          items.forEach(item => item.style.display = '');
          return;
        }
        
        // Search at the individual issue (list item) level
        const items = issueType.querySelectorAll('li');
        let visibleItemsCount = 0;
        
        items.forEach(item => {
          if (itemMatchesSearch(item)) {
            item.style.display = '';
            visibleItemsCount++;
          } else {
            item.style.display = 'none';
          }
        });
        
        // Show issue type if it has visible items
        if (visibleItemsCount > 0) {
          issueType.style.display = 'block';
          sectionVisible = true;
        } else {
          issueType.style.display = 'none';
        }
      });
      
      // Show/hide entire file section
      if (sectionVisible) {
        section.style.display = 'block';
        section.classList.remove('collapsed');
        visibleSections++;
      } else {
        section.style.display = 'none';
      }
    });
    
    // Update no results message
    updateNoResultsMessage(visibleSections);
  }
  
  /**
   * Check if a list item matches the search query
   */
  function itemMatchesSearch(item) {
    if (!state.searchQuery) return true;
    
    // Get all searchable text from the item
    const symbol = item.querySelector('.symbol')?.textContent || '';
    const position = item.querySelector('.position')?.textContent || '';
    
    // Get file path from parent section
    const fileSection = item.closest('.file-section');
    const filePath = fileSection?.querySelector('.file-name span')?.textContent || '';
    
    // Combine all searchable fields
    const searchableText = (symbol + ' ' + position + ' ' + filePath).toLowerCase();
    
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
  `
}
