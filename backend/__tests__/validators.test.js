/**
 * Tests pour les validateurs
 */

describe('Validators Tests', () => {
  describe('Email validation', () => {
    const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    it('should validate correct email format', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('test.user@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email format', () => {
      expect(validateEmail('invalid.email')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
    });
  });

  describe('Phone validation', () => {
    const validatePhone = (phone) => {
      const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s]?[0-9]{3}[-\s]?[0-9]{4,6}$/;
      return phoneRegex.test(phone.replace(/\s/g, ''));
    };

    it('should validate correct phone format', () => {
      expect(validatePhone('123-456-7890')).toBe(true);
      expect(validatePhone('+1 (123) 456-7890')).toBe(true);
    });

    it('should reject invalid phone format', () => {
      expect(validatePhone('123')).toBe(false);
      expect(validatePhone('abc-def-ghij')).toBe(false);
    });
  });

  describe('Date validation', () => {
    const validateDate = (dateStr) => {
      const date = new Date(dateStr);
      return date instanceof Date && !isNaN(date);
    };

    it('should validate correct date format', () => {
      expect(validateDate('2024-01-15')).toBe(true);
      expect(validateDate('2024-12-31')).toBe(true);
    });

    it('should reject invalid date format', () => {
      expect(validateDate('invalid-date')).toBe(false);
      expect(validateDate('2024-13-45')).toBe(false);
    });
  });
});
