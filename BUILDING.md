# Building Noslate

Depending on what platform or features you need, the build process may
differ. After you've built a binary, running the
test suite to confirm that the binary works as intended is a good next step.

## Prerequisites

### Unix prerequisites

* `gcc` and `g++` >= 8.3 or newer
* GNU Make 3.81 or newer
* Ninja 1.8.0 or newer
* Repo 2.29 or newer
* Python 3.6, 3.7, 3.8, 3.9, or 3.10

Installation via Linux package manager can be achieved with:

* Ubuntu, Debian: `sudo apt-get install python3 g++ make python3-pip ninja-build repo`
* CentOS and RHEL: `sudo yum --enablerepo=powertools install python3 gcc-c++ make python3-pip ninja-build`

Repo can also be installed manually as well as it's a single script.

```bash
$ mkdir -p ~/.bin
$ PATH="${HOME}/.bin:${PATH}"
$ curl https://storage.googleapis.com/git-repo-downloads/repo > ~/.bin/repo
$ chmod a+rx ~/.bin/repo
```

### macOS prerequisites

* Xcode Command Line Tools >= 11 for macOS
* Ninja 1.8.0 or newer
* Repo 2.29 or newer
* Python 3.6, 3.7, 3.8, 3.9, or 3.10

macOS users can install the `Xcode Command Line Tools` by running
`xcode-select --install`. Alternatively, if you already have the full Xcode
installed, you can find them under the menu `Xcode -> Open Developer Tool ->
More Developer Tools...`. This step will install `clang`, `clang++`, and
`make`.

Additionally, installation via brew package manager can be achieved with:

```console
$ brew install ninja repo
```

## Downloading the source codes

Repo, a Google-built repository management tool that runs on top of Git. See
[Source Control Tools][] for an explanation of the relationship between Repo
and Git and links to supporting documentation for each tool.

```bash
$ cd workspace/noslate
$ repo init -u https://github.com/noslate-project/manifest.git
$ repo sync
```

## Building Noslate

If the path to your build directory contains a space, the build will likely
fail.

To build Noslate at the root directory of repo project:

```console
$ make
```

The above requires that `python` resolves to a supported version of
Python. See [Prerequisites](#prerequisites).

### Running tests

To verify the build:

```console
$ make test
```

At this point, you are ready to make code changes and re-run the tests.

If you are running tests before submitting a pull request to a specific
sub-repo, use:

```console
$ make TEST_PROJECTS=aworker test
```

The definition of `TEST_PROJECTS` can specify the projects to be tested.

You can run tests at each sub-project's own working directory:

```console
$ cd aworker
$ make test
```

#### Building a debug build

If you run into an issue where the information provided by the JS stack trace
is not enough, or if you suspect the error happens outside of the JS VM, you
can try to build a debug enabled binary:

```console
$ cd build && make BUILDTYPE=Debug
```

`make BUILDTYPE=Debug` generates debug binaries in `build/out/Debug`.

When using the debug binary, core dumps will be generated in case of crashes.
These core dumps are useful for debugging when provided with the
corresponding original debug binary and system information.

### Building an ASAN build

[ASAN](https://github.com/google/sanitizers) can help detect various memory
related bugs. ASAN builds are currently only supported on linux.

Debug build is not necessary and will slow down build and testing, but it can
show clear stacktrace if ASAN hits an issue.

```console
$ cd build && ./configure --enable-asan && make
$ make test
```

### Speeding up frequent rebuilds when developing

If you plan to frequently rebuild Noslate, especially if using several branches,
installing `ccache` can help to greatly reduce build times. Set up with:

On GNU/Linux:

```bash
sudo apt install ccache   # for Debian/Ubuntu, included in most Linux distros
export CC="ccache gcc"    # add to your .profile
export CXX="ccache g++"   # add to your .profile
```

On macOS:

```bash
brew install ccache      # see https://brew.sh
export CC="ccache cc"    # add to ~/.zshrc or other shell config file
export CXX="ccache c++"  # add to ~/.zshrc or other shell config file
```

This will allow for near-instantaneous rebuilds even when switching branches.

[Source Control Tools]: https://source.android.com/setup/develop
