// src/types/jsonwebtoken.d.ts
declare module 'jsonwebtoken' {
    export interface JwtPayload {
      [key: string]: unknown;
    }
  
    export function sign(
      payload: string | Buffer | object,
      secretOrPrivateKey: string | Buffer,
      options?: SignOptions
    ): string;
  
    export function verify<T extends object = JwtPayload>(
      token: string,
      secretOrPublicKey: string | Buffer,
      options?: VerifyOptions
    ): T;
  
    export interface SignOptions {
      algorithm?: string;
      expiresIn?: string | number;
      notBefore?: string | number;
      audience?: string | string[];
      issuer?: string;
      jwtid?: string;
      subject?: string;
      noTimestamp?: boolean;
      header?: object;
      keyid?: string;
      [key: string]: unknown;
    }
  
    export interface VerifyOptions {
      algorithms?: string[];
      audience?: string | RegExp | Array<string | RegExp>;
      clockTimestamp?: number;
      clockTolerance?: number;
      complete?: boolean;
      issuer?: string | string[];
      ignoreExpiration?: boolean;
      ignoreNotBefore?: boolean;
      jwtid?: string;
      subject?: string;
      maxAge?: string | number;
      [key: string]: unknown;
    }
  }