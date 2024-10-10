import isValidNote from '../../../app/validation/noteValidator';

describe('isValidNote', () => {
    it('should return true for a valid note', () => {
        const validNote = { name: 'Note Title', description: 'Note Description' };
        expect(isValidNote(validNote)).toBe(true);
    });

    it('should return false if name is missing', () => {
        const invalidNote = { name: '', description: 'Note Description' };
        expect(isValidNote(invalidNote)).toBe(false);
    });

    it('should return false if description is missing', () => {
        const invalidNote = { name: 'Note Title', description: '' };
        expect(isValidNote(invalidNote)).toBe(false);
    });

    it('should return false if both name and description are missing', () => {
        const invalidNote = { name: '', description: '' };
        expect(isValidNote(invalidNote)).toBe(false);
    });
});