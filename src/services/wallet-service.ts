import { v4 as uuidv4 } from 'uuid';
import { Wallet, OwnerType } from '../wallet/wallet';
import { WalletService } from '../rule-engine/actions';

/**
 * In-memory implementation of WalletService
 * In a real app, this would connect to a database
 */
export class InMemoryWalletService implements WalletService {
    private wallets: Map<string, Wallet> = new Map();

    constructor() {}

    async getWalletById(walletId: string): Promise<Wallet | null> {
        return this.wallets.get(walletId) || null;
    }

    // Additional methods for wallet operations
    async createWallet(ownerId: string, ownerType: OwnerType, currency: string = 'KES'): Promise<Wallet> {
        const id = uuidv4();
        const wallet: Wallet = {
            id,
            balance: 0,
            currency,
            ownerId,
            ownerType,
            createdAt: new Date(),
            updatedAt: new Date(),
            transactions: []
        };

        this.wallets.set(id, wallet);
        return wallet;
    }

    async updateBalance(walletId: string, amount: number): Promise<Wallet | null> {
        const wallet = await this.getWalletById(walletId);
        if (!wallet) return null;

        wallet.balance += amount;
        wallet.updatedAt = new Date();
        
        return wallet;
    }

    // For testing purposes
    seedWallet(wallet: Wallet): void {
        this.wallets.set(wallet.id, wallet);
    }
}