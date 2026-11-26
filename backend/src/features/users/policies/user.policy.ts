import type { User } from "../entities/user.entity";
import { Policy, PolicyBefore } from "@nestjs/authorization";
import { Role } from "src/common/enums/role.enum";
@Policy()
export class UserPolicy implements PolicyBefore<User> {

  before(user: User | null) {
    if (user?.role === Role.ADMIN) return true;
  }

  create(_user: User | null)     { return false; } // chỉ ADMIN
  list(_user: User | null)       { return false; } // chỉ ADMIN
  remove(_user: User | null)     { return false; } // chỉ ADMIN

  // xem / sửa chính mình
  access(user: User | null, targetId: string) {
    return !!user && user.id === targetId;
  }
}