const sleep = timeout => callback => setTimeout(callback, timeout);

module.exports = app => {
  app.get('/getData', async function() {
    this.body = await app.mockClient.getData('hello');
  });

  app.get('/getDataGenerator', async function() {
    this.body = await app.mockClient.getDataGenerator('hello');
  });

  app.get('/getError', async function() {
    try {
      await app.mockClient.getError();
    } catch (err) {
      this.body = err.message;
    }
  });

  function subThunk() {
    return callback => {
      app.mockClient.subscribe({ id: 'foo' }, val => callback(null, val));
    };
  }

  app.get('/sub', async function() {
    const first = await subThunk();
    await sleep(1000);
    const second = await subThunk();
    this.body = {
      foo: app.foo,
      first,
      second,
    };
  });

  app.get('/save', async function() {
    app.mockClient.saveAsync('hello', 'node');
    this.body = 'ok';
  });

  app.get('/timeout', async function() {
    try {
      await app.mockClient.getTimeout();
      this.body = 'ok';
    } catch (err) {
      this.body = 'timeout';
    }
  });
};
