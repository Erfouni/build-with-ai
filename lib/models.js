const fs = require('fs');
const path = require('path');

const DEFAULT_MODEL_MAPPINGS = {
  '@reasoning': 'Claude Opus 4.6 / GPT-5.6 / JEV / OpenAI o4',
  '@standard': 'Claude Sonnet 4.6 / Gemini 3.7 Flash / JEV Standard',
  '@fast': 'Gemini 3.7 Flash / Claude Haiku 4.6',
  '@local': 'Qwen 3 Coder 32B / DeepSeek-R2'
};

/**
 * Loads custom mappings from .buildwithai/config.json if available
 * and merges them over the default mappings.
 */
function getMappings() {
  const configPath = path.join(process.cwd(), '.buildwithai', 'config.json');
  let customMappings = {};

  if (fs.existsSync(configPath)) {
    try {
      const configContent = fs.readFileSync(configPath, 'utf8');
      const config = JSON.parse(configContent);
      
      if (config && config.models) {
        customMappings = config.models;
      } else if (config) {
        customMappings = config;
      }
    } catch (error) {
      // Ignore config parse errors gracefully
    }
  }

  return { ...DEFAULT_MODEL_MAPPINGS, ...customMappings };
}

/**
 * Resolves capability alias (e.g. '@reasoning') to actual model string.
 * @param {string} alias - Tag name like '@reasoning' or direct model name
 * @param {string} [provider] - Optional provider parameter
 * @returns {string} Resolved model string
 */
function resolveModel(alias, provider) {
  if (!alias || typeof alias !== 'string') {
    return alias;
  }

  const mappings = getMappings();

  if (alias.startsWith('@')) {
    if (mappings[alias]) {
      return mappings[alias];
    }
  }

  return alias;
}

module.exports = {
  DEFAULT_MODEL_MAPPINGS,
  getMappings,
  resolveModel
};