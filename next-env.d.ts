/// <reference types="next" />
/// <reference types="next/types/global" />
/// <reference types="next/image-types/global" />

declare global {
    namespace NodeJS {
        interface Global {
            prisma: any;
        }
    }
}

export { }

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.
