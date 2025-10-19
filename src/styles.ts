/**
 * Default CSS styles for the HTML report
 */
export function getDefaultStyles(): string {
  return `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      padding: 20px;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    header {
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    
    h1 {
      color: #2c3e50;
      font-size: 2.5rem;
      margin-bottom: 10px;
    }
    
    .timestamp {
      color: #7f8c8d;
      font-size: 0.9rem;
    }
    
    h2 {
      color: #34495e;
      font-size: 1.8rem;
      margin: 30px 0 20px;
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 10px;
    }
    
    h3 {
      color: #2c3e50;
      font-size: 1.3rem;
      margin: 25px 0 15px;
    }
    
    h4 {
      color: #555;
      font-size: 1.1rem;
      margin: 15px 0 10px;
    }
    
    .summary {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    
    .summary.success {
      background: #d4edda;
      border-left-color: #28a745;
    }
    
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin: 20px 0;
    }
    
    .summary-item {
      background: white;
      padding: 15px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .summary-item .count {
      font-size: 2rem;
      font-weight: bold;
      color: #e74c3c;
      min-width: 50px;
    }
    
    .summary-item .label {
      color: #555;
      font-size: 0.9rem;
    }
    
    .total {
      text-align: right;
      font-size: 1.2rem;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #ddd;
    }
    
    .file-section {
      margin: 30px 0;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 4px;
      border-left: 4px solid #3498db;
    }
    
    .file-name {
      font-family: 'Courier New', monospace;
      color: #2c3e50;
      background: white;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 15px;
    }
    
    .issue-type {
      margin: 15px 0;
      padding: 15px;
      background: white;
      border-radius: 4px;
    }
    
    .issue-type h4 {
      color: #e74c3c;
      margin-bottom: 10px;
    }
    
    ul {
      list-style: none;
      padding-left: 0;
    }
    
    li {
      padding: 8px 12px;
      margin: 4px 0;
      background: #f8f9fa;
      border-left: 3px solid #e74c3c;
      border-radius: 2px;
      font-family: 'Courier New', monospace;
      font-size: 0.9rem;
    }
    
    .location {
      color: #7f8c8d;
      font-size: 0.85rem;
    }
    
    .sub-section {
      margin: 10px 0;
      padding-left: 15px;
    }
    
    .sub-section strong {
      display: block;
      margin-bottom: 5px;
      color: #555;
    }
    
    /* Controls: Search and Filters */
    .controls {
      background: white;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .search-container {
      position: relative;
      margin-bottom: 20px;
    }
    
    #search-input {
      width: 100%;
      padding: 12px 40px 12px 16px;
      font-size: 1rem;
      border: 2px solid #e0e0e0;
      border-radius: 4px;
      transition: border-color 0.2s;
    }
    
    #search-input:focus {
      outline: none;
      border-color: #3498db;
    }
    
    #clear-search {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      font-size: 1.5rem;
      color: #7f8c8d;
      cursor: pointer;
      padding: 0 8px;
      line-height: 1;
    }
    
    #clear-search:hover {
      color: #e74c3c;
    }
    
    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      align-items: center;
    }
    
    .filter-label {
      font-weight: 600;
      color: #555;
      margin-right: 5px;
    }
    
    .filter-btn {
      padding: 8px 16px;
      border: 2px solid #e0e0e0;
      background: white;
      border-radius: 20px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s;
      text-transform: capitalize;
    }
    
    .filter-btn:hover {
      border-color: #3498db;
      background: #f0f8ff;
    }
    
    .filter-btn.active {
      background: #3498db;
      color: white;
      border-color: #3498db;
    }
    
    /* IDE Buttons */
    .ide-btn {
      background: #3498db;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.85rem;
      margin-left: 10px;
      transition: background 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      vertical-align: middle;
    }
    
    .ide-btn:hover {
      background: #2980b9;
    }
    
    .ide-btn svg {
      width: 16px;
      height: 16px;
    }
    
    .ide-btn-inline {
      background: none;
      border: none;
      color: #3498db;
      cursor: pointer;
      font-size: 1rem;
      margin-left: 8px;
      padding: 2px 6px;
      border-radius: 3px;
      transition: all 0.2s;
    }
    
    .ide-btn-inline:hover {
      background: #3498db;
      color: white;
    }
    
    /* Collapsible file sections */
    .file-section.collapsed .issue-type {
      display: none;
    }
    
    .file-name {
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      user-select: none;
    }
    
    .file-name:hover {
      background: #f0f0f0;
    }
    
    /* No results message */
    .no-results {
      text-align: center;
      padding: 40px;
      color: #7f8c8d;
      font-size: 1.1rem;
    }
    
    .no-results p {
      margin: 0;
    }
    
    @media (max-width: 768px) {
      body {
        padding: 10px;
      }
      
      .container {
        padding: 20px;
      }
      
      h1 {
        font-size: 2rem;
      }
      
      .summary-grid {
        grid-template-columns: 1fr;
      }
      
      .filters {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .file-name {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }
      
      .ide-btn {
        margin-left: 0;
        align-self: flex-start;
      }
    }
  `
}
