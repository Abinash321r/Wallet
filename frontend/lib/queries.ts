import { gql } from 'graphql-request';



export const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      mobile
      role
    }
  }
`;

export const MY_WALLET_QUERY = gql`
  query MyWallet {
    myWallet {
      id
      balance
      isFrozen
      createdAt
    }
  }
`;



export const MY_TRANSACTIONS_QUERY = gql`
  query MyTransactions($cursor: String, $limit: Int, $dateFilter: String) {
    myTransactions(cursor: $cursor, limit: $limit, dateFilter: $dateFilter) {
      transactions {
        id
        amount
        currency
        status
        senderWalletId
        receiverWalletId
        createdAt
      }
      nextCursor
      hasMore
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      id
      name
      mobile
      role
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input)
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

export const TRANSFER_MUTATION = gql`
  mutation Transfer($input: TransferInput!) {
    transfer(input: $input) {
      id
      amount
      status
      createdAt
    }
  }
`;

export const DEPOSIT_MUTATION = gql`
  mutation Deposit($amount: Float!) {
    deposit(amount: $amount) {
      id
      balance
      isFrozen
    }
  }
`;





export const ADMIN_USERS_QUERY = gql`
  query AdminUsers(
    $page: Int
    $limit: Int
    $search: String
    $roleFilter: String
    $sortBy: String
    $sortOrder: String
  ) {
    adminUsers(
      page: $page
      limit: $limit
      search: $search
      roleFilter: $roleFilter
      sortBy: $sortBy
      sortOrder: $sortOrder
    ) {
      users {
        id
        name
        mobile
        role
        createdAt
        wallet {
          id
          balance
          isFrozen
        }
      }
      total
      page
      totalPages
    }
  }
`;

export const ADMIN_FREEZE_WALLET = gql`
  mutation AdminFreezeWallet($walletId: String!) {
    adminFreezeWallet(walletId: $walletId) {
      id
      isFrozen
    }
  }
`;

export const ADMIN_UNFREEZE_WALLET = gql`
  mutation AdminUnfreezeWallet($walletId: String!) {
    adminUnfreezeWallet(walletId: $walletId) {
      id
      isFrozen
    }
  }
`;

export const ADMIN_MAKE_ADMIN = gql`
  mutation AdminMakeAdmin($userId: String!) {
    adminMakeAdmin(userId: $userId) {
      id
      role
    }
  }
`;

export const ADMIN_DELETE_USER = gql`
  mutation AdminDeleteUser($userId: String!) {
    adminDeleteUser(userId: $userId)
  }
`;
