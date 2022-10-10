# heap 命令

## heap space

显示 V8 Heap 的 Space 信息。

V8 的堆采用 Space + Page 结构，若干个 Page 构成一个 Space，若干个 Space 构成 v8 的堆。

按照新老生代及用途，分为如 new(新生代)，new_lo(新生代大对象), old(老生代)，lo(老生代大对象), ro(只读对象) 等多个 Space.   
通常用于存放小对象的 Page 采用的 256K 的大小，存放大对象的 Page 只含有一个对象。

* heap space
* heap space [space_name]
    * space_name : old, new, lo, map, code etc.

`heap space` 用于显示 v8 堆内的 Space 空间使用情况，其中 Commit 是提交的大小， Max 是最大使用的大小。
```
(gdb) heap space
SPACE NAME          COMMIT        MAX
RO_SPACE      :     151552     262144
MAP_SPACE     :     528384     528384
CODE_SPACE    :     360448     360448
CODE_LO_SPACE :      49152      49152
OLD_SPACE     :    2781184    4616192
LO_SPACE      :     401408     401408
NEW_LO_SPACE  :          0          0
NEW_SPACE     :    1048576
 - from_space :          0
 - to_space   :    1048576
Total Committed    5320704
```

`heap space new` 显示 new space (新生代小对象) 的所有 pages。
```
(gdb) heap space new
    0x667900000 : size(262144), sweep(0), start(0x667900120)
 0x176d3ce00000 : size(262144), sweep(0), start(0x176d3ce00120)
 0x10d414980000 : size(262144), sweep(0), start(0x10d414980120)
 0x159131e80000 : size(262144), sweep(0), start(0x159131e80120)
Total 4 pages.
```


## heap page

显示指定 Page 的所有对象 Brief。

Brief 是一种用于单行显示对象的简短字符串，一般由2-3部分组成。   
如 `<Type Info TagPointer>` 
从左往右，第一部分为对象类型，中间部分可能显示重要提示，最右侧部分显示对象的 Tagging Pointer。

```
<JsFunction setTimeout 0x37c04dfc74f9>
```
说明 `0x37c04dfc74f9` 是一个 `JsFunction` 对象，名称为 `setTimeout`.

* heap page [page_address]
    * page_address: V8 Page 起始内存地址

```
(gdb) heap page 0x3c0214e40000
0x3c0214e40120: <PropertyArray 0x3c0214e40120>
0x3c0214e40140: <FunctionContext 0x3c0214e40140>
0x3c0214e40168: <JsObject 0x3c0214e40168>
0x3c0214e40180: <PropertyArray 0x3c0214e40180>
0x3c0214e401a0: <FunctionContext 0x3c0214e401a0>
0x3c0214e401c8: <JsObject 0x3c0214e401c8>
0x3c0214e401e0: <PropertyArray 0x3c0214e401e0>
0x3c0214e40200: <FunctionContext 0x3c0214e40200>
0x3c0214e40228: <JsObject 0x3c0214e40228>
0x3c0214e40240: <PropertyArray 0x3c0214e40240>
0x3c0214e40260: <FunctionContext 0x3c0214e40260>
0x3c0214e40288: <JsObject 0x3c0214e40288>
0x3c0214e402a0: <PropertyArray 0x3c0214e402a0>
0x3c0214e402c0: <FunctionContext 0x3c0214e402c0>
0x3c0214e402e8: <JsObject 0x3c0214e402e8>
0x3c0214e40300: <PropertyArray 0x3c0214e40300>
0x3c0214e40320: <FunctionContext 0x3c0214e40320>
0x3c0214e40348: <JsObject 0x3c0214e40348>
0x3c0214e40360: <PropertyArray 0x3c0214e40360>
0x3c0214e40380: <FunctionContext 0x3c0214e40380>
0x3c0214e403a8: <JsObject 0x3c0214e403a8>
0x3c0214e403c0: <PropertyArray 0x3c0214e403c0>
0x3c0214e403e0: <FunctionContext 0x3c0214e403e0>
0x3c0214e40408: <JsObject 0x3c0214e40408>
0x3c0214e40420: <PropertyArray 0x3c0214e40420>
0x3c0214e40438: <FunctionContext 0x3c0214e40438>
...
0x3c0214e503b0: <DescriptorArray 0x3c0214e503b0>
0x3c0214e50440: <DescriptorArray 0x3c0214e50440>
0x3c0214e504d0: <DescriptorArray 0x3c0214e504d0>
0x3c0214e50530: <DescriptorArray 0x3c0214e50530>
0x3c0214e505c0: <DescriptorArray 0x3c0214e505c0>
0x3c0214e50650: <DescriptorArray 0x3c0214e50650>
0x3c0214e506e0: <DescriptorArray 0x3c0214e506e0>
0x3c0214e50770: <FreeSpace 0x3c0214e50770>
Total Cnt(1206)
DumpChunk() takes 0.136 second(s).
```


## heap summary 

摘要指定 Space 的对象，按照 map 进行归类，并按照数量进行排序。

* heap summary [space_name]
    * space_name: new, old, lo, new_lo etc.

