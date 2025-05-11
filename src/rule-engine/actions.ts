import { Action as RuleAction } from './rule';
import { Member } from '../chama/chama';
import { Wallet } from '../wallet/wallet';

/**
 * Re-export the Action interface
 */
export type Action = RuleAction;

/**
 * Interface for a notification service
 */
export interface NotificationService {
  sendNotification(recipient: Member, message: string): Promise<void>;
  sendBulkNotifications(recipients: Member[], message: string): Promise<void>;
}

/**
 * Interface for a wallet service
 */
export interface WalletService {
  getWalletById(walletId: string): Promise<Wallet | null>;
}

/**
 * Interface for a chama service
 */
export interface ChamaService {
  getChamaMembersByWalletId(walletId: string): Promise<Member[]>;
}

/**
 * ConsoleNotificationService - logs notifications to the console
 * This is a simple implementation for development/testing
 */
export class ConsoleNotificationService implements NotificationService {
  async sendNotification(recipient: Member, message: string): Promise<void> {
    console.log(
      `[NOTIFICATION] To: ${recipient.name} (${recipient.phone || recipient.npub || 'no contact'}): ${message}`
    );
  }

  async sendBulkNotifications(
    recipients: Member[],
    message: string
  ): Promise<void> {
    console.log(
      `[BULK NOTIFICATION] Sending to ${recipients.length} members: ${message}`
    );
    for (const recipient of recipients) {
      await this.sendNotification(recipient, message);
    }
  }
}

/**
 * NotifyWalletBalanceAction - notifies all chama members of the wallet balance
 */
export class NotifyWalletBalanceAction implements Action {
  private readonly walletId: string;
  private readonly walletService: WalletService;
  private readonly chamaService: ChamaService;
  private readonly notificationService: NotificationService;

  constructor(
    walletId: string,
    walletService: WalletService,
    chamaService: ChamaService,
    notificationService: NotificationService
  ) {
    this.walletId = walletId;
    this.walletService = walletService;
    this.chamaService = chamaService;
    this.notificationService = notificationService;
  }

  async execute(): Promise<void> {
    try {
      // Get the wallet
      const wallet = await this.walletService.getWalletById(this.walletId);
      if (!wallet) {
        console.error(`Wallet with ID ${this.walletId} not found`);
        return;
      }

      // Get the chama members
      const members = await this.chamaService.getChamaMembersByWalletId(
        this.walletId
      );
      if (members.length === 0) {
        console.error(`No members found for wallet ID ${this.walletId}`);
        return;
      }

      // Format the message
      const message = `Your chama wallet balance is ${wallet.balance} ${wallet.currency}. Updated at ${new Date().toLocaleString()}`;

      // Send notifications
      await this.notificationService.sendBulkNotifications(members, message);
    } catch (error) {
      console.error('Error in NotifyWalletBalanceAction:', error);
    }
  }
}
