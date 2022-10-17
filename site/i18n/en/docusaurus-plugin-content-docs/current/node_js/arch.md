# Platform Architecture-Oriented Optimization

## Why optimize for a specific platform architecture?

Node.js supports multiple architectures including x64, arm64, etc. However, in response to the rapid development of ARM chips, upstream versions often only provide basic adaptations and lack optimization for new instruction sets, resulting in a lack of potential performance improvements on ARM chips.

Most of the current mainstream cloud vendors provide an arm architecture and a cost-effective operating environment. Noslate's optimizations for platforms such as ARM allow applications to achieve higher performance and efficiency on these architectures.

At present, Noslate has customized optimization for Alibaba Cloud Ampere and Alibaba Cloud Yitian, and future plans include supporting other architectures in the OpenAnolis community.

### 一、zlib feature optimization

The Noslate arm64 version uses cloudflare/zlib to optimize the performance of zlib on the arm platform, and has about 20% improvement in related functions.

If desired, use `--[no-]cloudflare-zlib` to override the default behavior at build time.