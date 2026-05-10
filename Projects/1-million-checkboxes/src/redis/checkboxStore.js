const config = require("../config");

const CHECKBOX_BITMAP_KEY = "checkboxes:bitmap:v1";

class CheckboxStore {
  constructor(redis) {
    this.redis = redis;
  }

  assertIndex(index) {
    if (!Number.isInteger(index) || index < 0 || index >= config.totalCheckboxes) {
      const error = new Error("Checkbox index is out of range.");
      error.statusCode = 400;
      throw error;
    }
  }

  async set(index, checked) {
    this.assertIndex(index);
    return this.redis.setBit(CHECKBOX_BITMAP_KEY, index, checked ? 1 : 0);
  }

  async get(index) {
    this.assertIndex(index);
    return (await this.redis.getBit(CHECKBOX_BITMAP_KEY, index)) === 1;
  }

  async range(start, count) {
    const safeStart = Math.max(0, Math.min(config.totalCheckboxes - 1, Number(start) || 0));
    const safeCount = Math.max(1, Math.min(Number(count) || config.visibleWindowSize, 5000));
    const end = Math.min(config.totalCheckboxes, safeStart + safeCount);
    const values = [];

    const pipeline = this.redis.multi();
    for (let index = safeStart; index < end; index += 1) {
      pipeline.getBit(CHECKBOX_BITMAP_KEY, index);
    }
    const results = await pipeline.exec();
    for (const value of results) values.push(value === 1);

    return {
      start: safeStart,
      count: values.length,
      total: config.totalCheckboxes,
      values
    };
  }
}

module.exports = { CheckboxStore, CHECKBOX_BITMAP_KEY };
