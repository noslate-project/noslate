# Andb

Noslate Debugger 是适用于 gdb/lldb 的 v8 离线调试工具，一般用于调试 v8 的 core 文件。

下文会使用 `andb` 代指本项目，为 Alibaba Noslate Debugger 的缩写。


### 主要功能

1) c++ 调试能力  
> 官方 node/alinode/aworker 均采用 Release 版本发布，缺乏调试信息无法进行调试。  
> andb 通过 "typ" 文件补全了非位置相关的调试信息，提供了c++调测能力，如结构体显示等。

2) 检查 v8 堆内对象 (d8)
> d8 或 node_g 可以提供 %DebugPrint 检查对象的详细信息，
> andb 可在 Release 版本上提供 %DebugPrint 的能力，无需应用重新编译 Debug 版本。

3) 分析时能力 (Heap Snapshot)
> Heap Snapshot 是 OOM 问题的主要定位手段，传统 Heap Snapshot 的获取则依赖于运行时开销较大，
> 通过 andb 则可以从 core 文件中离线导出 Heap Snapshot。

4) 调试信息的自动匹配
> 通过 arthur 或者 kernel 产生 core 文件，其含有 node 二进制的 BuildId 信息，
> andb 可以从数据库中自动匹配 node 以及 alinode 官方 Release 的版本及配套的调试信息文件。
> 对于 gcore 产生的 core 文件，BuildId 信息未被保存，需要手工进行匹配调试。  


### 支持的调试环境

* Linux + gdb 10.0+
* Linux + lldb 8.0+
* MacOS + lldb 11+ (catelina, bigsur, monterey)
* MacOS + gdb 10.0+ (andb-gdb)

目前仅支持 x86_64 的 core 文件分析。

### 使用方法 

1) 克隆整个 andb 工程  
2) 使用 env.sh 设置环境变量  
3) 使用 "andb" 命令开始调试  

```bash
# 设置环境变量, alias andb
git clone git@github.com:noslate-project/debugger.git
cd andb
source env.sh
```

对于 Arthur 或者 kernel 产生的 core 文件，可选择 gdb/lldb 启动离线调试。
```bash
# 使用 lldb 启动调试
andb -l -c core

# 或 使用 gdb 启动调试
andb -g -c core

```

对于 gcore 产生的 core 文件，则需要准备二进制，配套的 node.typ 文件，
使用 lldb 启动调试, andb 会加载 node 二进制和当前目录下的 node.typ 文件
```bash
andb -l node -c core
# or
andb -g node -c core
```

### isolate 的定位

andb 目前内置提供了两个快速找到 Isolate 的方法，
其一、通过 page 的控制字段
其二、通过当前堆栈上留存的 isolate 指针查找

```bash
# 通过 page 找 isolate
(gdb) isolate guess page
(class v8::internal::Isolate *) $isolate = 0x416ec60

# 通过 stack 找 isolate
(gdb) isolate guess stack
(class v8::internal::Isolate *) $isolate = 0x416ec60
```

### C++ 调试

andb 通过 Convenience 变量关联重要对象，这类调试器变量均使用 ”\$“ 前缀。
如 v8::internal::Isolate 在 isolate 定位后，就可使用 "\$isolate" 访问结构体内容，类似的还是有 "\$node" 等。

```bash
(gdb) p $isolate->heap_.old_space_
$1 = (class v8::internal::OldSpace *) 0x421de80

(gdb) p $isolate->heap_.gc_state_
$2 = v8::internal::Heap::NOT_IN_GC
```

### 命令行

andb 通过调试器的命令行接口提供统一的命令行。  

命令行采用 "前缀 + 子命令 + 命令参数" 构成，不同的前缀，
- isolate : isolate 核心结构命令
- heap : v8 堆相关的命令
- v8 : v8 相关调试命令
- node : node 相关的调试命令

gdb 下可提供命令行补全，但受限于 lldb 的实现无法提供自动补全，子命令可使用 "?" 获取，
```bash
(gdb) heap ?
snapshot page dump space
(gdb) iso ?
guess
```

在没有冲突的情况下，可使用命令缩写，如
```bash
# gdb
(gdb) iso g p
(class v8::internal::Isolate *) $isolate = 0x416ec60
(gdb) iso g s
(class v8::internal::Isolate *) $isolate = 0x416ec60

# lldb
(lldb) iso g p
(v8::internal::Isolate *) $isolate = 0x416ec60L
(lldb) iso g s
(v8::internal::Isolate *) $isolate = 0x416ec60L
```

#### heap space [new|old|code|lo|...]

