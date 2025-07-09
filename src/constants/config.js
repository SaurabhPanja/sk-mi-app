/**
 * Application constants and configuration
 */

export const APP_CONFIG = {
  COMPANY_NAME: 'S K Maidul Islam',
  COMPANY_ADDRESS: 'D 27 Abdullah Park, Nadiad',
  COMPANY_PHONE: '9898832796',
  COMPANY_EMAIL: 'skmaidulsk@gmail.com',
  CURRENCY_SYMBOL: '₹',
  MAX_ITEMS_PER_PAGE: 25,
  MAX_LABOUR_CHARGES_PER_PAGE: 32,
};

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV;

export const PANEL_URLS = {
  NEW_PANEL: isDevelopment 
    ? '/api/google-script/macros/echo?user_content_key=5Rl60qFjHih-wXiqLkEREf0zR7iUrXOZIYAHaQyge0rtkSlWMR_cXoiBZyR8M_ORAq-zh4JXaiqhpqXFHiEkZC8l4onhOF9wm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnI24BgTL3TIa7aIWGNPfWVyHQVgGhdWUK0HUJdkLZuc7VXxrLrPDSl-vRWVp-vXHaHKW3DzNbCkc24VxfAY1c6KzuUIWwi2m9A&lib=Mzmx6W9F8y-HD-Fdgh0tAcmZ55HFYViQD'
    : 'https://script.googleusercontent.com/macros/echo?user_content_key=5Rl60qFjHih-wXiqLkEREf0zR7iUrXOZIYAHaQyge0rtkSlWMR_cXoiBZyR8M_ORAq-zh4JXaiqhpqXFHiEkZC8l4onhOF9wm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnI24BgTL3TIa7aIWGNPfWVyHQVgGhdWUK0HUJdkLZuc7VXxrLrPDSl-vRWVp-vXHaHKW3DzNbCkc24VxfAY1c6KzuUIWwi2m9A&lib=Mzmx6W9F8y-HD-Fdgh0tAcmZ55HFYViQD',
  OLD_PANEL: isDevelopment
    ? '/api/google-script/macros/s/AKfycbxD9TeEyPyA1Hr6-6yXDnpuQkZAYNzbsvN3WIwChmSLpdNFQA68WnGa4jpBZq5dvCa_Og/exec'
    : 'https://script.google.com/macros/s/AKfycbxD9TeEyPyA1Hr6-6yXDnpuQkZAYNzbsvN3WIwChmSLpdNFQA68WnGa4jpBZq5dvCa_Og/exec',
};

export const SPREADSHEET_URLS = {
  NEW_PANEL: 'https://docs.google.com/spreadsheets/d/1N9Q7pTWpTSUBjuKpiCdhQN7HBcwM0f0_ry3UC9kNUAA/edit?usp=sharing',
  OLD_PANEL: 'https://docs.google.com/spreadsheets/d/1Qr1rcwtGwDfMz2TTXxCQaZE7RFPpycKLGGWFy5d3tzE/edit?usp=sharing',
};

export const STORAGE_KEYS = {
  FORM_DATA: 'formData',
  BILL_DATA: 'bill',
};

export const VALIDATION_MESSAGES = {
  DIMENSION_ERROR: 'Dimension provided is wrong! Please check again!',
  REQUIRED_FIELD: 'This field is required',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_EMAIL: 'Please enter a valid email address',
};

export const PDF_STYLES = {
  PRIMARY_COLOR: '#00BFFE',
  SECONDARY_COLOR: '#ddd',
  FONT_FAMILY: 'opensans',
  FONT_SIZE: '12px',
  PAGE_PADDING: '20px',
}; 