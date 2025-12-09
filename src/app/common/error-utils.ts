/**
 * Utility functions for safe error handling
 */
export class ErrorUtils {
  
  /**
   * Safely extracts error message from various error response formats
   * @param error - The error object from HTTP response
   * @returns A safe error message string
   */
  static extractErrorMessage(error: any): string {
    if (!error) {
      return 'An unknown error occurred';
    }

    // Try different possible error message paths
    const errorMessage = error?.error?.message || 
                        error?.error?.error?.message || 
                        error?.error || 
                        error?.message || 
                        error?.statusText ||
                        (typeof error === 'string' ? error : '');

    if (typeof errorMessage === 'string' && errorMessage.trim()) {
      return errorMessage.trim();
    }

    // If error is an object, try to stringify it
    if (typeof error === 'object') {
      try {
        const jsonError = JSON.stringify(error);
        if (jsonError && jsonError !== '{}') {
          return jsonError;
        }
      } catch (e) {
        // Ignore JSON stringify errors
      }
    }

    return 'An error occurred while processing your request';
  }

  /**
   * Checks if an error indicates session expiry
   * @param error - The error object
   * @returns true if the error indicates session expiry
   */
  static isSessionExpiredError(error: any): boolean {
    const errorMessage = this.extractErrorMessage(error);
    const lowerText = errorMessage.toLowerCase();
    
    return lowerText.includes("invalid session or session expired") ||
           lowerText.includes("invalid session") || 
           lowerText.includes("session expired") ||
           lowerText.includes("session invalid") ||
           lowerText.includes("expired session") ||
           lowerText.includes("one or more errors occurred. (invalid session or session expired)");
  }
}
