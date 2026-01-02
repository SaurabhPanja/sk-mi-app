// Vendor/Company Configuration
// Configuration values are loaded from environment variables (.env file)
// In Vite, environment variables must be prefixed with VITE_ to be exposed to client code

export const vendorConfig = {
  // Company Information
  companyName: import.meta.env.VITE_COMPANY_NAME || "Saurabh Panja",
  companyShortName: import.meta.env.VITE_COMPANY_SHORT_NAME || "Saurabh Panja",
  address: import.meta.env.VITE_COMPANY_ADDRESS || "Bhavasarvad nadiad",
  phone: import.meta.env.VITE_COMPANY_PHONE || "8320002569",
  email: import.meta.env.VITE_COMPANY_EMAIL || "panjasaurabh@gmail.com",
  
  // UI Configuration
  themeColor: import.meta.env.VITE_THEME_COLOR || "#B19CD9",
  brandColor: import.meta.env.VITE_BRAND_COLOR || "#dc3545", // Bootstrap danger color used for navbar brand
  
  // Panel Configuration
  panelUrl: import.meta.env.VITE_PANEL_URL || "https://script.google.com/macros/s/AKfycbzp62nTyHgZ-Lnmg1Tammy6XZTFfY0h-5dyw2u9mWxl8vSiDAZ-k2V4FmhvKHLAcSo6/exec",
  panelSheetUrl: import.meta.env.VITE_PANEL_SHEET_URL || "https://docs.google.com/spreadsheets/d/1v65zPdjREGdZ5Yq5Mxn3y2LiuxQ_RhzCCZ7UF1Sr9yk/edit?usp=sharing",
  
  // Application Info
  appDescription: import.meta.env.VITE_APP_DESCRIPTION || "Bill Management Application",
  
  // Database Configuration
  tableName: import.meta.env.VITE_SUPABASE_TABLE_NAME || "histories_new"
};

