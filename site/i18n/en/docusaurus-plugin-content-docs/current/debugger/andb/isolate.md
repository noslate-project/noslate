# Isolate command


## Isolate guess

Locate the `v8::internal::Isolate` structure.

`v8::internal::Isolate` is the core data structure of the V8 engine, which represents a V8 virtual machine, which has its own Heap (heap), GC (garbage collection), etc.
Many analysis tools of andb need to be based on this data structure, so generally debugging Corefile should first locate `Isolate`.


* isolate guess page
* isolate guess stack

andb currently provides 2 methods to quickly locate `Isolate`,

1. By `page`

The V8 engine maintains memory page management by itself, and each page also has a page header fixed for each version, through which the `V8::internal::Heap` structure can be found.
The `Heap` structure is part of `Isolate`, so it is possible to find the first address of `Isolate`.

2. By `stack`

Node.js keeps the data of the V8 engine in the local variables of `Node::Run()`, which are stored on the call stack of the main thread,
The first address of `Isolate` can be obtained from the main thread stack memory.

````
(gdb) isolate guess page
(v8::internal::Isolate *) $isolate = 0x5f93c70
(gdb) isolate guess stack
(v8::internal::Isolate *) $isolate = 0x5f93c70
````

Variables prefixed with "\$" are called Convenience variables. In the above example, you can access the v8 virtual machine through "\$isolate"

````
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
````

Currently andb only supports a single `Isolate`.