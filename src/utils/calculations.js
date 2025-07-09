/**
 * Safe mathematical expression parser
 * Replaces dangerous eval() usage with a safe calculation function
 */

// Safe mathematical operations
const safeOperators = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => b !== 0 ? a / b : 0,
  'x': (a, b) => a * b, // Common dimension separator
  'X': (a, b) => a * b, // Case insensitive
};

/**
 * Safely evaluates a mathematical expression
 * @param {string} expression - The expression to evaluate
 * @returns {number} - The result of the calculation
 */
export const safeEvaluate = (expression) => {
  if (!expression || typeof expression !== 'string') {
    return 0;
  }

  try {
    // Clean the expression
    let cleanExpression = expression
      .toLowerCase()
      .replace(/\s+/g, '') // Remove whitespace
      .replace(/[^0-9+\-*/.x]/g, ''); // Only allow numbers and safe operators

    // Replace 'x' with '*' for multiplication
    cleanExpression = cleanExpression.replace(/x/g, '*');

    // Simple validation - only allow safe characters
    if (!/^[0-9+\-*/.()\s]+$/.test(cleanExpression)) {
      return 0;
    }

    // Use Function constructor instead of eval (still safer)
    const result = new Function('return ' + cleanExpression)();
    
    return isNaN(result) || !isFinite(result) ? 0 : Number(result);
  } catch (error) {
    console.warn('Safe evaluation failed:', error);
    return 0;
  }
};

/**
 * Calculates total amount based on rate and dimension
 * @param {number|string} rate - The rate per unit
 * @param {string} dimension - The dimension expression
 * @returns {number} - The calculated total
 */
export const calculateTotal = (rate, dimension) => {
  const rateNum = Number(rate) || 0;
  const dimensionValue = safeEvaluate(dimension);
  return rateNum * dimensionValue;
};

/**
 * Formats number to Indian locale
 * @param {number} value - The number to format
 * @returns {string} - Formatted number string
 */
export const formatIndianCurrency = (value) => {
  const num = Number(value) || 0;
  return num.toLocaleString('en-IN');
};

/**
 * Calculates bill totals
 * @param {Array} billItems - Array of bill items
 * @returns {Object} - Object containing subtotal, advance, and balance
 */
export const calculateBillTotals = (billItems, advanceTotal = 0) => {
  const subtotal = billItems.reduce((sum, item) => {
    return sum + (Number(item.total) || 0);
  }, 0);

  const advance = Number(advanceTotal) || 0;
  const balance = subtotal - advance;

  return {
    subtotal,
    advance,
    balance,
    formattedSubtotal: formatIndianCurrency(subtotal),
    formattedAdvance: formatIndianCurrency(advance),
    formattedBalance: formatIndianCurrency(balance)
  };
}; 