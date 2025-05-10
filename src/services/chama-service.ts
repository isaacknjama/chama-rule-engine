import { v4 as uuidv4 } from 'uuid';
import { Chama, Member, MemberRole } from '../chama/chama';
import { ChamaService } from '../rule-engine/actions';

/**
 * In-memory implementation of ChamaService
 * In a real app, this would connect to a database
 */
export class InMemoryChamaService implements ChamaService {
    private chamas: Map<string, Chama> = new Map();

    constructor() {}

    async getChamaMembersByWalletId(walletId: string): Promise<Member[]> {
        // Find chama with the given wallet ID
        const chama = Array.from(this.chamas.values()).find(c => c.walletId === walletId);
        if (!chama) return [];
        
        return chama.members;
    }

    // Additional methods for chama operations
    async createChama(name: string, creator: Member, walletId: string, description?: string): Promise<Chama> {
        const id = uuidv4();
        const chama: Chama = {
            id,
            name,
            members: [creator],
            walletId,
            createdAt: new Date(),
            updatedAt: new Date(),
            description
        };

        this.chamas.set(id, chama);
        return chama;
    }

    async addMember(chamaId: string, member: Member): Promise<boolean> {
        const chama = this.chamas.get(chamaId);
        if (!chama) return false;

        chama.members.push(member);
        chama.updatedAt = new Date();
        
        return true;
    }

    // For testing purposes
    seedChama(chama: Chama): void {
        this.chamas.set(chama.id, chama);
    }
}