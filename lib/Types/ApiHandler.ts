export type ApiHandler = (req: any, res: any, next?: any) => unknown | Promise<unknown>; 

// Note that the return type "unknown" is still backwards compatible with the older "void".