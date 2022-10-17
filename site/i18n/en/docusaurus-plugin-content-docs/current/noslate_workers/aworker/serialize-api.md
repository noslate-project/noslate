# Serialize API

Aworker provides user code APIs for saving and restoring user code state, which are used in Warmfork scenarios and Startup Snapshot scenarios.

### Warmfork

When Aworker is started with the `--mode=seed-userland` directive:

```shell
$ aworker --mode=seed-userland [options] <script-filepath>
```

User code can observe the `'serialize'` event. At the end of the [ExtendableEvent][] of the `'serialize'` event, it will enter the forkwait state after all asynchronous tasks are processed.

In the fork child process, user code can observe the `'deserialize'` event. At the end of the [ExtendableEvent][] of the `'deserialize'` event, the normal startup process begins, executing the `'install'` event, etc.

### Startup Snapshot

When Aworker started with the `--build-snapshot` command:

```shell
$ aworker --build-snapshot --snapshot-blob snapshot.blob code.js
```

User code can observe the `'serialize'` event. When the [ExtendableEvent][] of the `'serialize'` event terminates, it will start generating a Startup Snapshot to the specified file after all asynchronous tasks are processed.

After the Startup Snapshot file is generated, Aworker can restore the process state from the Startup Snapshot and start executing user code via the `--snapshot-blob` command:

```shell
$ aworker --snapshot-blob snapshot.blob
```

During this phase, the `'deserialized'` event can be observed by user code after the Worker instance has completed state recovery from the Startup Snapshot. At the end of the [ExtendableEvent][] of the `'deserialize'` event, the normal startup process begins, executing the `'install'` event, etc.

Handlers for events such as `'deserialize'` in the state restoration phase are registered in the user code used when the Startup Snapshot is generated.

### Event: `'serialize'`

Parameters: 
- event <[ExtendableEvent][]>

Represents that the Worker instance is ready to perform state saving operations, such as forkwait mode, Startup Snapshot serialization mode, etc.

```js
addEventListener('serialize', event => {
  // Reset states that are correlated to the environment.
  event.waitUntil(Promise.resolve());
});
```

### Event: `'deserialize'`

Parameters: 
- event <[ExtendableEvent][]>

Represents that the Worker instance is ready to perform state recovery operations, such as child processes in forkwait mode, Startup Snapshot deserialization completion, etc.

```js
addEventListener('deserialize', event => {
  // Restore states that are correlated to the environment.
  event.waitUntil(Promise.resolve());
});
```

[ExtendableEvent]: https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent
