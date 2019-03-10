const path = require('path');
const { NlpManager, NlpRosieReader } = require('../../lib');

const rosiePath = path.join(__dirname, '../../../rosie/lib');

describe('NLP Manager', () => {
  describe('Add Rosie entities', () => {
    test('path not pass as argument', () => {
      const manager = new NlpManager();
      const reader = new NlpRosieReader(manager);
      expect(() => reader.loadNamedEntities(undefined)).toThrow(
        'Path must be defined'
      );
    });
    test('wrong path', () => {
      const manager = new NlpManager();
      const reader = new NlpRosieReader(manager);
      expect(() => reader.loadNamedEntities('/kdfkg/')).toThrow(
        'Path does not exist'
      );
    });
    test('adding entities', async () => {
      const manager = new NlpManager();
      const reader = new NlpRosieReader(manager);
      reader.loadNamedEntities(rosiePath);
      const result = await manager.extractEntities('cat', 'red');
      const animalExists = result.filter(r => r.entity === 'color');
      expect(animalExists.length).toBeGreaterThan(0);
    });
  });
});
