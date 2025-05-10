import express, { Express, Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';

// Import wallet and chama models
import { Wallet, OwnerType } from './wallet';
import { Chama, Member, MemberRole } from './chama';

// Import services
import { InMemoryWalletService, InMemoryChamaService } from './services';

// Import rule engine
import { 
    DefaultRuleEngine, 
    ConsoleNotificationService, 
    createHourlyWalletBalanceRule 
} from './rule-engine';

// Create express app
const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize services
const walletService = new InMemoryWalletService();
const chamaService = new InMemoryChamaService();
const notificationService = new ConsoleNotificationService();
const ruleEngine = new DefaultRuleEngine();

// Create some test data for demonstration
async function seedTestData() {
    // Create a test member
    const admin: Member = {
        id: uuidv4(),
        name: 'John Doe',
        phone: '+254712345678',
        role: MemberRole.ADMIN,
        joinedAt: new Date(),
        verified: true
    };

    const member1: Member = {
        id: uuidv4(),
        name: 'Jane Smith',
        phone: '+254723456789',
        role: MemberRole.MEMBER,
        joinedAt: new Date(),
        verified: true
    };

    const member2: Member = {
        id: uuidv4(),
        name: 'Bob Johnson',
        npub: 'npub1abc123...',
        role: MemberRole.MEMBER,
        joinedAt: new Date(),
        verified: true
    };

    // Create a test wallet
    const wallet = await walletService.createWallet(
        'chama1', 
        OwnerType.CHAMA, 
        'KES'
    );

    // Add some funds to the wallet
    await walletService.updateBalance(wallet.id, 150000);

    // Create a test chama
    const chama: Chama = {
        id: 'chama1',
        name: 'Test Chama',
        members: [admin, member1, member2],
        walletId: wallet.id,
        description: 'A test chama for demonstration',
        createdAt: new Date(),
        updatedAt: new Date()
    };

    chamaService.seedChama(chama);

    // Create and register a rule that notifies members about the wallet balance every hour
    const walletBalanceRule = createHourlyWalletBalanceRule(
        wallet.id,
        walletService,
        chamaService,
        notificationService,
        'Hourly Wallet Balance Notification',
        'Notifies all chama members of the wallet balance every hour',
        true
    );

    // For demonstration purposes, we'll use a short interval (10 seconds)
    walletBalanceRule.schedule = { interval: 72 * 100 * 100 }; 

    ruleEngine.addRule(walletBalanceRule);
    console.log(`Created rule: ${walletBalanceRule.name} (${walletBalanceRule.id})`);
}

// Routes
app.get('/', (req: Request, res: Response) => {
    res.send(`Welcome to Chama Rule Engine!`);
});

// Get all rules
app.get('/api/rules', (req: Request, res: Response) => {
    res.json({ message: 'Rule engine running!' });
});

// Manual trigger endpoint for demonstration
app.post('/api/trigger-notification', (req: Request, res: Response) => {
    // In a real app, you would get these values from the request
    const walletId = req.body.walletId || 'unknown';
    
    // Use a cleaner approach with Promise handling
    walletService.getWalletById(walletId)
        .then(wallet => {
            if (!wallet) {
                res.status(404).json({ message: 'Wallet not found' });
                // Return a rejected promise to skip the next then
                return Promise.reject(new Error('Wallet not found'));
            }
            
            // Return the promise chain
            return chamaService.getChamaMembersByWalletId(walletId)
                .then(members => {
                    if (members.length === 0) {
                        res.status(404).json({ message: 'Members not found' });
                        // Return a rejected promise to skip the next then
                        return Promise.reject(new Error('Members not found'));
                    }
                    
                    // Send the notification
                    const message = `Your chama wallet balance is ${wallet.balance} ${wallet.currency}. Updated at ${new Date().toLocaleString()}`;
                    return notificationService.sendBulkNotifications(members, message);
                })
                .then(() => {
                    res.json({ message: 'Notification sent successfully!' });
                });
        })
        .catch(error => {
            // Only log actual errors (not our controlled flow rejections)
            if (error.message !== 'Wallet not found' && error.message !== 'Members not found') {
                console.error('Error triggering notification:', error);
                if (!res.headersSent) {
                    res.status(500).json({ message: 'Error triggering notification' });
                }
            }
        });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}`);
    
    // Seed test data
    seedTestData()
        .then(() => {
            // Start the rule engine
            ruleEngine.startScheduledRules();
            console.log('Rule engine started!');
        })
        .catch(error => {
            console.error('Error seeding test data:', error);
        });
});