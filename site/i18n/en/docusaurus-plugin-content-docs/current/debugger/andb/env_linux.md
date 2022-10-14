# Debug with Linux

## System dependencies
* Python 2 or 3 
* GDB 8.3+
* LLDB 7.0+

### How to get gdb version

Check the current system gdb version
```bash
gdb --version
GNU gdb (GDB) 10.2
```

Check the python version used by gdb
```
$gdb
(gdb) pi
>>> import sys
>>> print(sys.version)
2.7.5 (default, Nov 11 2020, 14:14:29)
[GCC 4.8.5 20150623 (Red Hat 4.8.5-39)]
```

### lldb version

检查当前系统 lCheck the current system lldb versionldb 版本

```bash
lldb -version
lldb version 7.0.1
```

Check the python version used by lldb

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

## Prepare the debugging environment
If your Linux system does not meet the above requirements, you need to install it first

### Set up the gdb debugging environment

## Use precompiled andb-gdb

`andb-gdb` is a multi-platform precompiled gdb tool, the current version is `10.2`.

```bash
$git clone git@github.com:noslate-project/andb-gdb.git

# Also need to add the gdb environment variable
$cd andb-gdb
$source env.sh
x86_64-Linux
```

#### CentOS 7

The default version of gdb installed on CentOS 7 is `7.4`,
It is recommended to use gdb from the devtoolset-9 package in the Software Collections (SCL), version `8.3-3.el7`

```bash
# install devtoolset-9-gdb package with yu
$yum install devtoolset-9-gdb

# use devtoolset-9 
$source /opt/rh/devtoolset-9/enable

# version info
$gdb --version
GNU gdb (GDB) Red Hat Enterprise Linux 8.3-3.el7
```

### Set up the lldb debugging environment

#### CentOS 7

```bash
# install llvm-toolset-7.0-lldb with yum
$yum install llvm-toolset-7.0-lldb

# use llvm-toolset-7
$source /opt/rh/llvm-toolset-7.0/enable

# version info
$lldb --version
lldb version 7.0.1
```

## Configuration tool

Clone the `andb` repository
```bash
$git clone git@github.com:noslate-project/andb.git
```

Add the `andb` environment variable
```bash
$cd andb
$source env.sh
andb loader enabled, please use 'andb' command to start debugging.
```

Use `andb` to check the paths used
```bash
$andb
~/demo/andb/loader
```

## General debugging

Debug with `gdb` and load the core.pid file.
```bash
$andb -l -c core.pid
```

Debug with `lldb` and load the core.pid file.
```bash
$andb -g -c core.<pid>
```

## Manual tuning method

When debugging core files of unofficial distributions, manual debugging methods are required. At this time, the following files need to be prepared and placed in the same directory.
* Companion binaries, such as node, must be paired with the core.pid file.
* Companion node.typ file, you can also directly use the same version of the node.typ file as the official release.
* core.pid file

```bash
# Debug with gdb
$andb -g node -c core.pid

# or debug with lldb
$andb -l node -c core.pid
```
