import test from 'ava';
import Worker from 'pseudo-worker';
import { PromiseWorker } from '../page/promise-worker.js';

function workerFixture(file: string) {
  const path = new URL(`./fixtures/${file}`, import.meta.url);
  return new Worker(path);
}

test('sends a message back and forth', async (t) => {
  var worker = workerFixture('worker-pong.js');
  var promiseWorker = new PromiseWorker(worker);

  console.log('ping');
  const res = await promiseWorker.postMessage('ping');
  console.log('pong?');
  t.is(res, 'pong');
});

test('echoes a message', async (t) => {
  var worker = workerFixture('worker-echo.js');
  var promiseWorker = new PromiseWorker(worker);

  const res = await promiseWorker.postMessage('ping');
  t.is(res, 'ping');
});

test('pongs a message with a promise', async (t) => {
  var worker = workerFixture('worker-pong-promise.js');
  var promiseWorker = new PromiseWorker(worker);

  const res = await promiseWorker.postMessage('ping');
  t.is(res, 'pong');
});

test('pongs a message with a promise, again', async (t) => {
  var worker = workerFixture('worker-pong-promise.js');
  var promiseWorker = new PromiseWorker(worker);

  const res = await promiseWorker.postMessage('ping');
  t.is(res, 'pong');
});

test('echoes a message multiple times', async (t) => {
  var worker = workerFixture('worker-echo.js');
  var promiseWorker = new PromiseWorker(worker);

  var words = [
    'foo',
    'bar',
    'baz',
    'quux',
    'toto',
    'bongo',
    'haha',
    'flim',
    'foob',
    'foobar',
    'bazzy',
    'fifi',
    'kiki',
  ];

  await Promise.all(
    words.map(async (word) => {
      const res = await promiseWorker.postMessage(word);
      t.is(res, word);
    })
  );
});

test('can have multiple PromiseWorkers', async (t) => {
  var worker = workerFixture('worker-echo.js');
  var promiseWorker1 = new PromiseWorker(worker);
  var promiseWorker2 = new PromiseWorker(worker);

  const res = await promiseWorker1.postMessage('foo');
  t.is(res, 'foo');
  const res_1 = await promiseWorker2.postMessage('bar');
  t.is(res_1, 'bar');
});

test('can have multiple PromiseWorkers 2', async (t) => {
  var worker = workerFixture('worker-echo.js');
  var promiseWorkers = [
    new PromiseWorker(worker),
    new PromiseWorker(worker),
    new PromiseWorker(worker),
    new PromiseWorker(worker),
    new PromiseWorker(worker),
  ];

  await Promise.all(
    promiseWorkers.map(async (promiseWorker, i) => {
      const res = await promiseWorker.postMessage('foo' + i);
      t.is(res, 'foo' + i);
      const res_1 = await promiseWorker.postMessage('bar' + i);
      t.is(res_1, 'bar' + i);
    })
  );
});

test('handles synchronous errors', async (t) => {
  var worker = workerFixture('worker-error-sync.js');
  var promiseWorker = new PromiseWorker(worker);

  try {
    await promiseWorker.postMessage('foo');
    t.fail('expected an error here');
  } catch (err) {
    t.is(err.message, 'busted!');
  }
});

test('handles asynchronous errors', async (t) => {
  var worker = workerFixture('worker-error-async.js');
  var promiseWorker = new PromiseWorker(worker);

  try {
    await promiseWorker.postMessage('foo');
    t.fail('expected an error here');
  } catch (err) {
    t.is(err.message, 'oh noes');
  }
});
