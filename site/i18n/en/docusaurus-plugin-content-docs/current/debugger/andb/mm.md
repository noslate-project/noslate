# mm command

## mm map / list

Similar to /proc/[pid]/maps provides memory loading

* mm map
* mm list

The difference between `mm map` and `mm list` is that `mm list` sorts the results by size.
```
gdb) mm map
 0x400270-0x40028c .interp r-- 28
 0x40028c-0x4002ac .note.ABI-tag r-- 32
 0x4002ac-0x4002d0 .note.gnu.build-id r-- 36
 0x4002d0-0x46724c .gnu.hash r-- 421756
 0x467250-0x5b3db8 .dynsym r-- 1362792
 0x5b3db8-0x956fc7 .dynstr r-- 3813903
 0x956fc8-0x972b66 .gnu.version r-- 113566
 0x972b68-0x972d98 .gnu.version_r r-- 560
 0x972d98-0x973200 .rela.dyn r-- 1128
 0x973200-0x976218 .rela.plt r-- 12312
 0x976218-0x976237 .init r-x 31
 0x976240-0x978260 .plt r-x 8224
 0x978260-0x978270 .plt.got r-x 16
 0x97a000-0x1e857fc .text r-x 22067196
 0x2000000-0x2000191 lpstub r-x 401
 0x2000194-0x200019d .fini r-x 9
 0x20001c0-0x434c740 .rodata r-- 37012864
 0x434c740-0x43b581c .eh_frame_hdr r-- 430300
 0x43b5820-0x45e6664 .eh_frame r-- 2297412
 0x45e6664-0x45e6872 .gcc_except_table r-- 526
 0x47e75b0-0x47e75c8 .tbss --- 24
 0x47e75b0-0x47e8710 .init_array rw- 4448
 0x47e8710-0x47e8720 .fini_array rw- 16
 0x47e8720-0x47e8d00 .data.rel.ro rw- 1504
 0x47e8d00-0x47e8f50 .dynamic rw- 592
 0x47e8f50-0x47e9ff8 .got rw- 4264
 0x47ea000-0x47fbad8 .data rw- 72408
 0x47fbae0-0x4a245f8 .bss --- 2263832
 0x400000-0x500000 load1a r-x 1048576
 0x500000-0x45e7000 load1b --- 68055040
 ...
 0x7fc7cc2c8000-0x7fc7cc2c9000 load65b --- 4096
 0x7fc7cc4c8000-0x7fc7cc5bd000 load66 r-- 1003520
 0x7fc7cc4c9000-0x7fc7cc5bd000 load67 rw- 999424
 0x7fc7cc4ca000-0x7fc7cc5bd000 load68 r-x 995328
 0x7fc7cc7b2000-0x7fc7cc7d6000 load69 r-- 147456
 0x7fc7cc7ba000-0x7fc7cc7d6000 load70 rw- 114688
 0x7fc7cc7bc000-0x7fc7cc7d6000 load71 rw- 106496
 0x7fc7cc7d1000-0x7fc7cc7d6000 load72 r-x 20480
 0x7fc7cc9d3000-0x7fc7cc9f7000 load73 r-- 147456
 0x7fc7cc9d4000-0x7fc7cc9f7000 load74 rw- 143360
 0x7fc7cc9d5000-0x7fc7cc9f7000 load75 r-x 139264
 0x7fc7ccbdb000-0x7fc7ccbea000 load76 rw- 61440
 0x7fc7ccbe0000-0x7fc7ccbea000 load77 rw- 40960
 0x7fc7ccbed000-0x7fc7ccbf9000 load78 rw- 49152
 0x7fc7ccbf6000-0x7fc7ccbf9000 load79 r-- 12288
 0x7fc7ccbf7000-0x7fc7ccbf9000 load80 rw- 8192
 0x7fc7ccbf8000-0x7fc7ccbf9000 load81 rw- 4096
 0x7ffff2f02000-0x7ffff2f24000 load82 rw- 139264
 0x7ffff2f75000-0x7ffff2f78000 load83 --- 12288
 0x7ffff2f78000-0x7ffff2f7a000 load84 r-x 8192
```

## mm find 

Find the specified data in memory.

* mm find [address]

```
(gdb) p $isolate->heap_.code_space_
$2 = (class v8::internal::CodeSpace *) 0x60274a0
(gdb) mm find 0x60274a0
0x5f9d2c0
0x5f9d308
0x2a3fd0200058
0x2a3fd0240058
0x2a3fd0240058
0x2a3fd0240058
Found 6
```

## mm arena 

Displays arena information for ptmalloc.

```
(gdb) p &main_arena
$1 = (malloc_state *) 0x7fc7cbd8f760 <main_arena>
(gdb) mm arena 0x7fc7cbd8f760
0x6175070, 0x7fc7ac000020
0x7fc7cbd8f760: 0x6175070 2318336 (2654208)
0x7fc7ac000020: 0x7fc7ac008030 167936 (950272)
0x7fc7a8000020: 0x7fc7a8005160 135168 (561152)
0x7fc7b0000020: 0x7fc7b00008b0 135168 (135168)
0x7fc7b4000020: 0x7fc7b40093c0 139264 (139264)
0x7fc7c0000020: 0x7fc7c0004690 139264 (139264)
0x7fc7bc000020: 0x7fc7bc000dd0 135168 (135168)
0x7fc7c4000020: 0x7fc7c4000990 135168 (135168)
```

## mm walk

遍历 malloc_chTraverse malloc_chunk to display size and inuse information.unk，显示大小及 inuse 信息。

* mm walk [start_address] [end_address] [show_only_inuse]

```
(gdb) mm walk 0x5f60000 0x6196000 1
0x5f60000 :  32
0x5f60020 :  48
0x5f60050 :  192
0x5f60110 :  192
0x5f601d0 :  48
0x5f60200 :  48
0x5f60230 :  64
0x5f60270 :  48
0x5f602a0 :  48
0x5f602d0 :  48
0x5f60300 :  48
0x5f60330 :  48
0x5f60360 :  48
0x5f60390 :  48
0x5f603c0 :  48
0x5f603f0 :  48
0x5f60420 :  48
0x5f60450 :  48
0x5f60480 :  48
0x5f604b0 :  48
...
0x6148d50 :  4112
0x6149d60 :  65552
0x6159d70 :  20848
0x6169c80 :  208
0x6169d50 :  48
0x6169d80 :  48
0x6169dd0 :  4112
0x616ade0 :  4112
0x616bdf0 :  4112
0x6170170 :  544
0x61704d0 :  96
0x6170530 :  32
0x6170550 :  32
0x61725c0 :  48
0x61725f0 :  48
0x6172620 :  48
0x6174fb0 :  32
0x6174fd0 :  80
0x6175020 :  80
total 2318336, inuse(2032336), freed(150944)
```