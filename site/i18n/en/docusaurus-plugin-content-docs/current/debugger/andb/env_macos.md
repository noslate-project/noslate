# Debugging with MacOS

## System dependencies
* Catalina+
* LLDB 11.0+ (Xcode self-contained)
* GDB 10.2 (by `andb-gdb`)

## Debugging with XCode's built-in lldb

The lldb that comes with xcode can be installed, no additional installation is required.


## Debug with precompiled andb-gdb

The default gdb in the `brew` repository is only suitable for the Corefile of the MacOS platform. To debug the Corefile of the Linux platform, you need to recompile, or use the andb precompiled version.
`andb-gdb` is a multi-platform precompiled gdb tool, the current version is `10.2`.

```bash
$git clone git@github.com:noslate-project/andb-gdb.git

# Also need to add the gdb environment variable
$cd andb-gdb
$source env.sh
x86_64-Darwin
```

## Configuration tool

Clone the `andb` repository
```bash
git clone git@github.com:noslate-project/andb.git
````

Add the `andb` environment variable
```bash
$cd andb
$source env.sh
andb loader enabled, please use 'andb' command to start debugging.
````

Use `andb` to check the paths used
```bash
[zlei@IntelMac andb]$ andb
/Users/zlei/demo/andb/loader
````

## General debugging

Debug with `gdb` and load the core.pid file.
```bash
andb -l -c core.pid
````

Debug with `lldb` and load the core.pid file.
```bash
andb -g -c core.<pid>
````

## Manual tuning method

When debugging core files of unofficial distributions, manual debugging methods are required. At this time, the following files need to be prepared and placed in the same directory.
* Companion binaries, such as node, must be paired with the core.pid file.
* The supporting node.typ file can also directly use the same version of the node.typ file as the official release.
* core.pid file

```bash
# debug with gdb
andb -g node -c core.pid

# or debug with lldb
andb -l node -c core.pid
````