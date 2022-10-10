# isolate 命令


## isolate guess

定位 `v8::internal::Isolate` 结构体。

`v8::internal::Isolate` 是 V8 引擎的核心数据结构，其代表一个 V8 虚拟机，它有自己的 Heap(堆)，GC(垃圾回收) 等。
andb 的很多分析时工具，都需要基于该数据结构，所以一般调试 Corefile 首先要定位 `Isolate`。


* isolate guess page
* isolate guess stack

andb 目前提供了 2种快速定位 `Isolate` 的方法，

1. 通过 `page`

V8 引擎自行维护了内存页管理，每一个页面都还有一个每个版本固定的页头，通过这个页头可以找到 `V8::internal::Heap` 结构，
`Heap`结构体 是 `Isolate` 的一部分，所以进而可以找到 `Isolate` 的首址。

2. 通过 `stack`

Node.js 将 V8 引擎的数据保留在了 `Node::Run()` 的局部变量中，存储在主线程的调用栈上，
通过主线程栈内存可以获得 `Isolate` 的首址。

```
(gdb) isolate guess page
(v8::internal::Isolate *) $isolate = 0x5f93c70
(gdb) isolate guess stack
(v8::internal::Isolate *) $isolate = 0x5f93c70
```

带有 "\$" 前缀的变量，称作 Convenience 变量，上例中可以通过 "\$isolate" 访问到 v8 虚拟机

```
(gdb) p $isolate->heap_.new_space_
$2 = (v8::internal::NewSpace *) 0x60296f0

(gdb) p $isolate->heap_.new_space_.to_space_
$5 = {
  <v8::internal::Space> = {
    <v8::internal::Malloced> = {<No data fields>},
    members of v8::internal::Space:
    _vptr.Space = 0x23d3890 <vtable for v8::internal::SemiSpace+16>,
    allocation_observers_ = std::vector of length 0, capacity 0,
    memory_chunk_list_ = {
      front_ = 0x667900000,
      back_ = 0x159131e80000
    },
    external_backing_store_bytes_ = 0x6029a20,
    allocation_observers_paused_ = false,
    heap_ = 0x5f9d1b8,
    id_ = v8::internal::NEW_SPACE,
    committed_ = {
      <std::__atomic_base<unsigned long>> = {
        static _S_alignment = 8,
        _M_i = 1048576
      }, <No data fields>},
    max_committed_ = 2097152,
    free_list_ = std::unique_ptr<v8::internal::FreeList> = {
      get() = 0x6029980
    }
  },
  members of v8::internal::SemiSpace:
  current_capacity_ = 1048576,
  maximum_capacity_ = 16777216,
  minimum_capacity_ = 1048576,
  age_mark_ = 27507487032,
  committed_ = true,
  id_ = v8::internal::kToSpace,
  current_page_ = 0x10d414980000,
  pages_used_ = 2
}
```

目前 andb 只支持单一 `Isolate`。
