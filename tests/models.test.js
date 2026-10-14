/* global describe, test, expect */
const { resolveModel, DEFAULT_MODEL_MAPPINGS, getMappings } = require('../lib/models');

describe('models.js - Dynamic Capability Aliasing', () => {
  test('resolves capability tags correctly', () => {
    expect(resolveModel('@reasoning')).toBe(DEFAULT_MODEL_MAPPINGS['@reasoning']);
    expect(resolveModel('@standard')).toBe(DEFAULT_MODEL_MAPPINGS['@standard']);
    expect(resolveModel('@fast')).toBe(DEFAULT_MODEL_MAPPINGS['@fast']);
    expect(resolveModel('@local')).toBe(DEFAULT_MODEL_MAPPINGS['@local']);
  });

  test('returns original string if not a capability tag', () => {
    expect(resolveModel('Claude 3.5 Sonnet')).toBe('Claude 3.5 Sonnet');
  });

  test('handles custom config overrides gracefully', () => {
    const mappings = getMappings();
    expect(mappings).toHaveProperty('@reasoning');
    expect(mappings).toHaveProperty('@standard');
  });
});
