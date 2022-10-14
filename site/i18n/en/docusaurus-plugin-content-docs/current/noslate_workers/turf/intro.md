# Turf

Under the Noslate architecture, the scheduling unit sinks from the previous container to the process, so resource isolation is very important. We are based on the capabilities provided by the Linux system,
Minimized authorization and resource usage restrictions for execution units are realized. At the same time, the user interface design complies with the OCI specification and provides Worker instance management capabilities. As a base component,
Responsible for managing the life cycle and resource usage of each Worker instance execution unit.

Think of turf as a resource configurator. It creates a new process through the `fork()` system call, and then configures the resources, isolation and permissions of the process. Finally, the program execution is handed over to the application code, after which the application runs in a constrained execution environment.

There are many names with similar meanings, such as sandbox, jail, container. Modern runtime isolation technologies are developed based on the isolation features or functions provided by similar hardware and kernels, but there are some differences between them due to the different environments in which they are applied. A sandbox generally emphasizes isolation, a jail generally emphasizes its limitations, and a container emphasizes its overall delivery. Therefore, docker simplifies operation and maintenance and improves efficiency with containerized delivery, but it may not be the most suitable
Noslate scene.

The main design goal of Turf is to provide Noslate Workers to host JavaScript functions, so it has some new features:
- JavaScript code runs in the VM, it does not directly call system calls;
- JavaScript dependency libraries may be many and large, and they will basically depend on external services;
- JavaScript is widely used in Web Server, Server Side Rendering and other services;
- The startup speed needs to be able to provide instant response to requests;

Therefore, the turf target provides some degree of isolation and shared file system and system services.
