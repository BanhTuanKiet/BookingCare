/**
 * Utility functions for date formatting and manipulation
 */

/**
 * Format a date string to locale format (DD/MM/YYYY)
 * @param {string} dateString - Input date string
 * @returns {string} Formatted date string
 */
export const formatDateToLocale = (dateString) => {
    const date = new Date(dateString);
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };
  
  /**
   * Format a date string to ISO format (YYYY-MM-DD)
   * @param {string} dateString - Input date string
   * @returns {string} Formatted date string in ISO format
   */
  export const formatDateToISO = (dateString) => {
    const date = new Date(dateString);
    
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };
  
  /**
   * Convert a date string from DD/MM/YYYY format to YYYY-MM-DD format
   * @param {string} dateString - Date string in DD/MM/YYYY format
   * @returns {string} Date string in YYYY-MM-DD format
   */
  export const convertDateDMYtoYMD = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };
  
  /**
   * Convert a date string from YYYY-MM-DD format to DD/MM/YYYY format
   * @param {string} dateString - Date string in YYYY-MM-DD format
   * @returns {string} Date string in DD/MM/YYYY format
   */
  export const convertDateYMDtoDMY = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };
  
  /**
   * Extract only the date part from a datetime string
   * @param {string} dateTimeString - Input datetime string
   * @returns {string} Date part in DD/MM/YYYY format
   */
  export const extractDateOnly = (dateTimeString) => {
    const date = new Date(dateTimeString);
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };
  
  /**
   * Get today's date in DD/MM/YYYY format
   * @returns {string} Today's date in DD/MM/YYYY format
   */
  export const getTodayFormatted = () => {
    const today = new Date();
    
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    
    return `${day}/${month}/${year}`;
  };
  
  /**
   * Parse a date string from various formats
   * @param {string} rawDate - Raw date string (can be DD/MM/YYYY or other formats)
   * @returns {object} Object with day, month, year as properties
   */
  export const parseDateString = (rawDate) => {
    // Try to detect format and parse accordingly
    let day, month, year;
    
    if (rawDate.includes('/')) {
      // Format like DD/MM/YYYY
      [day, month, year] = rawDate.split('/');
    } else if (rawDate.includes('-')) {
      // Format like YYYY-MM-DD
      [year, month, day] = rawDate.split('-');
    } else {
      // Fallback to current date
      const today = new Date();
      day = today.getDate();
      month = today.getMonth() + 1;
      year = today.getFullYear();
    }
    
    return {
      day: day.padStart(2, '0'),
      month: month.padStart(2, '0'),
      year
    };
  };