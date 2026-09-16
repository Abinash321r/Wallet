import { Test, TestingModule } from '@nestjs/testing';
import { TransferService } from '../src/transfer/transfer.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';




const mockPrisma = {
  transaction: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  wallet: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
  ledgerEntry: {
    createMany: jest.fn(),
  },
  $transaction: jest.fn(),
  $queryRaw: jest.fn(),
};

describe('TransferService', () => {
  let transferService: TransferService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransferService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    transferService = module.get<TransferService>(TransferService);
    jest.clearAllMocks();
  });

  
  it('returns existing transaction without processing again if idempotency key was already used', async () => {
    const savedTx = { id: 'tx-1', amount: 50, status: 'COMPLETED' };
    mockPrisma.transaction.findUnique.mockResolvedValue(savedTx);

    const result = await transferService.transfer('sender-id', {
      receiverMobile: '9876543210',
      amount: 50,
      idempotencyKey: 'already-processed-key',
    });

    expect(result).toEqual(savedTx);           
    expect(mockPrisma.$transaction).not.toHaveBeenCalled(); 
  });

  
  it('throws BadRequestException if sender wallet is frozen', async () => {
    mockPrisma.transaction.findUnique.mockResolvedValue(null);
    mockPrisma.wallet.findUnique.mockResolvedValue({
      id: 'wallet-1',
      balance: 1000,
      isFrozen: true, 
    });

    await expect(
      transferService.transfer('sender-id', {
        receiverMobile: '9876543210',
        amount: 100,
        idempotencyKey: 'unique-key-1',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  
  it('throws BadRequestException when balance is insufficient', async () => {
    mockPrisma.transaction.findUnique.mockResolvedValue(null);
    
    mockPrisma.wallet.findUnique.mockResolvedValue({
      id: 'wallet-1', balance: 10, isFrozen: false,
    });
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'receiver-id',
      wallet: { id: 'wallet-2' },
    });

    
    mockPrisma.$transaction.mockImplementation(async (fn: Function) => {
      return fn({
        ...mockPrisma,
        $queryRaw: jest.fn(),
        wallet: {
          findUnique: jest.fn().mockResolvedValue({ id: 'wallet-1', balance: 10 }),
          update: jest.fn(),
        },
        transaction: { create: jest.fn() },
        ledgerEntry: { createMany: jest.fn() },
      });
    });

    await expect(
      transferService.transfer('sender-id', {
        receiverMobile: '9876543210',
        amount: 500, 
        idempotencyKey: 'unique-key-2',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws NotFoundException when receiver mobile does not exist', async () => {
    mockPrisma.transaction.findUnique.mockResolvedValue(null);
    mockPrisma.wallet.findUnique.mockResolvedValue({
      id: 'wallet-1', balance: 1000, isFrozen: false,
    });
    mockPrisma.user.findUnique.mockResolvedValue(null); 

    await expect(
      transferService.transfer('sender-id', {
        receiverMobile: '0000000000',
        amount: 100,
        idempotencyKey: 'unique-key-3',
      }),
    ).rejects.toThrow(NotFoundException);
  });
});
