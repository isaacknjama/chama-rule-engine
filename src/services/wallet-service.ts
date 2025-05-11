import { v4 as uuidv4 } from 'uuid';
import { Wallet, OwnerType, Transaction, TransactionType, TransactionStatus } from '../wallet/wallet';
import { WalletService } from '../rule-engine/actions';
import { WalletModel } from '../models/wallet.model';

/**
 * MongoDB implementation of WalletService
 */
export class MongoWalletService implements WalletService {
  
  constructor() {}

  /**
   * Get wallet by ID
   */
  async getWalletById(walletId: string): Promise<Wallet | null> {
    try {
      const walletDoc = await WalletModel.findOne({ id: walletId }).exec();
      
      if (!walletDoc) return null;
      
      return {
        id: walletDoc.id,
        balance: walletDoc.balance,
        currency: walletDoc.currency,
        ownerId: walletDoc.ownerId,
        ownerType: walletDoc.ownerType as OwnerType,
        transactions: walletDoc.transactions || [],
        createdAt: walletDoc.createdAt,
        updatedAt: walletDoc.updatedAt
      };
    } catch (error) {
      console.error('Error getting wallet by ID:', error);
      return null;
    }
  }

  /**
   * Create a new wallet
   */
  async createWallet(
    ownerId: string,
    ownerType: OwnerType,
    currency: string = 'KES'
  ): Promise<Wallet> {
    try {
      const id = uuidv4();
      const now = new Date();
      
      const walletDoc = new WalletModel({
        id,
        balance: 0,
        currency,
        ownerId,
        ownerType,
        transactions: [],
        createdAt: now,
        updatedAt: now
      });

      await walletDoc.save();
      
      return {
        id: walletDoc.id,
        balance: walletDoc.balance,
        currency: walletDoc.currency,
        ownerId: walletDoc.ownerId,
        ownerType: walletDoc.ownerType as OwnerType,
        transactions: walletDoc.transactions || [],
        createdAt: walletDoc.createdAt,
        updatedAt: walletDoc.updatedAt
      };
    } catch (error) {
      console.error('Error creating wallet:', error);
      throw error;
    }
  }

  /**
   * Update wallet balance
   */
  async updateBalance(walletId: string, amount: number): Promise<Wallet | null> {
    try {
      const wallet = await WalletModel.findOne({ id: walletId }).exec();
      if (!wallet) return null;

      // Update balance
      wallet.balance += amount;
      wallet.updatedAt = new Date();

      // Create transaction record
      const transaction: Transaction = {
        id: uuidv4(),
        amount,
        type: amount >= 0 ? TransactionType.DEPOSIT : TransactionType.WITHDRAWAL,
        timestamp: new Date(),
        status: TransactionStatus.COMPLETED,
        description: `Balance ${amount >= 0 ? 'increased' : 'decreased'} by ${Math.abs(amount)}`
      };

      wallet.transactions = wallet.transactions || [];
      wallet.transactions.push(transaction);

      await wallet.save();
      
      return {
        id: wallet.id,
        balance: wallet.balance,
        currency: wallet.currency,
        ownerId: wallet.ownerId,
        ownerType: wallet.ownerType as OwnerType,
        transactions: wallet.transactions,
        createdAt: wallet.createdAt,
        updatedAt: wallet.updatedAt
      };
    } catch (error) {
      console.error('Error updating wallet balance:', error);
      return null;
    }
  }

  /**
   * Get all wallets
   */
  async getAllWallets(): Promise<Wallet[]> {
    try {
      const walletDocs = await WalletModel.find().exec();
      
      return walletDocs.map(doc => ({
        id: doc.id,
        balance: doc.balance,
        currency: doc.currency,
        ownerId: doc.ownerId,
        ownerType: doc.ownerType as OwnerType,
        transactions: doc.transactions || [],
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
      }));
    } catch (error) {
      console.error('Error getting all wallets:', error);
      return [];
    }
  }

  /**
   * Seed a wallet for testing
   */
  async seedWallet(wallet: Wallet): Promise<void> {
    try {
      // Check if wallet already exists
      const existing = await WalletModel.findOne({ id: wallet.id }).exec();
      if (existing) {
        // Update existing wallet
        existing.balance = wallet.balance;
        existing.transactions = wallet.transactions || [];
        existing.updatedAt = new Date();
        await existing.save();
      } else {
        // Create new wallet
        const walletDoc = new WalletModel({
          id: wallet.id,
          balance: wallet.balance,
          currency: wallet.currency,
          ownerId: wallet.ownerId,
          ownerType: wallet.ownerType,
          transactions: wallet.transactions || [],
          createdAt: wallet.createdAt || new Date(),
          updatedAt: wallet.updatedAt || new Date()
        });
        await walletDoc.save();
      }
    } catch (error) {
      console.error('Error seeding wallet:', error);
    }
  }
}
