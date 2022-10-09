# BuildID

Noslate Debugger 使用 BuildID 关联 Corefile 和对应的可执行文件。

一般由 Kernel 或 Arthur 产生的 Corefile 文件，将包含了二进制的 BuildID 信息，该信息会被识别该 Corefile 产生时的可执行信息。

目前 Noslate Debugger 仅收集 Node.js / Alinode / Aworker 官方发布分版本，对于本地构建、测试的版本可能无法直接匹配。
如果私有版本与官方 Release 的版本没有太大修改，也可直接所对应版本的调试信息 `node.typ` 文件用于离线分析使用。

> 什么是 BuildID   
> BuildID 是每个二进制进行编译的时候，基于所使用的编译器，编译平台，编译对象所生成的一个SHA-1摘要。

查看可执行文件的 BuildID 信息，

```bash
$file `which node`
~/.tnvm/versions/alinode/v6.6.1/bin/node: ELF 64-bit LSB executable, x86-64, version 1 (GNU/Linux), dynamically linked (uses shared libs),
for GNU/Linux 2.6.32, BuildID[sha1]=dd4fafe768d8936def3efe83e467d464841f58d8, not stripped
```

## Alinode 支持的BuildID

| Version | BuildID | 
|-|-|
| alinode-v5.0.0|   214321ead77541d553620875738a24f7b9119451 |
| alinode-v5.1.0|   2363b0fd087fa16bd37b68f8860c3c87108bbd38 |
| alinode-v5.13.0|  7959eb13a4c66a36142b48fe718c37540078d6f2 |
| alinode-v5.14.0|  3b4960f5341bb5cfae9f4023c7f94a17f29b9d5d |
| alinode-v5.15.0|  397e7faa5747f62b24a906dfec6e0741f22bbb92 |
| alinode-v5.16.0|  1d79f20ddfc280c71054a8bd1385d1f04e1fd779 |
| alinode-v5.16.3|  0460ba8c26331ce8cdd890c815f50585568dad1e |
| alinode-v5.16.4|  f0176210a5c83c898596e08f81b929f1a98b2e75 |
| alinode-v5.17.1|  3f8fc6e39d4ff6f6a89b88a4b3119e819fcfe339 |
| alinode-v5.18.1|  5c61accecd47cf2312a986e92bc1ee45faea1743 |
| alinode-v5.19.0|  19798a0e6cc23830b5228ec28abacc54676fe069 |
| alinode-v5.20.0|  17a6b03aed87ec593244bd3468fdfcd6c8ac703c |
| alinode-v5.20.1|  32e3fac100d828c4925ed2e3b39f69d93ab03785 |
| alinode-v5.20.2|  a597890ed35f1b8b6bdc888260ea57742aaf4974 |
| alinode-v5.20.3|  8b032d5c9d401359bf29391ceb7c73677b597f08 |
| alinode-v5.20.4|  34991b1bb169a86f1fb811cce5318a49db40fb99 |
| alinode-v5.20.5|  81f6191d5c8ca780a45dc56b03c847bcc705b177 |
| alinode-v5.20.6|  60d2ca87729af8466582f41f47984d4c4efb4806 |
| alinode-v5.2.0|   f619e75958e6dee84eb30b08fc9002d0cd139a7f |
| alinode-v5.3.0|   85203d972aa20586d8270a170bd5d6529526db59 |
| alinode-v5.3.1|   e76285d66057771ba02bf602d7ca606ec778e53c |
| alinode-v5.4.0|   0efd0c32909e29e637954eaec7fa5a5e19e36b27 |
| alinode-v5.5.0|   be970b08ad15b205ba624f5d3094df7ec3d4a4cd |
| alinode-v5.6.0|   a86f844fa420afd932672f171c8ae6abcbf66f1d |
| alinode-v5.7.0|   18e01a77da5f2bad4f42d30b9081f515b9aa845c |
| alinode-v5.8.0|   52b172edad5020a8938e21ea9dba27e28bfec19e |
| alinode-v5.8.1|   54e926c4db9d3e2ebc15bd0009c3b97d5c4deff9 |
| alinode-v5.9.0|   69465099488471ecfec403c868eab143ab63db6e |
| alinode-v6.0.0|   ba4d7c06f8a27c459110ea71e61afb4ac6b08193 |
| alinode-v6.1.0|   7c97819cca203937b88bffa4742591d5b6b24398 |
| alinode-v6.2.0|   4d6d534fe23b117477b18cef7f4c469884ab6180 |
| alinode-v6.3.0|   342a6fbef55ec413f3f5495b610885bae3db2799 |
| alinode-v6.4.0|   2b43751269765ba515ac93d17625d2bce47cc9bf |
| alinode-v6.4.1|   c4a67d43882b742374d84b03b60dfb0c72c612e5 |
| alinode-v6.4.4|   d3badfc478656ee5c7628425e90caa874668af8f |
| alinode-v6.5.0|   73c9f5e221cd7fe1c57dd3b5c256a9b06c225e3b |
| alinode-v6.5.1|   3cc8649ef1f4a01a04be85e7d40c279be59e6279 |
| alinode-v6.6.0|   2dc56139b412aeaab2f73956c123d71d6b4bb296 |
| alinode-v6.6.1|   dd4fafe768d8936def3efe83e467d464841f58d8 |
| alinode-v6.7.0|   5a2a93dd839c8ce9ef5a1b0ab4826de47c550051 |
| alinode-v6.7.1|   00897ff5a4a4e18003d46fe76cca091af4f9f1a6 |
| alinode-v6.8.0|   52cfa910a6b28885446fbd9bfea987704787e99c |
| alinode-v6.8.1|   79e71b52b1a977df57d5a5b11c49419a67529dec |
| alinode-v7.0.0|   b7777c5fd71573e7d7b5a04f0c34b51afdef24d4 |
| alinode-v7.1.0|   c461a1a2eb667c69e575a2415050f40242b1ffdb |
| alinode-v7.2.0|   5d6010bdb17d5d298e47e41f43d438d5eaaf8146 |
| alinode-v7.3.0|   320fa955a69c9b9cfc063db979384d8fe86e7e40 |
| alinode-v7.4.0|   083ba14b02b85f2acdcc118a52debe2aa0353867 |
| alinode-v7.5.0|   a680ac17e55da3ef5909ffde939cfe9ac6004c4d |
| alinode-v7.6.0|   7268ec02f26af94b060a291ed57f2953f79a7ea8 |

