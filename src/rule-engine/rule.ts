/**
 * Rule engine interfaces and types
 */

/**
 * Condition defines when a rule should trigger
 */
export interface Condition {
  evaluate(): Promise<boolean> | boolean;
}

/**
 * Action defines what happens when a rule triggers
 */
export interface Action {
  execute(): Promise<void> | void;
}

/**
 * Rule combines a condition and an action
 */
export interface Rule {
  id: string;
  name: string;
  description?: string;
  condition: Condition;
  action: Action;
  createdAt: Date;
  isActive: boolean;
  updatedAt: Date;
  schedule?: Schedule; // For scheduled rules
  lastExecuted?: Date;
}

/**
 * Schedule for recurring rules
 */
export interface Schedule {
  interval: number; // in milliseconds
  startTime?: Date;
  endTime?: Date;
}

/**
 * RuleEngine manages rules and their execution
 */
export interface RuleEngine {
  addRule(rule: Rule): void;
  removeRule(ruleId: string): boolean;
  enableRule(ruleId: string): boolean;
  disableRule(ruleId: string): boolean;
  executeRule(ruleId: string): Promise<void>;
  startScheduledRules(): void;
  stopScheduledRules(): void;
}
