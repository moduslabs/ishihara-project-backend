import { get } from "config";
import { hostname } from "os";

export interface CdkConfiguration {
  hostedZoneId: string;
  zoneName: string;
}

export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function getNamespace(): string {
  return process.env.NAMESPACE || hostname().substring(0, 6).toLocaleLowerCase();
}

export function getResourceName(baseName: string) {
  return `${baseName}-${getNamespace()}`;
}

export function getCdkConfiguration(): CdkConfiguration {
  return get<CdkConfiguration>("cdk");
}

export function isProduction(): boolean {
  return getNamespace() === "production";
}

export function isStage(): boolean {
  return getNamespace() === "stage";
}

export function getAPIDomain(): string {
  const { zoneName } = getCdkConfiguration();
  if (isStage()) {
    return `api.stage.${zoneName}`;
  }

  if (isProduction()) {
    return `api.${zoneName}`;
  }

  return `api-${getNamespace()}.${zoneName}`;
}

export function getFeedbackDomain(): string {
  const { zoneName } = getCdkConfiguration();
  if (isStage()) {
    return `feedback.stage.${zoneName}`;
  }

  if (isProduction()) {
    return `feedback.${zoneName}`;
  }

  return `feedback-${getNamespace()}.${zoneName}`;
}