显示 v8 堆内各 Space 的摘要，

```bash
(gdb) heap space
SPACE NAME          COMMIT        MAX
RO_SPACE      :     151552     262144
MAP_SPACE     :   22548480   38014976
CODE_SPACE    :    8749056   12681216
CODE_LO_SPACE :      49152      49152
OLD_SPACE     :  328626176  883847168
LO_SPACE      :  707457024 1462448128
NEW_LO_SPACE  :     299008  418394112
NEW_SPACE     :   33554432
 - from_space :   16777216
 - to_space   :   16777216
Total Committed 1101434880
```

显示指定 space 的所有 pages

```bash
(gdb) heap spa map
 0x30b45bd80000 : size(4096), sweep(1), start(0x30b45bd80120)
 0x2da021080000 : size(262144), sweep(1), start(0x2da021080120)
 ...
 0x1b609b100000 : size(262144), sweep(0), start(0x1b609b100120)
 0x3edd93fc0000 : size(262144), sweep(0), start(0x3edd93fc0120)
Total 32 pages.
(gdb)
```

#### heap page \<page_address\>

打印页内对象，

```bash
(gdb) heap page 0x3edd93fc0000
...
0x3edd93ffff30 : size(72), mapsize(72), MAP_TYPE
0x3edd93ffff78 : size(72), mapsize(72), MAP_TYPE
0x3edd93ffffc0 : size(64), mapsize(0), FREE_SPACE_TYPE
```

#### heap summary [old|code|lo|...]

摘要指定 Space 上对象的数量及占用字节数，

```bash
(gdb) heap sum old
...
0x3490b88c58c1:    42991      1375712 LOAD_HANDLER_TYPE
0x3490b88c0891:    43315      5587496 SCOPE_INFO_TYPE
0x3490b88c11e1:    45508     19311584 NAME_DICTIONARY_TYPE
0x14295ec40439:    47647      2668232 JS_OBJECT_TYPE
0x1f9e87f00439:    48833      3515976 JS_OBJECT_TYPE
0x3490b88c1bb9:    48926      1402440 INTERNALIZED_STRING_TYPE
0x3490b88c1781:    49847      1196328 UNCOMPILED_DATA_WITHOUT_PREPARSE_DATA_TYPE
0x3490b88c0241:    54119      7636728 DESCRIPTOR_ARRAY_TYPE
0x3490b88c02e1:    57338       458704 FILLER_TYPE
0x3490b88c12b9:    58272      1398528 FEEDBACK_CELL_TYPE
0x3490b88c1931:    58568     69492736 STRING_TYPE
0x14295ec403f1:    60238      3373328 JS_FUNCTION_TYPE
0x3490b88c08d9:    63642      3563952 SHARED_FUNCTION_INFO_TYPE
0x3490b88c04f9:    88135      1410160 HEAP_NUMBER_TYPE
0x3490b88c1979:    91588      2930816 CONS_ONE_BYTE_STRING_TYPE
0x3490b88c1421:    94980      4937800 PROPERTY_ARRAY_TYPE
0x14295ec40ca9:   131817      4218144 JS_ARRAY_TYPE
0x14295ec40751:   132339      8469696 JS_FUNCTION_TYPE
0x14295ec403a9:   171768     10993152 JS_FUNCTION_TYPE
0x14295ec40c61:   175716     10745528 FUNCTION_CONTEXT_TYPE
0x3490b88c0729:   176399     20811432 FIXED_ARRAY_TYPE
0x3490b88c0409:   184370     14378824 ONE_BYTE_INTERNALIZED_STRING_TYPE
0x3490b88c0849:   643297     52945368 ONE_BYTE_STRING_TYPE
ShowMapSummary() takes 166.896 second(s).
(gdb)
```


#### heap find [old|lo|...] \<tag\> 

在指定堆上查找引用 tag 的对象。

```bash
(gdb) heap find old 0xda2d6b4f4e9
<FixedArray 0x1449d494b869>
<FixedArray 0x1449d494c9c9>
find 2
(gdb) heap find old 0x1449d494b869
<JsArray 0x1449d494f1f9>
find 1
```

#### heap snapshot 

从 core 中导出 core.heapsnapshot 文件，

