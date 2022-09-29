# 工作目录约定

```
-- <library>                            非运行时配置，目录下文件都是发行包打包的，不可写，对所有平台来说一致
    |-- /bin
    |    |-- turf                       turf 的二进制
    |    |-- node                       携带发行的 node
    |    |-- aworker                    携带发行的 aworker
    |-- /scheduler/lib/turf/            agent 调用 turf 的 JS wrapper
    |-- /delegate
    |-- index.js
    |-- package.json

-- /<workdir>                           可配置
    |-- /noslated
    |    |-- /caches
    |    |    |-- <uri>                    Worker 函数代码包缓存目录，对代码包（镜像）来说唯一
    |    |    |    |-- f.yaml               用户 config
    |    |    |    |-- config.json        用户 config
    |    |-- /bundles                    镜像目录，对 Worker 函数来说唯一
    |    |    |-- <uri>                    Worker 函数唯一标识
    |    |    |    |-- code
    |    |    |    |    |-- f.yaml          用户 config
    |    |    |    |    |-- config.json   用户 config
    |    |    |    |-- config.json        对 Worker 函数来说唯一，由 Noslated 创建与管理
    |-- /turf
    |    |-- turf.sock
    |    |-- /runtime                    TURF 运行时可执行文件
    |    |    |-- nodejs-v16                可以作为一个 rootfs，对应 config.json | turf.runtime
    |    |    |     |-- bin
    |    |    |     |    |-- node
    |    |    |-- aworker                可以作为一个 rootfs，对应 config.json | turf.runtime
    |    |    |     |-- bin
    |    |    |     |    |-- aworker
    |    |-- /overlay
    |    |    |-- <id>                     Worker 实例 ID，对 Worker 实例来说唯一
    |    |    |     |-- data               用户修改的文件
    |    |    |     |-- work               overlayfs 临时数据
    |    |    |     |-- merged           overlayfs 挂载点
    |    |    |     |-- code              代码包，对应 config.json | turf.code
    |    |-- /sandbox                  TURF 工作目录
    |    |    |-- <id>                     Worker 实例 ID，对 Worker 实例来说唯一
    |    |    |     |-- status             turf 状态信息，可以直接读取（json格式）
    |    |    |     |-- config.json      turf 创建 Worker 实例的 spec，create 时指定的 spec

-- /<log-dir>                          可配置
    |-- <name>                         Worker 实例名，对 Worker 函数来说唯一
    |    |-- <id>                         Worker 实例 ID，会在调用时 agent 日志中打印 ，对 Worker 实例来说唯一
    |    |     |-- stderr                 Worker 实例 stderr
    |    |     |-- stdout                 Worker 实例 stdout
```