# Working Directory Conventions

```
-- <library>                            Non-runtime configuration, the files in the directory are packaged by the distribution package, not writable, consistent for all platforms
    |-- /bin
    |    |-- turf                       binary file of turf
    |    |-- node                       with release node
    |    |-- aworker                    with release aworker
    |-- /scheduler/lib/turf/            JS wrapper for invoking turf by agent
    |-- /delegate
    |-- index.js
    |-- package.json

-- /<workdir>                           Configurable
    |-- /noslated
    |    |-- /caches
    |    |    |-- <uri>                    Worker function code package cache directory, unique to the code package (image)
    |    |    |    |-- f.yaml               user config
    |    |    |    |-- config.json        user config
    |    |-- /bundles                    Image directory, unique to Worker functions
    |    |    |-- <uri>                    Worker function unique identify
    |    |    |    |-- code
    |    |    |    |    |-- f.yaml          user config
    |    |    |    |    |-- config.json   user config
    |    |    |    |-- config.json        Unique to Worker functions, created and managed by Noslated
    |-- /turf
    |    |-- turf.sock
    |    |-- /runtime                    Turf runtime executable
    |    |    |-- nodejs-v16                Can be used as a rootfs, corresponding to config.json | turf.runtime
    |    |    |     |-- bin
    |    |    |     |    |-- node
    |    |    |-- aworker                Can be used as a rootfs, corresponding to config.json | turf.runtime
    |    |    |     |-- bin
    |    |    |     |    |-- aworker
    |    |-- /overlay
    |    |    |-- <id>                     Worker instance ID, unique to the Worker instance
    |    |    |     |-- data               User modified files
    |    |    |     |-- work               overlayfs temporary data
    |    |    |     |-- merged           overlayfs mount point
    |    |    |     |-- code              Code package, corresponding to config.json | turf.code
    |    |-- /sandbox                  Turf workdir
    |    |    |-- <id>                     Worker instance ID, unique to the Worker instance
    |    |    |     |-- status             turf status information, can be read directly (json format)
    |    |    |     |-- config.json      turf creates the spec of the Worker instance, the spec specified when creating

-- /<log-dir>                          Configurable
    |-- <name>                         Worker instance name, unique to the Worker function
    |    |-- <id>                         Worker instance ID, which will be printed in the agent log when invoked, unique to the Worker instance
    |    |     |-- stderr                 Worker instance stderr
    |    |     |-- stdout                 Worker instance stdout
```