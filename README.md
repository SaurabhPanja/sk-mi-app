# SK Maidul Islam - Invoice Management System

A modern, maintainable React application for managing invoices and labour charges with PDF generation capabilities.

## 🚀 Features

- **Invoice Management**: Create and manage customer invoices with itemized billing
- **Labour Charges Panel**: Download and use labour charges from Google Sheets
- **PDF Generation**: Generate professional invoices and labour charge sheets
- **History Management**: Save and retrieve invoice history with search functionality
- **Responsive Design**: Modern UI that works on desktop and mobile devices
- **Real-time Calculations**: Automatic calculation of totals, advances, and balances
- **Data Persistence**: Local storage for form data and Supabase for history

## 🛠️ Technical Improvements

### Security Fixes
- **Replaced `eval()` with safe calculation functions** - Eliminated major security vulnerability
- **Input validation** - Added proper validation for all user inputs
- **Error handling** - Comprehensive error handling throughout the application

### Code Organization
- **Modular Components**: Separated concerns into reusable components
- **Custom Hooks**: Created `useLocalStorage` and `useSupabase` hooks for better state management
- **Constants Management**: Centralized configuration in `constants/config.js`
- **Utility Functions**: Safe mathematical calculations in `utils/calculations.js`

### Performance Optimizations
- **Memoized callbacks** using `useCallback` to prevent unnecessary re-renders
- **Optimized state updates** with proper dependency arrays
- **Lazy loading** for PDF components
- **Error boundaries** and loading states

### Accessibility Improvements
- **ARIA labels** for all interactive elements
- **Keyboard navigation** support
- **Screen reader** compatibility
- **Focus management** for modals and forms

### UI/UX Enhancements
- **Modern Design**: Clean, professional interface with consistent styling
- **Responsive Layout**: Works seamlessly on all device sizes
- **Loading States**: Clear feedback during async operations
- **Error Messages**: User-friendly error handling with auto-dismiss
- **Dark Mode Support**: Automatic dark mode detection
- **Animations**: Smooth transitions and hover effects

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx
│   ├── CustomerForm.jsx
│   ├── BillTable.jsx
│   ├── AddItemModal.jsx
│   └── ConfirmationModal.jsx
├── hooks/              # Custom React hooks
│   ├── useLocalStorage.js
│   └── useSupabase.js
├── utils/              # Utility functions
│   └── calculations.js
├── constants/          # Configuration constants
│   └── config.js
├── App.jsx            # Main application component
├── History.jsx        # History management component
├── InvoicePdf.jsx     # PDF generation for invoices
├── LabourChargesPdf.jsx # PDF generation for labour charges
└── Loader.jsx         # Loading component
```

## 🔧 Key Components

### `App.jsx`
- Main application logic with improved state management
- Error handling and loading states
- Modular component composition

### `utils/calculations.js`
- Safe mathematical expression evaluation
- Currency formatting for Indian locale
- Bill total calculations

### `hooks/useLocalStorage.js`
- Persistent state management
- Cross-tab synchronization
- Error handling for storage operations

### `hooks/useSupabase.js`
- Centralized database operations
- Consistent error handling
- Loading state management

## 🎨 Design System

- **Color Scheme**: Professional blue theme with consistent branding
- **Typography**: Modern, readable fonts with proper hierarchy
- **Spacing**: Consistent padding and margins throughout
- **Shadows**: Subtle depth with CSS custom properties
- **Animations**: Smooth transitions for better user experience

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env` file with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_KEY=your_supabase_key
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## 🔒 Security Features

- **Safe Calculations**: No more `eval()` usage
- **Input Sanitization**: All user inputs are properly validated
- **Error Boundaries**: Graceful error handling
- **Secure Storage**: Safe localStorage operations

## 📱 Responsive Design

- **Mobile-first approach**
- **Touch-friendly interfaces**
- **Optimized for all screen sizes**
- **Progressive enhancement**

## 🎯 Best Practices Implemented

- **Component Composition**: Small, focused components
- **Custom Hooks**: Reusable logic extraction
- **Error Handling**: Comprehensive error management
- **Performance**: Optimized re-renders and calculations
- **Accessibility**: WCAG compliant design
- **Type Safety**: Proper prop validation
- **Code Splitting**: Modular architecture

## 🔄 Migration Notes

The codebase has been completely refactored for better maintainability:

- **Breaking Changes**: Some component APIs have changed
- **New Dependencies**: Added utility functions and hooks
- **Configuration**: Moved hardcoded values to constants
- **Styling**: Updated CSS with modern design system

## 🤝 Contributing

1. Follow the established code structure
2. Use the provided utility functions
3. Maintain accessibility standards
4. Test thoroughly before submitting
5. Update documentation as needed

## 📄 License

This project is licensed under the MIT License.
