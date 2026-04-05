import { Request } from "express";

export interface ResourceParams {
  resource: string;
  id?: string;
}

// dùng generic Request với param tùy chỉnh
export type ResourceRequest<P = ResourceParams> = Request<P>;