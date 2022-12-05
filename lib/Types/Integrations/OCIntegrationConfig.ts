/**
 * A base class that all Integration Config classes should extend. Contains environment variables needed for that integration.
 */
export abstract class OCIntegrationConfig {
    public abstract serviceName: string;
}