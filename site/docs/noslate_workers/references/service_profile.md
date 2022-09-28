# 服务路由配置
Noslated 支持以服务的形式调用函数，服务可以包含多个函数以及其对应比例，一般用于灰度发布场景，防止影响已有流量。

服务有两种类型：
1. 一对一（default）
2. 负载均衡（proportional-load-balance）

|属性名|类型|描述|
|----|----|----|
|name|string|服务名，用于调用时识别具体是哪个服务|
|type|string|服务类型，取值：default、proportional-load-balance|
|selector|[DefaultServiceSelector](#defaultserviceselector)|仅在 type 为 default 时生效，指定服务对应函数|
|selectors|[LoadBalanceSelector\[\]](#loadbalanceselector)|仅在 type 为 proportional-load-balance 是生效，指定服务对应函数及比例|

## DefaultServiceSelector

|属性名|类型|描述|
|----|----|----|
|functionName|string|函数名|

## LoadBalanceSelector

|属性名|类型|描述|
|----|----|----|
|selector|[DefaultServiceSelector](#defaultserviceselector)|指定函数|
|proportion|number|比例为 0-1，服务下所有函数总比例值加和为 1|