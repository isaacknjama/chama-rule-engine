import { v4 as uuidv4 } from 'uuid';
import { Chama, Member, MemberRole } from '../chama/chama';
import { ChamaService } from '../rule-engine/actions';
import { ChamaModel } from '../models/chama.model';

/**
 * MongoDB implementation of ChamaService
 */
export class MongoChamaService implements ChamaService {
  
  constructor() {}

  /**
   * Get Chama members by wallet ID
   */
  async getChamaMembersByWalletId(walletId: string): Promise<Member[]> {
    try {
      const chamaDoc = await ChamaModel.findOne({ walletId }).exec();
      return chamaDoc ? chamaDoc.members : [];
    } catch (error) {
      console.error('Error getting chama members by wallet ID:', error);
      return [];
    }
  }

  /**
   * Create a new chama
   */
  async createChama(
    name: string,
    creator: Member,
    walletId: string,
    description?: string
  ): Promise<Chama> {
    try {
      const id = uuidv4();
      const now = new Date();
      
      const chamaDoc = new ChamaModel({
        id,
        name,
        members: [creator],
        walletId,
        description,
        createdAt: now,
        updatedAt: now
      });

      await chamaDoc.save();
      
      return {
        id: chamaDoc.id,
        name: chamaDoc.name,
        members: chamaDoc.members,
        walletId: chamaDoc.walletId,
        description: chamaDoc.description,
        createdAt: chamaDoc.createdAt,
        updatedAt: chamaDoc.updatedAt
      };
    } catch (error) {
      console.error('Error creating chama:', error);
      throw error;
    }
  }

  /**
   * Add a member to a chama
   */
  async addMember(chamaId: string, member: Member): Promise<boolean> {
    try {
      const chama = await ChamaModel.findOne({ id: chamaId }).exec();
      if (!chama) return false;

      chama.members.push(member);
      chama.updatedAt = new Date();

      await chama.save();
      return true;
    } catch (error) {
      console.error('Error adding member to chama:', error);
      return false;
    }
  }

  /**
   * Get chama by ID
   */
  async getChamaById(chamaId: string): Promise<Chama | null> {
    try {
      const chamaDoc = await ChamaModel.findOne({ id: chamaId }).exec();
      
      if (!chamaDoc) return null;
      
      return {
        id: chamaDoc.id,
        name: chamaDoc.name,
        members: chamaDoc.members,
        walletId: chamaDoc.walletId,
        description: chamaDoc.description,
        createdAt: chamaDoc.createdAt,
        updatedAt: chamaDoc.updatedAt
      };
    } catch (error) {
      console.error('Error getting chama by ID:', error);
      return null;
    }
  }

  /**
   * Get all chamas
   */
  async getAllChamas(): Promise<Chama[]> {
    try {
      const chamaDocs = await ChamaModel.find().exec();
      
      return chamaDocs.map(doc => ({
        id: doc.id,
        name: doc.name,
        members: doc.members,
        walletId: doc.walletId,
        description: doc.description,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
      }));
    } catch (error) {
      console.error('Error getting all chamas:', error);
      return [];
    }
  }

  /**
   * Seed a chama for testing
   */
  async seedChama(chama: Chama): Promise<void> {
    try {
      // Check if chama already exists
      const existing = await ChamaModel.findOne({ id: chama.id }).exec();
      if (existing) {
        // Update existing chama
        existing.name = chama.name;
        existing.members = chama.members;
        existing.walletId = chama.walletId;
        existing.description = chama.description;
        existing.updatedAt = new Date();
        await existing.save();
      } else {
        // Create new chama
        const chamaDoc = new ChamaModel({
          id: chama.id,
          name: chama.name,
          members: chama.members,
          walletId: chama.walletId,
          description: chama.description,
          createdAt: chama.createdAt || new Date(),
          updatedAt: chama.updatedAt || new Date()
        });
        await chamaDoc.save();
      }
    } catch (error) {
      console.error('Error seeding chama:', error);
    }
  }
}
