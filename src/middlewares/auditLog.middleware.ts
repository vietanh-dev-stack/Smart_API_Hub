import { Request, Response, NextFunction } from "express";
import { db } from "../db/knex";

// mở rộng Request có user từ JWT
export interface AuthRequest extends Request {
  user?: { id: number; role: string };
}

export function auditLog(action: "CREATE" | "UPDATE" | "DELETE") {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // Hook vào res.send/res.json để log sau khi response thành công
    const oldSend = res.send.bind(res);

    res.send = function (body?: any) {
      try {
        // Lấy id của record vừa thao tác
        let recordId: number | null = null;

        // Lấy id từ response body hoặc req.params
        if (action === "CREATE" && body) {
          const parsed = typeof body === "string" ? JSON.parse(body) : body;
          recordId = parsed?.id ?? null;
        } else if ((action === "UPDATE" || action === "DELETE") && req.params.id) {
          const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
          recordId = idParam ? parseInt(idParam, 10) : null;
        }

        // Chỉ log khi có recordId và user
        if (recordId && req.user) {
          db("audit_logs")
            .insert({
              user_id: req.user.id,
              action,
              resource_name: req.params.resource ?? "unknown",
              record_id: recordId,
              timestamp: new Date(),
            })
            .catch((err) => console.error("Audit Log error:", err));
        }
      } catch (err) {
        console.error("Audit Log parse error:", err);
      }

      return oldSend(body); // gọi send gốc
    };

    next();
  };
}