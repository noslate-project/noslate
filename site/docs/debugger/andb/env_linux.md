# 使用 Linux 调试 

## 系统依赖
* Python 2 or 3 
* GDB 8.3+
* LLDB 7.0+

### gdb 版本获取方法

检查当前系统 gdb 版本
```bash
gdb --version
GNU gdb (GDB) 10.2
```

检查 gdb 所使用的 python 版本
```
$gdb
(gdb) pi
>>> import sys
>>> print(sys.version)
2.7.5 (default, Nov 11 2020, 14:14:29)
[GCC 4.8.5 20150623 (Red Hat 4.8.5-39)]
```

### lldb 版本

检查当前系统 lldb 版本

```bash
lldb -version
lldb version 7.0.1
```

检查 lldb 所使用的 python 版本

```bash
$lldb
(lldb) sc
Python Interactive Interpreter. To exit, type 'quit()', 'exit()' or Ctrl-D.
>>> import sys
>>> print(sys.version)
2.7.5 (default, Nov 11 2020, 14:14:29)
[GCC 4.8.5 20150623 (Red Hat 4.8.5-39)]
>>>
```

## 准备调试环境

如果你的 Linux 系统还不满足以上要求，需要先安装

### 设置 gdb 调试环境

## 使用预编译的 andb-gdb 

`andb-gdb` 是多平台预编译的 gdb 工具，当前版本为 `10.2`。

```bash
$git clone git@github.com:noslate-project/andb-gdb.git

# 同样需要把 gdb 环境变量加入
$cd andb-gdb
$source env.sh
andb loader enabled, please use 'andb' command to start debugging.
```

#### CentOS 7

CentOS 7 默认安装的 gdb 版本较旧为 `7.4`，
推荐使用 Software Collections (SCL) 中 devtoolset-9 软件包中的 gdb，其版本为 `8.3-3.el7`

```bash
# yum 安装 devtoolset-9-gdb 包
$yum install devtoolset-9-gdb

# 使能 devtoolset-9 
$source /opt/rh/devtoolset-9/enable

# 版本信息
$gdb --version
GNU gdb (GDB) Red Hat Enterprise Linux 8.3-3.el7
```

### 设置 lldb 调试环境

#### CentOS 7

```bash
# 通过 yum 安装 llvm-toolset-7.0-lldb 工具 
$yum install llvm-toolset-7.0-lldb

# 使能 llvm-toolset-7
$source /opt/rh/llvm-toolset-7.0/enable

# 版本信息
$lldb --version
lldb version 7.0.1
```

## 配置工具

克隆 `andb` 仓库
```bash
$git clone git@github.com:noslate-project/andb.git
```

将 `andb` 环境变量加入
```bash
$cd andb
$source env.sh
```

显示如下信息说明设置完成
```
andb loader enabled, please use 'andb' command to start debugging.
```

使用 `andb` 检查所使用的路径
```bash
$andb
~/demo/andb/loader
```

## 一般性调试

采用 `gdb` 进行调试，并加载 core.pid 文件。
```bash
$andb -l -c core.pid
```

采用 `lldb` 进行调试，并加载 core.pid 文件。
```bash
$andb -g -c core.<pid>
```

## 手动调式方法

在调试非官方发行版的 core 文件时，会需要采用手动调试方法，此时需要准备如下文件，并放置在相同目录下，
* 配套的二进制文件，如 node，必须与 core.pid 文件配套。
* 配套的 node.typ 文件，也可以直接采用和官方 release 相同版本的 node.typ 文件。
* core.pid 文件

```bash
# 使用 gdb 调试
$andb -g node -c core.pid

# 或 使用 lldb 调试
$andb -l node -c core.pid
```
