const assert = require('assert');
const app = require('../../src/app');

describe('\'getQueueNumber\' service', () => {
  it('registered the service', () => {
    const service = app.service('get-queue-number');

    assert.ok(service, 'Registered the service');
  });
});
