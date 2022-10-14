# Command Line

The andb provides a unified command line through the debugger's command line interface.

The command line is composed of "prefix + subcommand + command parameter", different prefixes,
- isolate : isolate the core structure command
- heap : v8 heap related commands
- v8 : v8 related debug commands
- node : node related debugging commands

Command line completion can be provided under gdb, but it cannot provide automatic completion due to the implementation of lldb. Subcommands can be obtained using "?",
```bash
(gdb) heap ?
snapshot page dump space
(gdb) iso ?
guess
```

In the absence of conflict, command abbreviations can be used, such as
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