```bash
(gdb) heap snap
Synchronize: (Strong roots)
Synchronize: (Bootstrapper)
Synchronize: (Relocatable)
Synchronize: (Debugger)
Synchronize: (Compilation cache)
Synchronize: (Builtins)
Synchronize: (Thread manager)
Synchronize: (Global handles)
Synchronize: (Stack roots)
Synchronize: (Handle scope)
Synchronize: (Eternal handles)
Synchronize: (Startup object cache)
Synchronize: (Internalized strings)
Synchronize: (External strings)
Iterated 0 RO Heap Objects
failed RO Heap Object: 0
(v8::internal::AllocationSpace) v8::internal::RO_SPACE
(v8::internal::AllocationSpace) v8::internal::MAP_SPACE
(v8::internal::AllocationSpace) v8::internal::CODE_SPACE
(v8::internal::AllocationSpace) v8::internal::CODE_LO_SPACE
(v8::internal::AllocationSpace) v8::internal::OLD_SPACE
18.6%: 999.9/sec, Object(10000), Entry(42830), Edge(119869)
(v8::internal::AllocationSpace) v8::internal::LO_SPACE
(v8::internal::AllocationSpace) v8::internal::NEW_LO_SPACE
(v8::internal::AllocationSpace) v8::internal::NEW_SPACE
Iterated 46355 Objects
failed HeapObject: 0
heap snapshot written to 'core.heapsnapshot'
Generate() takes 14.012 second(s).
(gdb)
``` 
之后使用 devtools 打开 core.heapsnapshot 文件。

#### v8 inspect \<tag\>

v8 inspect 命令 类似于 %DebugPrint 用于打印某个对象的详细信息。
v8 inspect 的输入是一个 \<tag\>，如果是非 HeapObject tag，则会显示为 Smi。

```bash
(gdb) v8 i 0xda2d6b4f4e9
[JSObject 0xda2d6b4f4e9]
- Properties:
 - originalColumn: <Smi 6 0x600000000>
 - name: <Oddball 0x3490b88c01b1>
 - generatedColumn: <Smi 161 0xa100000000>
 - source: <Smi 0 0x0>
 - originalLine: <Smi 81 0x5100000000>
 - generatedLine: <Smi 43 0x2b00000000>
- Elements: []
[Map 0x1f9e87f00439]
- InstanceSizeInWords: 9
- InobjectPropertiesStartOrConstructorFunctionIndex: 3
- UsedOrUnusedInstanceSizeInWords: 9
- VisitorId: 25
- InstanceType: JS_OBJECT_TYPE (1057)
- BitField: 0x0
[MapBitFields1 0x0]
- HasNonInstancePrototype: 0
- IsCallable: 0
- HasNamedInterceptor: 0
- HasIndexedInterceptor: 0
- IsUndetectable: 0
- IsAccessCheckNeeded: 0
- IsConstructor: 0
- HasPrototypeSlot: 0
- BitField2: 0x19
[MapBitFields2 0x19]
- NewTargetIsBase: 1
- IsImmutablePrototype: 0
- Unused: 0
- ElementsKind: HOLEY_ELEMENTS (3)
- BitField3: 0x8c01bff
[MapBitFields3 0x8c01bff]
- EnumLength: 1023
- NumberOfOwnDescriptors: 6
- IsPrototypeMap: 0
- IsDictionaryMap: 0
- OwnsDescriptors: 1
- IsInRetainedMapList: 1
- IsDeprecated: 0
- IsUnstable: 0
- IsMigrationTarget: 0
- IsExtensible: 1
- MayHaveIntrestingSymbols: 0
- ConstructionCounter: 0
- Prototype: <JsObject 0x2beeb7f52579>
- ConstructorOrBackPointerOrNativeContext: <Map 0x1f9e87f003f1>
- InstanceDescriptors: <DescriptorArray 0x2beeb7f525b1>
- DependentCode: <WeakFixedArray 0x21f08217e919>
- PrototypeValidityCell: <Cell 0x21f08217e411>
- TransitionsOrPrototypeInfo: <Smi 0 0x0>
[HeapObject]
 - MapWord: 0x1f9e87f00439
 - Size: 72
 - Page: 0xda2d6b40000
   - NextObject: 0xda2d6b4f531
```

#### v8 bt

显示 v8 调用帧信息，JS函数、this、参数等

