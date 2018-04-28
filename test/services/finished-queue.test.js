const assert = require('assert');
const app = require('../../src/app');

describe('\'finishedQueue\' service', () => {
  it('registered the service', () => {
    const service = app.service('finished-queue');

    assert.ok(service, 'Registered the service');
  });
});
