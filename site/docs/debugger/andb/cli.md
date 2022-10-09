# 命令行

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