标题按照 `Map`, `Count`, `Bytes`, `Type`。
```
(gdb) heap sum old
0x2048032c0829:        1           24 JS_OBJECT_TYPE
0x2048032c0fc1:        1           24 JS_OBJECT_TYPE
0x2048032c1099:        1           24 JS_OBJECT_TYPE
0x2048032c1129:        1           24 JS_OBJECT_TYPE
0x2048032c11b9:        1           24 JS_OBJECT_TYPE
0x2048032c2719:        1           24 JS_OBJECT_TYPE
0x2048032c27a9:        1           24 JS_OBJECT_TYPE
0x2048032c2839:        1           24 JS_OBJECT_TYPE
0x2048032c2f89:        1           24 JS_OBJECT_TYPE
0x2048032c3019:        1           24 JS_OBJECT_TYPE
...
0x2048032c0c61:      487        50352 FUNCTION_CONTEXT_TYPE
0x0b6f27201469:      492        15744 CALL_HANDLER_INFO_TYPE
0x0b6f27200ec9:      497        18112 FEEDBACK_METADATA_TYPE
0x0b6f27200fe9:      519       103592 BYTECODE_ARRAY_TYPE
0x0b6f27204c19:      636        71232 FUNCTION_TEMPLATE_INFO_TYPE
0x0b6f272058c1:      646        20672 LOAD_HANDLER_TYPE
0x0b6f27200891:      701       123768 SCOPE_INFO_TYPE
0x0b6f27201979:      835        26720 CONS_ONE_BYTE_STRING_TYPE
0x0b6f27200729:      900       157952 FIXED_ARRAY_TYPE
0x0b6f27201421:      930        43808 PROPERTY_ARRAY_TYPE
0x0b6f272006e1:     1068        59336 BYTE_ARRAY_TYPE
0x0b6f27200241:     1239       197352 DESCRIPTOR_ARRAY_TYPE
0x0b6f272009f9:     1312        20992 FOREIGN_TYPE
0x2048032c0751:     1484        94976 JS_FUNCTION_TYPE
0x0b6f27201781:     1688        40512 UNCOMPILED_DATA_WITHOUT_PREPARSE_DATA_TYPE
0x2048032c03f1:     1843       103208 JS_FUNCTION_TYPE
0x0b6f272012b9:     2200        52800 FEEDBACK_CELL_TYPE
0x0b6f27200849:     2464       103056 ONE_BYTE_STRING_TYPE
0x0b6f272008d9:     3525       197400 SHARED_FUNCTION_INFO_TYPE
0x0b6f27200409:     6858       234808 ONE_BYTE_INTERNALIZED_STRING_TYPE
ShowMapSummary() takes 1.582 second(s).
```


## heap find

在 V8 堆中查找引用。

* heap find [space_name] [tagging]
    * space_name: new, old, lo, new_lo etc.
    * tagging: 目标对象的 Tagging Pointer

```
(gdb) heap find old 0x3c0214e4c391
<FixedArray 0x3c0214e49e69>
find 1
(gdb) heap find old 0x3c0214e49e69
<JsArray 0xe953ab26d1>
find 1
(gdb) heap find old 0xe953ab26d1
<JsObject 0xe953ab2389>
find 1
```


## heap snapshot

导出 Heap Snapshot。

* heap snapshot [filename]
    * 默认的 filename 为 `core.heapsnapshot`。

如指定 filename 请确保后缀为 heapsnapshot，否则无法被 DevTool 识别。

```
(gdb) heap snap
Synchronize: (Strong roots)
Synchronize: (Bootstrapper)
Synchronize: (Relocatable)
Synchronize: (Debugger)
Synchronize: (Compilation cache)
Synchronize: (Builtins)
Synchronize: (Thread manager)
OnStackTracedNodeSpace.Iterate NotImplemented.
Synchronize: (Global handles)
Synchronize: (Stack roots)
Synchronize: (Handle scope)
Synchronize: (Eternal handles)
Synchronize: (Startup object cache)
Synchronize: (Internalized strings)
Synchronize: (External strings)
Iterated 1732 RO Heap Objects
failed RO Heap Object: 0
(enum v8::internal::AllocationSpace) v8::internal::RO_SPACE
(enum v8::internal::AllocationSpace) v8::internal::MAP_SPACE
(enum v8::internal::AllocationSpace) v8::internal::CODE_SPACE
(enum v8::internal::AllocationSpace) v8::internal::CODE_LO_SPACE
(enum v8::internal::AllocationSpace) v8::internal::OLD_SPACE
19.3%: 999.8/sec, Object(10000), Entry(34920), Edge(91684)
(enum v8::internal::AllocationSpace) v8::internal::LO_SPACE
(enum v8::internal::AllocationSpace) v8::internal::NEW_LO_SPACE
(enum v8::internal::AllocationSpace) v8::internal::NEW_SPACE
Iterated 43904 Objects
failed HeapObject: 0
heap snapshot written to 'core.heapsnapshot'
Generate() takes 14.629 second(s).
```

对象多时需要更多时间，视 node 和 edges 数量可能长达数小时。
