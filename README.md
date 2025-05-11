# Chama Rule Engine

A flexible rule engine for a chama (investment group) management system that can notify members of wallet balance on a scheduled basis.

## Overview

The Chama Rule Engine is designed to help Chama groups (community-based savings and investment groups) manage their operations through configurable business rules. The engine allows chamas to define and enforce various operational rules such as:

- Automated hourly balance announcements
- Withdrawal restrictions based on time periods
- Deposit/withdrawal enforcement according to chama policies
- Membership eligibility rules

In its simplest form, the engine fires actions when specific conditions are met - for example, sending a notification with the wallet balance every hour.

## Features

- Flexible rule engine that can be configured with different business rules
- MongoDB integration for persistent storage
- Express.js API for interacting with the engine
- Notification system for alerts to chama members
- Hourly wallet balance notification rule implementation
- Extensible architecture for adding new rules, conditions, and actions

## Prerequisites

- Node.js (v18 or later)
- MongoDB (local installation or MongoDB Atlas)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/isaacknjama/chama-rule-engine.git
   cd chama-rule-engine
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the project root (or update the existing one)
   - Set the following variables:
     ```
     PORT=3000
     NODE_ENV=development
     MONGODB_URI=mongodb://localhost:27017/chama-rule-engine
     HOURLY_RULE_INTERVAL=3600000
     ```

## Running the Application

### Development Mode

```
npm run dev
```

This starts the application with nodemon for automatic reloading during development.

### Production Mode

```
npm run build
npm start
```

## Core Components

### 1. Chama
Represents an investment group with members and the rules that govern it:
- Tracks members and their information
- Associates with a wallet for financial operations
- Contains the business rules specific to the chama

### 2. Wallet
The financial component of a chama:
- Tracks balance and transaction history
- Provides methods for deposits and withdrawals
- Interfaces with the rule engine for rule-based constraints

### 3. Rule Engine
The central mechanism for defining and enforcing rules:
- **Conditions**: Logic that determines when a rule should trigger (e.g., time-based, balance-based)
- **Actions**: Operations performed when conditions are met (e.g., sending notifications)
- **Rules**: Combinations of conditions and actions with scheduling information

## MongoDB Models

- **Chama**: Stores investment group information and members
- **Wallet**: Stores financial data and transactions
- **Rule**: Stores rule configurations

## API Endpoints

- `GET /`: Welcome message
- `GET /api/rules`: Check if the rule engine is running
- `POST /api/trigger-notification`: Manually trigger a wallet balance notification

## Extending the Rule Engine

You can create new rules by:

1. Defining a condition by implementing the `Condition` interface
2. Defining an action by implementing the `Action` interface
3. Creating a rule that combines the condition and action
4. Registering the rule with the rule engine

Example:

```typescript
// Create a new rule
const myRule = {
  id: uuidv4(),
  name: 'My Custom Rule',
  description: 'A custom rule for my chama',
  condition: new MyCustomCondition(),
  action: new MyCustomAction(),
  isActive: true,
  schedule: { interval: 24 * 60 * 60 * 1000 }, // Daily
  createdAt: new Date(),
  updatedAt: new Date()
};

// Add the rule to the engine
ruleEngine.addRule(myRule);
```

## Rule Examples

### Time-Based Withdrawal Restriction
```typescript
// Prevents withdrawals until a specific date
const timeBasedWithdrawalCondition = new TimeBasedCondition({
  restrictUntil: new Date('2023-12-31')
});
const preventWithdrawalAction = new PreventWithdrawalAction();
```

### Minimum Balance Notification
```typescript
// Notifies members when balance falls below threshold
const minimumBalanceCondition = new BalanceCondition({
  minimumAmount: 10000,
  comparison: 'lessThan'
});
const notifyMembersAction = new NotifyAction({
  message: 'Warning: Chama balance is below minimum threshold!'
});
```

## License

MIT