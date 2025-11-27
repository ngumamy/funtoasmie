/**
 * Tests pour les fonctions utilitaires
 */

describe('Utility Functions Tests', () => {
  describe('Object utilities', () => {
    const isEmpty = (obj) => {
      return Object.keys(obj).length === 0;
    };

    it('should detect empty objects', () => {
      expect(isEmpty({})).toBe(true);
      expect(isEmpty({ key: 'value' })).toBe(false);
    });
  });

  describe('Array utilities', () => {
    const removeDuplicates = (arr) => {
      return [...new Set(arr)];
    };

    it('should remove duplicate values', () => {
      expect(removeDuplicates([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
      expect(removeDuplicates(['a', 'b', 'a'])).toEqual(['a', 'b']);
    });
  });

  describe('String utilities', () => {
    const capitalize = (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const slugify = (str) => {
      return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    };

    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('WORLD')).toBe('WORLD');
    });

    it('should convert to slug format', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Hello-World 123')).toBe('hello-world-123');
    });
  });
});
