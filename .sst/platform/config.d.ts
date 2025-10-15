import "./src/global.d.ts"
import "../types.generated"
import { AppInput, App, Config } from "./src/config"
import * as _cloudflare from "@pulumi/cloudflare";
import * as _aws from "@pulumi/aws";


declare global {
  // @ts-expect-error
  export import cloudflare = _cloudflare
  // @ts-expect-error
  export import aws = _aws
  interface Providers {
    providers?: {
      "cloudflare"?:  (_cloudflare.ProviderArgs & { version?: string }) | boolean | string;
      "aws"?:  (_aws.ProviderArgs & { version?: string }) | boolean | string;
    }
  }
  export const $config: (
    input: Omit<Config, "app"> & {
      app(input: AppInput): Promise<Omit<App, "providers"> & Providers> | (Omit<App, "providers"> & Providers);
    },
  ) => Config;
}
