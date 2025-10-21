/**
 * Default CSS styles for the HTML report
 */
export function getDefaultStyles(): string {
  return /* css */ `
    /* ===== CSS Variables & Theme System ===== */
    :root {
      /* Light theme colors */
      --bg-primary: #ffffff;
      --bg-secondary: #fafafa;
      --bg-tertiary: #f5f5f5;
      --bg-hover: #f0f0f0;
      --bg-accent: #f9f9f9;
      
      --text-primary: #171717;
      --text-secondary: #525252;
      --text-tertiary: #737373;
      --text-quaternary: #a3a3a3;
      
      --border-primary: #e5e5e5;
      --border-secondary: #d4d4d4;
      --border-hover: #a3a3a3;
      
      --accent-primary: #0070f3;
      --accent-hover: #0761d1;
      --accent-light: #eef7ff;
      
      --error-primary: #e00;
      --error-light: #fee;
      --error-bg: #fef2f2;
      
      --success-primary: #0a8a0a;
      --success-light: #e6ffe6;
      --success-bg: #f0fdf4;
      
      --warning-primary: #f5a623;
      --warning-light: #fff7ed;
      --warning-bg: #fffbf5;
      
      --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04);
      
      --radius-sm: 6px;
      --radius-md: 8px;
      --radius-lg: 12px;
      
      --font-mono: ui-monospace, 'SF Mono', 'Cascadia Code', 'Roboto Mono', Menlo, monospace;
    }
    
    [data-theme="dark"] {
      --bg-primary: #0a0a0a;
      --bg-secondary: #111111;
      --bg-tertiary: #171717;
      --bg-hover: #1f1f1f;
      --bg-accent: #1a1a1a;
      
      --text-primary: #ededed;
      --text-secondary: #a3a3a3;
      --text-tertiary: #737373;
      --text-quaternary: #525252;
      
      --border-primary: #262626;
      --border-secondary: #333333;
      --border-hover: #525252;
      
      --accent-primary: #0a95ff;
      --accent-hover: #3b9eff;
      --accent-light: #0a2540;
      
      --error-primary: #ff4444;
      --error-light: #2a1515;
      --error-bg: #1a0f0f;
      
      --success-primary: #00d400;
      --success-light: #0d2a0d;
      --success-bg: #0a1f0a;
      
      --warning-primary: #ffb84d;
      --warning-light: #2a2015;
      --warning-bg: #1f1810;
      
      --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4);
    }
    
    /* ===== Base Styles ===== */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    html {
      scroll-behavior: smooth;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: var(--text-primary);
      background: var(--bg-secondary);
      padding: 0;
      margin: 0;
      transition: background-color 0.2s ease, color 0.2s ease;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    .container {
      max-width: 1280px;
      margin: 0 auto;
      background: var(--bg-primary);
      min-height: 100vh;
      transition: background-color 0.2s ease;
    }
    
    /* ===== Header ===== */
    header {
      border-bottom: 1px solid var(--border-primary);
      padding: 32px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--bg-primary);
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(12px);
      background-color: rgba(255, 255, 255, 0.8);
      transition: all 0.2s ease;
    }
    
    [data-theme="dark"] header {
      background-color: rgba(10, 10, 10, 0.8);
    }
    
    .header-content {
      flex: 1;
    }
    
    h1 {
      color: var(--text-primary);
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 4px;
      letter-spacing: -0.02em;
    }
    
    .timestamp {
      color: var(--text-tertiary);
      font-size: 0.875rem;
      font-weight: 400;
    }
    
    /* ===== Theme Toggle ===== */
    .theme-toggle {
      display: flex;
      align-items: center;
      gap: 4px;
      background: var(--bg-secondary);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-md);
      padding: 4px;
      transition: all 0.2s ease;
    }
    
    .theme-toggle-btn {
      background: transparent;
      border: none;
      color: var(--text-tertiary);
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.15s ease;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .theme-toggle-btn:hover {
      color: var(--text-primary);
      background: var(--bg-hover);
    }
    
    .theme-toggle-btn.active {
      background: var(--bg-primary);
      color: var(--text-primary);
      box-shadow: var(--shadow-sm);
    }
    
    .theme-icon {
      width: 16px;
      height: 16px;
    }
    
    /* ===== Typography ===== */
    h2 {
      color: var(--text-primary);
      font-size: 1.5rem;
      font-weight: 600;
      margin: 48px 0 24px;
      letter-spacing: -0.01em;
    }
    
    h3 {
      color: var(--text-primary);
      font-size: 0.9375rem;
      font-weight: 500;
      margin: 0;
      font-family: var(--font-mono);
    }
    
    h4 {
      color: var(--text-secondary);
      font-size: 0.8125rem;
      font-weight: 600;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    /* ===== Summary Section ===== */
    .summary {
      margin: 32px 40px;
      padding: 0;
      background: transparent;
      border: none;
      border-radius: 0;
    }
    
    .summary-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
      gap: 24px;
    }
    
    .summary-title h2 {
      margin: 0 0 4px 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    
    .summary-subtitle {
      margin: 0;
      font-size: 0.875rem;
      color: var(--text-tertiary);
      font-weight: 400;
    }
    
    .summary-total-badge {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 20px;
      background: linear-gradient(135deg, var(--accent-primary), var(--accent-hover));
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-md);
    }
    
    .summary-total-count {
      font-size: 1.5rem;
      font-weight: 800;
      color: white;
      line-height: 1;
      font-variant-numeric: tabular-nums;
    }
    
    .summary-total-label {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.9);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      line-height: 1.2;
    }
    
    .summary h2 {
      margin-top: 0;
      margin-bottom: 20px;
    }
    
    .success-state {
      text-align: center;
      padding: 60px 40px;
      background: var(--success-bg);
      border: 1px solid var(--success-primary);
      border-radius: var(--radius-lg);
    }
    
    .success-icon {
      width: 64px;
      height: 64px;
      color: var(--success-primary);
      margin: 0 auto 24px;
    }
    
    .success-state h2 {
      color: var(--text-primary);
      margin: 0 0 8px;
      font-size: 1.75rem;
    }
    
    .success-state p {
      color: var(--text-secondary);
      margin: 0;
      font-size: 1rem;
    }
    
    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }
    
    .summary-card {
      background: var(--bg-primary);
      padding: 18px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-primary);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      cursor: pointer;
      user-select: none;
    }
    
    .summary-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--accent-primary), var(--accent-hover));
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    
    .summary-card:hover {
      border-color: var(--border-hover);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
    
    .summary-card:hover::before {
      opacity: 1;
    }
    
    .summary-card:active {
      transform: translateY(-1px);
    }
    
    .summary-card.active {
      border-color: var(--accent-primary);
      background: var(--accent-light);
      box-shadow: var(--shadow-md);
    }
    
    .summary-card.active::before {
      opacity: 1;
    }
    
    .summary-card:focus-visible {
      outline: 2px solid var(--accent-primary);
      outline-offset: 2px;
    }
    
    .summary-card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }
    
    .summary-card-info {
      flex: 1;
      min-width: 0;
    }
    
    .summary-card-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
      font-weight: 500;
      margin-bottom: 4px;
    }
    
    .summary-card-description {
      font-size: 0.75rem;
      color: var(--text-tertiary);
      font-weight: 400;
      margin-bottom: 8px;
      line-height: 1.3;
    }
    
    .summary-card-count {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1;
      font-variant-numeric: tabular-nums;
    }
    
    .summary-card-bar {
      height: 6px;
      background: var(--bg-tertiary);
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 8px;
    }
    
    .summary-card-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent-primary), var(--accent-hover));
      border-radius: 3px;
      transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .summary-card-percentage {
      font-size: 0.75rem;
      color: var(--text-tertiary);
      font-weight: 600;
      text-align: right;
      font-variant-numeric: tabular-nums;
    }
    
    /* ===== Controls: Search and Filters ===== */
    .controls {
      background: transparent;
      padding: 24px 40px;
      margin: 0;
      border-radius: 0;
      border-bottom: 1px solid var(--border-primary);
      box-shadow: none;
    }
    
    .search-container {
      position: relative;
      margin-bottom: 16px;
    }
    
    #search-input {
      width: 100%;
      padding: 10px 40px 10px 16px;
      font-size: 0.9375rem;
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-md);
      background: var(--bg-primary);
      color: var(--text-primary);
      transition: all 0.15s ease;
      font-family: inherit;
    }
    
    #search-input::placeholder {
      color: var(--text-quaternary);
    }
    
    #search-input:focus {
      outline: none;
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 3px var(--accent-light);
    }
    
    #clear-search {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      font-size: 1.25rem;
      color: var(--text-quaternary);
      cursor: pointer;
      padding: 4px 8px;
      line-height: 1;
      border-radius: 4px;
      transition: all 0.15s ease;
    }
    
    #clear-search:hover {
      color: var(--text-primary);
      background: var(--bg-hover);
    }
    
    /* ===== Issues Section ===== */
    .issues-section {
      padding: 32px 40px 80px;
    }
    
    .issues-section h2 {
      margin-top: 0;
    }
    
    .category-section {
      margin: 32px 0;
      padding: 0;
      background: transparent;
      border-radius: 0;
      border: none;
      border-top: 1px solid var(--border-primary);
      padding-top: 32px;
    }
    
    .category-section:first-of-type {
      border-top: none;
      padding-top: 0;
    }
    
    .category-header {
      margin-bottom: 20px;
    }
    
    .category-header h3 {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
    }
    
    .category-description {
      color: var(--text-secondary);
      font-size: 0.9375rem;
      margin: 0;
    }
    
    .issue-badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 0.8125rem;
      font-weight: 600;
      background: var(--error-bg);
      color: var(--error-primary);
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    
    .issue-count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 600;
      background: var(--bg-tertiary);
      color: var(--text-secondary);
      min-width: 32px;
    }
    
    /* ===== Table Styles ===== */
    .table-container {
      overflow-x: auto;
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-md);
      background: var(--bg-secondary);
    }
    
    .issues-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
    }
    
    .issues-table thead {
      background: var(--bg-tertiary);
      border-bottom: 1px solid var(--border-primary);
    }
    
    .issues-table th {
      text-align: left;
      padding: 12px 16px;
      font-weight: 600;
      color: var(--text-secondary);
      font-size: 0.8125rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      white-space: nowrap;
    }
    
    .issues-table tbody tr {
      border-bottom: 1px solid var(--border-primary);
      transition: background 0.15s ease;
    }
    
    .issues-table tbody tr:last-child {
      border-bottom: none;
    }
    
    .issues-table tbody tr:hover {
      background: var(--bg-hover);
    }
    
    .issues-table td {
      padding: 12px 16px;
      color: var(--text-primary);
      vertical-align: middle;
    }
    
    .issue-name {
      font-family: var(--font-mono);
      font-weight: 500;
    }
    
    .issue-name .symbol {
      color: var(--text-primary);
      overflow: hidden;
      text-overflow: ellipsis;
      display: block;
      max-width: 400px;
    }
    
    .issue-location {
      font-family: var(--font-mono);
      min-width: 200px;
    }
    
    .location-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .file-path {
      color: var(--text-secondary);
      font-size: 0.8125rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .position {
      color: var(--text-tertiary);
      font-size: 0.75rem;
      font-weight: 400;
      font-variant-numeric: tabular-nums;
    }
    
    .issue-actions {
      width: 60px;
      text-align: center;
    }
    
    /* ===== IDE Buttons ===== */
    .ide-btn {
      background: transparent;
      color: var(--text-tertiary);
      border: 1px solid var(--border-primary);
      padding: 6px 10px;
      border-radius: var(--radius-sm);
      cursor: pointer;
      font-size: 0.8125rem;
      margin-left: 0;
      transition: all 0.15s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      vertical-align: middle;
      font-weight: 500;
    }
    
    .ide-btn:hover {
      background: var(--bg-hover);
      color: var(--text-primary);
      border-color: var(--border-hover);
    }
    
    .ide-btn svg {
      width: 14px;
      height: 14px;
    }
    
    .ide-btn-inline {
      background: transparent;
      border: none;
      color: var(--text-tertiary);
      cursor: pointer;
      font-size: 0.875rem;
      padding: 4px 8px;
      border-radius: var(--radius-sm);
      transition: all 0.15s ease;
      flex-shrink: 0;
    }
    
    .ide-btn-inline:hover {
      background: var(--accent-light);
      color: var(--accent-primary);
    }
    
    /* ===== No results message ===== */
    .no-results {
      text-align: center;
      padding: 80px 40px;
      color: var(--text-tertiary);
      font-size: 0.9375rem;
    }
    
    .no-results p {
      margin: 0;
    }
    
    /* ===== Responsive Design ===== */
    @media (max-width: 768px) {
      header {
        padding: 24px 20px;
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }
      
      .theme-toggle {
        align-self: stretch;
      }
      
      .theme-toggle-btn span {
        display: none;
      }
      
      .theme-toggle-btn {
        flex: 1;
        justify-content: center;
      }
      
      h1 {
        font-size: 1.5rem;
      }
      
      .summary {
        margin: 24px 20px;
      }
      
      .summary-header {
        flex-direction: column;
        gap: 16px;
      }
      
      .summary-total-badge {
        align-self: stretch;
        justify-content: center;
      }
      
      .summary-cards {
        grid-template-columns: 1fr;
      }
      
      .summary-grid {
        grid-template-columns: 1fr;
      }
      
      .controls {
        padding: 20px;
      }
      
      .issues-section {
        padding: 24px 20px 60px;
      }
      
      .category-header h3 {
        font-size: 1.125rem;
      }
      
      .issues-table {
        font-size: 0.8125rem;
      }
      
      .issues-table th,
      .issues-table td {
        padding: 10px 12px;
      }
      
      .issue-name .symbol {
        max-width: 200px;
      }
      
      .issue-location {
        min-width: 150px;
      }
      
      .file-path {
        font-size: 0.75rem;
      }
      
      .issue-actions {
        width: 50px;
      }
      
      .ide-btn-inline {
        padding: 4px 6px;
      }
    }
    
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  `
}