```bash
(gdb) v8 bt
#0  0x00000e5ce6f04010 home(this=<JsObject 0x620f5fe24e9>) at /disks/banana/zlei/alibaba/andb/test/backtrace/deadloop/dist/controller/home.controller.js:0
#1  0x0000000001462119 <arguments_adaptor>()
#2  0x00000000014681e2 (anonymous)(this=<Oddball 0x5d12f880471>, arg0=<JsObject 0x620f5fc8421>, arg1=<JsBoundFunction 0x620f5fe1c39>) at /disks/banana/zlei/alibaba/andb/test/backtrace/deadloop/node_modules/@midwayjs/core/dist/common/webGenerator.js:0
#3  0x0000000001494db0 (anonymous)(this=<JsGlobalProxy 0x12b3e36823e1>, arg0=<JsObject 0x620f5fe24e9>) at undefined:1489
#4  0x00000000015110ee <stub>()
#5  0x0000000001487eda <stub>()
#6  0x0000000001465e58 <entry>()
#7  0x0000000000d2863b v8::internal::(anonymous namespace)::Invoke(v8::internal::Isolate*, v8::internal::(anonymous namespace)::InvokeParams const&)()
#8  0x0000000000d29553 v8::internal::Execution::TryRunMicrotasks(v8::internal::Isolate*, v8::internal::MicrotaskQueue*, v8::internal::MaybeHandle<v8::internal::Object>*)()
#9  0x0000000000d52be1 v8::internal::MicrotaskQueue::RunMicrotasks(v8::internal::Isolate*)()
#10 0x0000000000d52fc1 v8::internal::MicrotaskQueue::PerformCheckpoint(v8::Isolate*)()
#11 0x0000000000c38261 v8::internal::MaybeHandle<v8::internal::Object> v8::internal::(anonymous namespace)::HandleApiCallHelper<false>(v8::internal::Isolate*, v8::internal::Handle<v8::internal::HeapObject>, v8::internal::Handle<v8::internal::HeapObject>, v8::internal::Handle<v8::internal::FunctionTemplateInfo>, v8::internal::Handle<v8::internal::Object>, v8::internal::BuiltinArguments)()
#12 0x0000000000c39eff v8::internal::Builtin_HandleApiCall(int, unsigned long*, v8::internal::Isolate*)()
#13 0x00000000014cf459 <builtin_exit>()
#14 0x00000000014681e2 processTicksAndRejections(this=<JsApiObject 0x12b3e3681d81>) at internal/process/task_queues.js:0
#15 0x0000000001465efa <internal>()
#16 0x0000000001465cd8 <entry>()
#17 0x0000000000d281e1 v8::internal::(anonymous namespace)::Invoke(v8::internal::Isolate*, v8::internal::(anonymous namespace)::InvokeParams const&)()
#18 0x0000000000d2900f v8::internal::Execution::Call(v8::internal::Isolate*, v8::internal::Handle<v8::internal::Object>, v8::internal::Handle<v8::internal::Object>, int, v8::internal::Handle<v8::internal::Object>*)()
#19 0x0000000000bd4879 v8::Function::Call(v8::Local<v8::Context>, v8::Local<v8::Value>, int, v8::Local<v8::Value>*)()
#20 0x000000000098af6e node::InternalCallbackScope::Close()()
#21 0x000000000098c172 node::InternalMakeCallback(node::Environment*, v8::Local<v8::Object>, v8::Local<v8::Object>, v8::Local<v8::Function>, int, v8::Local<v8::Value>*, node::async_context)()
#22 0x000000000099ae06 node::AsyncWrap::MakeCallback(v8::Local<v8::Function>, int, v8::Local<v8::Value>*)()
#23 0x0000000000a473cd non-virtual thunk to node::(anonymous namespace)::Parser::OnStreamRead(long, uv_buf_t const&)()
#24 0x0000000000b0fcbc node::LibuvStreamWrap::ReadStart()::{lambda(uv_stream_s*, long, uv_buf_t const*)#2}::_FUN(uv_stream_s*, long, uv_buf_t const*)()
#25 0x00000000014551d2 uv__read(stream=<optimized out>) at ../deps/uv/src/unix/stream.c:1259
#26 0x00000000014558d8 uv__stream_io(loop=<optimized out>, w=<optimized out>, events=<optimized out>) at ../deps/uv/src/unix/stream.c:1326
#27 0x000000000145c2e5 uv__io_poll(loop=<optimized out>, timeout=<optimized out>) at ../deps/uv/src/unix/linux-core.c:472
#28 0x0000000001449595 uv_run(loop=<optimized out>, mode=<optimized out>) at ../deps/uv/src/unix/core.c:394
#29 0x0000000000a6fef5 node::NodeMainInstance::Run()()
#30 0x00000000009f7c41 node::Start(int, char**)()
#31 0x00007f71ae0fe445 __libc_start_main(main=0x9885b0 <main>, argc=2, argv=0x7fff155e5378, init=<optimized out>, fini=<optimized out>, rtld_fini=<optimized out>, stack_end=0x7fff155e5368) at ../csu/libc-start.c:266
#32 0x0000000000989c5d _start()
```

