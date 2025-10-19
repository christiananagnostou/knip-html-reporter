/**
 * Client-side JavaScript for interactive features
 * This code is embedded in the generated HTML report
 */
export function getInteractiveScript(): string {
  return `
<script>
(function() {
  'use strict';
  
  // State management
  let state = {
    searchQuery: '',
    activeFilters: new Set(),
    allIssueTypes: new Set()
  };
  
  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', function() {
    initializeFilters();
    initializeSearch();
    initializeCollapsible();
    collectIssueTypes();
  });
  
  /**
   * Collect all unique issue types from the page
   */
  function collectIssueTypes() {
    const issueTypeElements = document.querySelectorAll('.issue-type');
    issueTypeElements.forEach(el => {
      const heading = el.querySelector('h4');
      if (heading) {
        state.allIssueTypes.add(heading.textContent.trim());
      }
    });
  }
  
  /**
   * Initialize filter buttons
   */
  function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        const filterType = this.dataset.filter;
        
        if (filterType === 'all') {
          // Clear all filters
          state.activeFilters.clear();
          filterButtons.forEach(b => b.classList.remove('active'));
          this.classList.add('active');
        } else {
          // Toggle specific filter
          const allBtn = document.querySelector('[data-filter="all"]');
          allBtn?.classList.remove('active');
          
          if (state.activeFilters.has(filterType)) {
            state.activeFilters.delete(filterType);
            this.classList.remove('active');
          } else {
            state.activeFilters.add(filterType);
            this.classList.add('active');
          }
          
          // If no filters active, activate "All"
          if (state.activeFilters.size === 0) {
            allBtn?.classList.add('active');
          }
        }
        
        applyFiltersAndSearch();
      });
    });
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
        fileName.addEventListener('click', function() {
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
        
        // Check if this issue type matches search query
        const passesSearch = matchesSearch(issueType);
        
        if (passesFilter && passesSearch) {
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
   * Check if an element matches the search query
   */
  function matchesSearch(element) {
    if (!state.searchQuery) return true;
    
    const text = element.textContent.toLowerCase();
    return text.includes(state.searchQuery);
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
    // Try VS Code protocol
    const vscodeUrl = \`vscode://file/\${encodeURIComponent(filePath)}\${line ? ':' + line : ''}\${col ? ':' + col : ''}\`;
    window.location.href = vscodeUrl;
    
    // Fallback message
    setTimeout(() => {
      console.log('If file did not open, install VS Code or configure your IDE protocol handler');
    }, 1000);
  };
  
})();
</script>
  `
}
