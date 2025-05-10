interface Wallet {
    id: string;
    balance: number;
    currency: string;
    ownerId: string;
    ownerType: OwnerType;
    createdAt: Date;
    updatedAt: Date;
    transactions?: Transaction[];
}

enum OwnerType {
    CHAMA = 'CHAMA',
    MEMBER = 'MEMBER'
}

interface Transaction {
    id: string;
    amount: number;
    type: TransactionType;
    timestamp: Date;
    description?: string;
    status: TransactionStatus;
}

enum TransactionType {
    DEPOSIT = 'DEPOSIT',
    WITHDRAWAL = 'WITHDRAWAL',
    TRANSFER = 'TRANSFER'
}

enum TransactionStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
}

export { Wallet, OwnerType, Transaction, TransactionType, TransactionStatus };