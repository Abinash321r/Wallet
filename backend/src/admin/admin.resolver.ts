import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminUser, PaginatedAdminUsers } from './models/admin-user.model';
import { AdminUsersArgs } from './dto/admin-users.args';
import { WalletType } from '../wallet/models/wallet.model';
import { TransactionType } from '../transaction/models/transaction.model';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';


@Resolver()
@UseGuards(GqlAuthGuard, RolesGuard)
export class AdminResolver {
  constructor(private adminService: AdminService) {}

  
  @Query(() => PaginatedAdminUsers, { description: 'Admin: list users with search, filter, sort, and pagination' })
  @Roles(Role.ADMIN)
  async adminUsers(@Args() args: AdminUsersArgs): Promise<PaginatedAdminUsers> {
    return this.adminService.getUsers(args);
  }

  @Mutation(() => WalletType, { description: 'Admin: freeze a user wallet' })
  @Roles(Role.ADMIN)
  async adminFreezeWallet(@Args('walletId') walletId: string) {
    return this.adminService.freezeWallet(walletId);
  }

  @Mutation(() => WalletType, { description: 'Admin: unfreeze a user wallet' })
  @Roles(Role.ADMIN)
  async adminUnfreezeWallet(@Args('walletId') walletId: string) {
    return this.adminService.unfreezeWallet(walletId);
  }

  
  @Mutation(() => AdminUser, { description: 'Admin: promote a user to admin role' })
  @Roles(Role.ADMIN)
  async adminMakeAdmin(@Args('userId') userId: string) {
    return this.adminService.makeAdmin(userId);
  }

  
  @Mutation(() => Boolean, { description: 'Admin: delete a user and all their data' })
  @Roles(Role.ADMIN)
  async adminDeleteUser(@Args('userId') userId: string): Promise<boolean> {
    return this.adminService.deleteUser(userId);
  }

  @Query(() => [TransactionType], { description: 'Admin: view all transactions' })
  @Roles(Role.ADMIN)
  async adminTransactions() {
    return this.adminService.getAllTransactions();
  }
}
