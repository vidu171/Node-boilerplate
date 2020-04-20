
export {}

// to override request
declare global {
    namespace Express {
        export interface Request {
        }
    }
}
