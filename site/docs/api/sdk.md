# Noslated Client

```typescript
/**
 * Noslated Client
 */
interface NoslatedClient {
    start(): Promise<void>;
    close(): Promise<void>;
    invoke(name: string, data: Readable | Buffer, metadata?: IMetadata): Promise<ITriggerResponse>;
    invokeService(name: string, data: Readable | Buffer, metadata?: IMetadata): Promise<ITriggerResponse>;
    setDaprAdaptor(modulePath: string): Promise<void>;
    setPlatformEnvironmentVariables(envs: IKeyValuePair[]): Promise<void>;
    getPlatformEnvironmentVariables(): Promise<IKeyValuePair[]>;
    setFunctionProfile(profiles: RawFunctionProfile[], mode: Mode): Promise<void>;
    getFunctionProfile(): Promise<RawFunctionProfile[]>;
    setServiceProfile(profiles: ServiceProfileItem[]): Promise<void>;
    getServiceProfile(): Promise<ServiceProfileItem[]>;
    useInspector(funcName: string, use: boolean): Promise<void>;
}

interface ITriggerResponse extends Readable {
    status: number;
    metadata: IMetadata;
}

interface IMetadata {
  url?: string;
  method?: string;
  headers?: [string, string][];
  timeout?: number;
  requestId?: string;
}

type Mode = 'IMMEDIATELY' | 'WAIT';

interface BaseFunctionProfile {
  name: string;
  url: string;
  signature: string;
}

/**
 * + FILO: 先进后出
 * + FIFO: 先进先出
 * + LCC: 最少当前并发
 */
type ShrinkStrategy = 'FILO' | 'FIFO' | 'LCC';

interface ProcessFunctionProfile {
  resourceLimit?: {
    memory?: number;
    cpu?: number;
  };
  worker?: {
    shrinkStrategy?: ShrinkStrategy;
    initializationTimeout?: number;
    maxActivateRequests?: number;
    reservationCount?: number;
    replicaCountLimit?: number;
    fastFailRequestsOnStarting?: boolean;
    v8Options?: string[];
    execArgv?: string[];
    disposable?: boolean;
  };
  environments?: {
    key: string;
    value: string;
  }[];
  runtime: RuntimeType;
  rateLimit?: {
    maxTokenCount?: number;
    tokensPerFill?: number;
    fillInterval?: number;
  };
  namespace?: string;
}

interface NodejsFunctionProfile extends BaseFunctionProfile, ProcessFunctionProfile {
  runtime: 'nodejs-v16';
  handler: string;
  initializer?: string;
}

interface AworkerFunctionProfile extends BaseFunctionProfile, ProcessFunctionProfile {
  runtime: 'aworker';
  sourceFile: string;
}

type RawFunctionProfile = NodejsFunctionProfile | AworkerFunctionProfile;

type ServiceType = 'default' | 'proportional-load-balance';

interface LoadBalanceSelector {
  selector: DefaultServiceSelector;
  proportion: number;
}

interface DefaultServiceSelector {
  functionName: string;
}

export interface ServiceProfileItem {
  name: string;
  type: ServiceType;
  selectors?: LoadBalanceSelector[];
  selector?: DefaultServiceSelector;
}
```