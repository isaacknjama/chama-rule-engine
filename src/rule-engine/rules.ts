import { v4 as uuidv4 } from 'uuid';
import { Rule, Schedule } from './rule';
import { Condition, AlwaysTrueCondition } from './conditions';
import { Action, NotifyWalletBalanceAction, WalletService, ChamaService, NotificationService } from './actions';

/**
 * Factory to create an hourly wallet balance notification rule
 */
export function createHourlyWalletBalanceRule(
    walletId: string,
    walletService: WalletService,
    chamaService: ChamaService,
    notificationService: NotificationService,
    name: string = 'Hourly Wallet Balance Notification',
    description: string = 'Notifies all chama members of the wallet balance every hour',
    isActive: boolean = true
): Rule {
    // Create the condition (always true for scheduled rules)
    const condition: Condition = new AlwaysTrueCondition();

    // Create the action
    const action: Action = new NotifyWalletBalanceAction(
        walletId,
        walletService,
        chamaService,
        notificationService
    );

    // Create the schedule (hourly)
    const schedule: Schedule = {
        interval: 60 * 60 * 1000, // 1 hour in milliseconds
    };

    // Create and return the rule
    return {
        id: uuidv4(),
        name,
        description,
        condition,
        action,
        isActive,
        schedule,
        createdAt: new Date(),
        updatedAt: new Date()
    };
}