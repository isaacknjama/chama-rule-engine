import { Rule, RuleEngine, Schedule } from './rule';

/**
 * Implementation of the Rule Engine
 */
export class DefaultRuleEngine implements RuleEngine {
    private rules: Map<string, Rule> = new Map();
    private scheduledTaskIds: Map<string, NodeJS.Timeout> = new Map();
    private isRunning: boolean = false;

    constructor() {}

    addRule(rule: Rule): void {
        this.rules.set(rule.id, rule);
        if (this.isRunning && rule.isActive && rule.schedule) {
            this.scheduleRule(rule);
        }
    }

    removeRule(ruleId: string): boolean {
        // Cancel any scheduled tasks first
        this.cancelScheduledTask(ruleId);
        return this.rules.delete(ruleId);
    }

    enableRule(ruleId: string): boolean {
        const rule = this.rules.get(ruleId);
        if (!rule) return false;

        rule.isActive = true;
        rule.updatedAt = new Date();
        
        // If already running and has a schedule, schedule it
        if (this.isRunning && rule.schedule) {
            this.scheduleRule(rule);
        }
        
        return true;
    }

    disableRule(ruleId: string): boolean {
        const rule = this.rules.get(ruleId);
        if (!rule) return false;

        rule.isActive = false;
        rule.updatedAt = new Date();
        
        // Cancel any scheduled tasks
        this.cancelScheduledTask(ruleId);
        
        return true;
    }

    async executeRule(ruleId: string): Promise<void> {
        const rule = this.rules.get(ruleId);
        if (!rule || !rule.isActive) return;

        try {
            const shouldExecute = await rule.condition.evaluate();
            if (shouldExecute) {
                await rule.action.execute();
                rule.lastExecuted = new Date();
            }
        } catch (error) {
            console.error(`Error executing rule ${rule.name} (${rule.id}):`, error);
        }
    }

    startScheduledRules(): void {
        if (this.isRunning) return;

        this.isRunning = true;
        
        // Start all active rules with schedules
        for (const rule of this.rules.values()) {
            if (rule.isActive && rule.schedule) {
                this.scheduleRule(rule);
            }
        }
    }

    stopScheduledRules(): void {
        this.isRunning = false;
        
        // Cancel all scheduled tasks
        for (const taskId of this.scheduledTaskIds.values()) {
            clearInterval(taskId);
        }
        
        this.scheduledTaskIds.clear();
    }

    private scheduleRule(rule: Rule): void {
        if (!rule.schedule) return;
        
        // Cancel any existing scheduled task first
        this.cancelScheduledTask(rule.id);
        
        // Schedule the new task
        const taskId = setInterval(
            async () => {
                await this.executeRule(rule.id);
            },
            rule.schedule.interval
        );
        
        this.scheduledTaskIds.set(rule.id, taskId);
    }

    private cancelScheduledTask(ruleId: string): void {
        const taskId = this.scheduledTaskIds.get(ruleId);
        if (taskId) {
            clearInterval(taskId);
            this.scheduledTaskIds.delete(ruleId);
        }
    }
}