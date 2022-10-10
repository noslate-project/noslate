# 使用 MacOS 调试

## 系统依赖
* Catalina+
* LLDB 11.0+ (Xcode 自带)
* GDB 10.2 (通过 `andb-gdb`)

## 使用 XCode 内置 lldb 调试 

安装 xcode 后自带的 lldb 即可，无需其他额外安装。


## 使用预编译的 andb-gdb 调试

`brew` 仓库默认的 gdb 只适合 MacOS 平台的 Corefile，要调试 Linux 平台的 Corefile 需要重新进行编译，或使用 andb 预编译的版本。
`andb-gdb` 是多平台预编译的 gdb 工具，当前版本为 `10.2`。

```bash
$git clone git@github.com:noslate-project/andb-gdb.git

# 同样需要把 gdb 环境变量加入
$cd andb-gdb
$source env.sh
x86_64-Darwin
```

## 配置工具

克隆 `andb` 仓库
```bash
git clone git@github.com:noslate-project/andb.git
```

将 `andb` 环境变量加入
```bash
$cd andb
$source env.sh
andb loader enabled, please use 'andb' command to start debugging.
```

使用 `andb` 检查所使用的路径
```bash
[zlei@IntelMac andb]$ andb
/Users/zlei/demo/andb/loader
```

## 一般性调试

采用 `gdb` 进行调试，并加载 core.pid 文件。
```bash
andb -l -c core.pid
```

采用 `lldb` 进行调试，并加载 core.pid 文件。
```bash
andb -g -c core.<pid>
```

## 手动调式方法

在调试非官方发行版的 core 文件时，会需要采用手动调试方法，此时需要准备如下文件，并放置在相同目录下，
* 配套的二进制文件，如 node，必须与 core.pid 文件配套。
* 配套的 node.typ 文件，也可以直接采用和官方 release 相同版本的 node.typ 文件。
* core.pid 文件

```bash
# 使用 gdb 调试
andb -g node -c core.pid

# 或 使用 lldb 调试
andb -l node -c core.pid
```
