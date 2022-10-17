# Service Routing Configuration
Noslated supports calling Worker functions in the form of services. A service can contain multiple Worker functions and their rates. It is generally used in grayscale publishing scenarios to prevent existing traffic from being affected.

There are two types of services:
1. one-to-one (default)
2. Load balancing (proportional-load-balance)

|property name|type|description|
|----|----|----|
|name|string|Service name, which is used to identify which service is called when calling|
|type|string|Service type, value: default, proportional-load-balance|
|selector|[DefaultServiceSelector](#defaultserviceselector)|It only takes effect when type is default, and the specified service corresponds to the Worker function|
|selectors|[LoadBalanceSelector\[\]](#loadbalanceselector)|It only takes effect when the type is proportional-load-balance. The specified service corresponds to the Worker function and rate|

## DefaultServiceSelector

|property name|type|description|
|----|----|----|
|functionName|string|Worker function name|

## LoadBalanceSelector

|property name|type|description|
|----|----|----|
|selector|[DefaultServiceSelector](#defaultserviceselector)|Specify Worker function|
|proportion|number|The rate is 0-1, and the sum of the total scale values ​​of all Worker functions under the service is 1|