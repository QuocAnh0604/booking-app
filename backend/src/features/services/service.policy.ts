// service/policies/service.policy.ts
//
// Ai được làm gì với Service (dịch vụ):
//  - CUSTOMER: chỉ xem service ACTIVE (route dùng @Can.Anyone(), không cần ability ở đây).
//  - STAFF   : quản lý dịch vụ (tạo / sửa / ẩn / kích hoạt lại) và xem cả service INACTIVE.
//  - ADMIN   : toàn quyền, đi qua before().

import { Policy, type PolicyBefore } from '@nestjs/authorization';
import { Role } from 'src/common/enums/role.enum'; // chỉnh lại path theo project
import type { User } from '../users/entities/user.entity';

const isStaff = (user: User | null): boolean => user?.role === Role.STAFF;

@Policy()
export class ServicePolicy implements PolicyBefore<User> {
  // ADMIN đi qua mọi ability bên dưới, kể cả ability thêm sau này
  before(user: User | null) {
    if (user?.role === Role.ADMIN) return true;
  }

  // POST /services
  create(user: User | null) {
    return isStaff(user);
  }

  // PATCH /services/:id  và  PATCH /services/:id/activate
  update(user: User | null) {
    return isStaff(user);
  }

  // DELETE /services/:id (thực chất là chuyển sang INACTIVE)
  remove(user: User | null) {
    return isStaff(user);
  }

  // Dùng trong ServiceService.findAll / findOne để quyết định có hiện service INACTIVE không
  viewInactive(user: User | null) {
    return isStaff(user);
  }
}
