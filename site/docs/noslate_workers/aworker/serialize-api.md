# 状态拷贝 API

Aworker 提供了用户代码状态保存和恢复的用户代码 API，应用于 Warmfork 场景与 Startup Snapshot 场景。

### Warmfork

当 Aworker 以 `--mode=seed-userland` 指令启动时：

```shell
$ aworker --mode=seed-userland [options] <script-filepath>
```

用户代码可以观测到 `'serialize'` 事件。在 `'serialize'` 事件的 [ExtendableEvent][] 终结时，
会在所有异步任务处理完成后进入 forkwait 状态。

在 fork 子进程中，用户代码可以观测到 `'deserialize'` 事件。在 `'deserialize'` 事件的
[ExtendableEvent][] 终结时，会开始进入正常启动流程，执行 `'install'` 事件等等。

### Startup Snapshot

当 Aworker 以 `--build-snapshot` 指令启动时：

```shell
$ aworker --build-snapshot --snapshot-blob snapshot.blob code.js
```

用户代码可以观测到 `'serialize'` 事件。在 `'serialize'` 事件的 [ExtendableEvent][] 终结时，
会在所有异步任务处理完成后开始生成 Startup Snapshot 到指定的文件。

在生成了 Startup Snapshot 文件后，Aworker 即可通过 `--snapshot-blob` 指令从 Startup
Snapshot 中恢复进程状态并开始执行用户代码：

```shell
$ aworker --snapshot-blob snapshot.blob
```

在这个阶段中，Worker 实例从 Startup Snapshot 中完成状态恢复后，用户代码可以观测到 `'deserialized'` 事件。
在 `'deserialize'` 事件的 [ExtendableEvent][] 终结时，会开始进入正常启动流程，执行 `'install'` 事件等等。

在状态恢复阶段中的 `'deserialize'` 等等事件的处理器都是在生成 Startup Snapshot 时使用的用户代码中注册的。

### Event: `'serialize'`

参数：
- event <[ExtendableEvent][]>

表示 Worker 实例准备进行状态保存操作，如 forkwait 模式、Startup Snapshot 序列化模式等。

```js
addEventListener('serialize', event => {
  // Reset states that are correlated to the environment.
  event.waitUntil(Promise.resolve());
});
```

### Event: `'deserialize'`

参数：
- event <[ExtendableEvent][]>

表示 Worker 实例准备进行状态恢复操作，如 forkwait 模式中的子进程、Startup Snapshot 反序列化完成等。

```js
addEventListener('deserialize', event => {
  // Restore states that are correlated to the environment.
  event.waitUntil(Promise.resolve());
});
```

[ExtendableEvent]: https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent
