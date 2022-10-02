/**
 * Use this function to create a greeting string with the given name
 * @param name The name to greet
 */
export const makeHello = (name?: string): string => `Hello ${name || 'world'}`;