## Node.js 支持的BuildID

| Version | BuildID | 
|-|-|
| node-v12.0.0|     200f21d3e9c3121bc7722976876216a83d6efba5 |
| node-v12.10.0|    b0195cdf61a47a600e005415aec752d8e31c84cc |
| node-v12.1.0|     ad8e702e537e866d8689f3f0ea1dbb42a59244d9 |
| node-v12.11.0|    9c296e425bbb388278638ab4aaa3320306f1eedb |
| node-v12.11.1|    2fb4d23c650942e1f29711ae4685986aed8e0355 |
| node-v12.12.0|    7c6cf3affd5708e088d46f7a2887ea314293cb8a |
| node-v12.13.0|    55ed8211666f9ccba08369dc9507a3d65fcc09d3 |
| node-v12.13.1|    78d3113df82429048fda632489c1b285c80716c3 |
| node-v12.14.0|    873e73572701aedecde030ff1a1b65edca359ac8 |
| node-v12.14.1|    622169354501e35c3bc941d447d278b67e318502 |
| node-v12.15.0|    6150ed3ce6004d26e8883bde3f40e52edaeb3cbe |
| node-v12.16.0|    f8bb3c0340e126f071193df391e29b9ef3c65281 |
| node-v12.16.1|    2ae702fc85a5bf9cc26efb1ba92e82257f5eff45 |
| node-v12.16.2|    eb3d9cfda380eed3bb3623425ffee67a2b6ba35b |
| node-v12.16.3|    f75394694433d17c6bd179658eb6d6a1541e2c26 |
| node-v12.17.0|    8be87e5c1f36ad34cb08abed0e2d971975b2bd54 |
| node-v12.18.0|    b4d305608210b0afdf8ae61ef9321245e02eeeab |
| node-v12.18.1|    0fbb2dad36c54294ada759988ead848953a0bd6c |
| node-v12.18.2|    53f3dfe7f7d0999c42ac1e5543e5c4a10fe017d6 |
| node-v12.18.3|    48b59ee612c13e556e0b1fae84c06398f4fc942a |
| node-v12.18.4|    7a29fb2569594deb79e1addd6598ca26bdde54ce |
| node-v12.19.0|    be7f543d0d6b4fdba8708c8f73a23283ddd3ad2a |
| node-v12.19.1|    617f6a4c4a2d9862b2a99f042a1f03a8dbcc2f63 |
| node-v12.20.0|    5cf4917396754e9d93880201b628c08d922156bd |
| node-v12.20.1|    ed09c4fb70a7f7adcbc3806c7fa3ce07198cd92c |
| node-v12.20.2|    629c716568cd36799d005fb622599d4c54bf1bc6 |
| node-v12.2.0|     8f7eb89476ab841f595a694580a0ca2d49aa3e99 |
| node-v12.21.0|    06932a6c713d7457c0da20d6d0170197c4181ae6 |
| node-v12.22.0|    f615ba1141e04fdde034a6f952009d7b9b2907fa |
| node-v12.22.10|   9c61faf37a7fa65f9ed81af6270364e5581f9d4c |
| node-v12.22.11|   880083084d5c46af953a908db91552278d257b3c |
| node-v12.22.12|   10f71259ae2dbb3dcaf7e808fe945f275a7cef80 |
| node-v12.22.1|    6a30d0890d3eb3886fea50084a1dceb4ce8a190a |
| node-v12.22.2|    d16bbd1e80415bf63b189c0ebbc80c92b4449ca1 |
| node-v12.22.3|    60948193402994edad9613c1b47f9f88886b113c |
| node-v12.22.4|    e7d43414cc29adc28f4b390759da66536bdc700c |
| node-v12.22.5|    7606850dba0728e642e23c5548849ac65166b219 |
| node-v12.22.6|    4b0ac0b7823936d3b9ee59ace3575d4ffd330fe9 |
| node-v12.22.7|    e8fb27f8ea8ea808d50130616d0b2ab847eac7d6 |
| node-v12.22.8|    c4b1926ee4798b57f3f21ea093028202c741f413 |
| node-v12.22.9|    3eee008f4bd1c79a172ade0edef37f4daf7351c3 |
| node-v12.3.0|     e51168e21c4932cb8df56af9d4052698a5d9e8ba |
| node-v12.3.1|     225a4d8cda3ea308a1e964974d5e3a04a0a3e31f |
| node-v12.4.0|     831d85545809936623bbe700e5ef1e4d5965512c |
| node-v12.5.0|     70219f55ea0a604c1c2c1a475e1f7382007cb6ad |
| node-v12.6.0|     225a7a477be5a9f7421b6771418d4dda0a7c7e06 |
| node-v12.7.0|     d96011313266dc5295990ae5b6e2926a9e3ecc19 |
| node-v12.8.0|     ee2a0d3d789afb14c7305986809145bc9fb089cb |
| node-v12.8.1|     7c41d1443867514499864513b13a5dcfdd9d9b6a |
| node-v12.9.0|     d12a8919c451b956278e9c9c4f7ad85c2c51b41e |
| node-v12.9.1|     7ea4af6f4d2f83fcc3fc6942a88318f2a3903bdc |
| node-v14.0.0|     66795e18e2ed277704d805888b2022b416af24d1 |
| node-v14.10.0|    19e19579d4a5e6e10fd4aa5ca6977e54e8f3634c |
| node-v14.10.1|    9d182c3bc8fec15ed719c3847d2bf5337bc8ad36 |
| node-v14.1.0|     7d94c281c64f097cde87fc8ff7b09c064a07a3ee |
| node-v14.11.0|    913f052c16ee05318aae7a4c2a6e1b6485ef2748 |
| node-v14.12.0|    0c122e253c1c7041087bfcfeacf0c9e759c6993c |
| node-v14.13.0|    90881679cfa4581236e8846d882e7c9055d79e01 |
| node-v14.13.1|    232e6372a53f4e3c746bfb3a70bd3cbe91b062da |
| node-v14.14.0|    4c4fe7b96e00e32ba59e22870324e6acf26eb1d1 |
| node-v14.15.0|    87a706773946e48debba76b920299db9de012fcb |
| node-v14.15.1|    1061d437c4067ff0ce6d8b1ddca0bf73fc2959f9 |
| node-v14.15.2|    752d972ff4a4e8e2e8318663adb0b4a6fd05bebf |
| node-v14.15.3|    69b825687512b1a1ec845bab2650f8467bc04303 |
| node-v14.15.4|    3040a1d7f18d0f099c0b61851e65e170e8a196cd |
| node-v14.15.5|    be2844f397edf7091021569249abf2f49a7dc798 |
| node-v14.16.0|    c30982e8224bcd8b307b63f48132d7dd96e1a12b |
| node-v14.16.1|    c1b2465afc15fad12c516db8e6fe8733f58f1897 |
| node-v14.17.0|    2f21ac9097cc7e724ee5267f94d2adf88f840704 |
| node-v14.17.1|    49590d13ae99d7edd348a457ab0a62138e861324 |
| node-v14.17.2|    3a569846b623914a7ec1f7b49965cd30ff7273a6 |
| node-v14.17.3|    43b48bd33528b6b7cab933d1e32733827be642e5 |
| node-v14.17.4|    8e13a7160056dc551263a6ba2caae0f87dfb3e7e |
| node-v14.17.5|    e3a0db58608b9273e4a0ae3c62806acf06f21c7a |
| node-v14.17.6|    5f0a9011b560f95946d835111e65b06f74c482de |
| node-v14.18.0|    7c488e62cc870eb3b205a3f7f578e28ed9b973eb |
| node-v14.18.1|    f9a5a2e91f7292de4ccb12197c69c863b4d9a013 |
| node-v14.18.2|    3d052a3d1391f7d7e13f3b9f33f7ebc1dd4ff449 |
| node-v14.18.3|    4862f890fde1c2c2bf5484145edd08a94d390ad3 |
| node-v14.19.0|    a95007cb4ac2c8a0af98f07033657a0266153120 |
| node-v14.19.1|    35f0f1ca0b3a7a8e5a0e8bc6eb74d37586b00f78 |
| node-v14.19.2|    e589a8421fc540df75e52c4fe0d6de08718c971e |
| node-v14.19.3|    ff3848f46302be52dd8c75303ccc0dcaad227296 |
| node-v14.20.0|    cc4e016e0bb4dc10ac65031d0516f470932d0264 |
| node-v14.20.1|    e3562c0eec0c280f382cbcddae66506273a4f5e0 |
| node-v14.2.0|     66c45edeccea5a05e9fc0ff613b55d71a7a629cf |
| node-v14.3.0|     fa331e12477c418d647c8c54ea6ad5c20bf6c76c |
| node-v14.4.0|     d97858bd19343ab011a1aff392135ef18af31622 |
| node-v14.5.0|     b265684e2603a7e5d74d28b300ab78ed51f9898f |
| node-v14.6.0|     975d460d64d9ece2960fc95867b484e68eb27932 |
| node-v14.7.0|     f1316e65ea7c8941219576adf3f5ff109d49031f |
| node-v14.8.0|     3c9783dcf10189fe32f3464bba0b91957580d7be |
| node-v14.9.0|     99a1fb038f89d9154b820dea2d2e6a81a2042b56 |
| node-v16.0.0|     269c3520aafda1f8d81517609f0d38b1114d2fef |
| node-v16.10.0|    b5b6a34e6207557d4edbc96dda9800d793eb4f36 |
| node-v16.1.0|     75b67faec92aa2710efd26a1cbbec78c6731c0f1 |
| node-v16.11.0|    e215e37da574f3e88cbb2e3a97c31f23e46b46fa |
| node-v16.11.1|    4f7deb3694fa2585f76a2f851c9ea8ec08fc0a21 |
| node-v16.12.0|    4c9e2eac18a9153359664e9687f5b36af3ae064e |
| node-v16.13.0|    0af7bbffac8ee2bd34621a1ffc939e604859a85b |
| node-v16.13.1|    b84365bb5fa973b3b5da465a764de5bd2e465bd9 |
| node-v16.13.2|    981829de80a0f0db20280412e3d28cfc5d92a7e5 |
| node-v16.14.0|    9d2e28b8cbe6df7f1897c462d8bf92f505115c35 |
| node-v16.14.1|    9d476dd43308733d24f01fc8141fb5e61bbe1b5c |
| node-v16.14.2|    1d7c138e4867722c82de22bab51eef3232beb1b0 |
| node-v16.15.0|    4911ad0c48ca2db7ca447b4430858ac3391762cd |
| node-v16.15.1|    e185c976ed6ac7f620c607bb5cedd3a1e9e888ca |
| node-v16.16.0|    c783965ea6be39c7d61f87b0cd700770645d6e0d |
| node-v16.17.0|    e8b23b15ec6280a0d4838fbba1171cb8d94667c5 |
| node-v16.17.1|    7dddbc0a9b0312957ec8892bae8b9f98682f82a2 |
| node-v16.2.0|     b3f93ccbfadbba78d93231afff7dfc1d4452ac15 |
| node-v16.3.0|     368e3315847e8db4a80ee826c2eebc99383a0be9 |
| node-v16.4.0|     2c06692def591c2970f5bd53a03755e313195760 |
| node-v16.4.1|     8838b676ea98f4bd091ab0e2a656082609f3066a |
| node-v16.4.2|     8d0d30473829f8b1f0233d54074a549f590ec9f2 |
| node-v16.5.0|     95e8fce5816bb631de0b5b27099c9d09231514a4 |
| node-v16.6.0|     f3a1d56818892d7921e307a7e2f444e860f92df7 |
| node-v16.6.1|     7caf7f6d91597d57ccf906d9cfca48a6709459fb |
| node-v16.6.2|     c7cf568910a29aa6c34b4863d510609f97498da7 |
| node-v16.7.0|     0d4ba34b98010e06f8299da381176b465ca221fd |
| node-v16.8.0|     b601c5bdb25575977b2954953e36ca78bf2471cd |
| node-v16.9.0|     5ae796fd8d9e352978ba3e6ba54402c90036ff84 |
| node-v16.9.1|     5d18e709c6d6274d5b3769bacaa39c1e28305138 |

