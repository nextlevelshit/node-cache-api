/**
 * Constants for the application configuration.
 */
export const port: string | undefined = process.env.PORT;
export const isOverridingEnabled: boolean = process.env.ALLOW_OVERRIDE === "true";
