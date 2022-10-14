# heap command

## heap space

Displays the space information of the V8 Heap.

The heap of V8 adopts the Space + Page structure, several Pages form a Space, and several Spaces form the V8 heap.

According to the new and old generation and their uses, it is divided into multiple Spaces such as new (new generation), new_lo (new generation large object), old (old generation), lo (old generation large object), ro (read-only object). 
The size of the Page that is usually used to store small objects is 256K, and the Page that stores large objects contains only one object.

* heap space
* heap space [space_name]
     * space_name : old, new, lo, map, code etc.

`heap space` is used to display the space space usage within the v8 heap, where Commit is the size of the commit and Max is the maximum used size.
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
Displays all objects Brief of the specified Page.

Brief is a short string used to display objects on a single line, generally consisting of 2-3 parts.
Such as `<Type Info TagPointer>`
From left to right, the first part is the object type, the middle part may show important tips, and the rightmost part shows the object's Tagging Pointer.

````
<JsFunction setTimeout 0x37c04dfc74f9>
````
Description `0x37c04dfc74f9` is a `JsFunction` object named `setTimeout`.

* heap page [page_address]
     * page_address: V8 Page starting memory address
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
The abstract specifies the objects of the Space, sorted by map, and sorted by quantity.

* heap summary [space_name]
    * space_name: new, old, lo, new_lo etc.

The headers follow `Map`, `Count`, `Bytes`, `Type`.
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
Find references in the V8 heap.

* heap find [space_name] [tagging]
     * space_name: new, old, lo, new_lo etc.
     * tagging: Tagging Pointer of the target object
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

Export Heap Snapshots.

* heap snapshot [filename]
     * The default filename is `core.heapsnapshot`.

If you specify filename, make sure the suffix is heapsnapshot, otherwise it will not be recognized by DevTool.
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
It takes more time when there are many objects, which can take up to several hours depending on the number of nodes and edges.
