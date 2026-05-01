import { toPane, fromPane, formatRupees } from '../lib/money';

describe('Money utilities', () => {
  describe('toPane', () => {
    it('converts rupees to paise accurately', () => {
      expect(toPane(1.1)).toBe(110);
      expect(toPane(250.50)).toBe(25050);
      expect(toPane(0)).toBe(0);
      expect(toPane(10)).toBe(1000);
    });
  });

  describe('fromPane', () => {
    it('converts paise to rupees accurately', () => {
      expect(fromPane(110)).toBe(1.1);
      expect(fromPane(25050)).toBe(250.5);
    });
  });

  describe('formatRupees', () => {
    it('formats numbers to Indian locale with 2 decimal places', () => {
      expect(formatRupees(1234567.50)).toBe('₹12,34,567.50');
      expect(formatRupees(250)).toBe('₹250.00');
    });
  });
});
