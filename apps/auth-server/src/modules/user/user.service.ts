import { Injectable, NotFoundException } from '@nestjs/common';
import { SafeUser } from '@packages/interface';
import { MongoService } from '@packages/database';
import { UpdateRoleDto } from '@modules/user/dto/index.js';
import { NOT_FOUND_USER_ERROR } from '@constants/index.js';

interface RoleServiceInterface {
  // 역할 변경
  updateUserRole(
    userId: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<SafeUser>;
}

@Injectable()
export class UserService implements RoleServiceInterface {
  constructor(private readonly mongoService: MongoService) {}

  public async updateUserRole(
    userId: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<SafeUser> {
    const user = await this.mongoService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(NOT_FOUND_USER_ERROR);
    }

    const updatedUser = await this.mongoService.user.update({
      where: { id: userId },
      data: { role: updateRoleDto.role },
    });

    const { password, ...result } = updatedUser;
    return result;
  }
}
