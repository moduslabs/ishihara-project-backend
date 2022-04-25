import { hostname } from "os";

export function getLogicalId(resource: string) {
  return `${resource}-${getNamespace()}`;
}

export function getNamespace(): string {
  return process.env.NAMESPACE || hostname().toLowerCase().substring(0, 6);
}
