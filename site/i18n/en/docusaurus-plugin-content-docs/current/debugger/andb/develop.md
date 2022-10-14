# Andb 开发


## Reload 代码修改

gdb 使用 `pi` 命令， lldb 使用 `sc` 命令。
```
(gdb) pi reload(andb.cli.v8)
<module 'andb.cli.v8' from '~/zlei/noslate/andb/andb/cli/v8.pyc'>
(gdb) pi reload(andb.shadow.visitor)
<module 'andb.shadow.visitor' from '~/zlei/noslate/andb/andb/shadow/visitor.pyc'>
(gdb) qui
```
