import { Condition as RuleCondition } from './rule';

/**
 * Re-export the Condition interface
 */
export type Condition = RuleCondition;

/**
 * AlwaysTrue condition - always evaluates to true
 * Useful for scheduled rules that should always run
 */
export class AlwaysTrueCondition implements Condition {
  evaluate(): boolean {
    return true;
  }
}

/**
 * TimeBasedCondition - evaluates to true if the current time
 * matches the specified criteria
 */
export class TimeBasedCondition implements Condition {
  private readonly dayOfWeek?: number; // 0-6, 0 = Sunday
  private readonly hourOfDay?: number; // 0-23
  private readonly minuteOfHour?: number; // 0-59

  constructor({
    dayOfWeek,
    hourOfDay,
    minuteOfHour,
  }: {
    dayOfWeek?: number;
    hourOfDay?: number;
    minuteOfHour?: number;
  }) {
    this.dayOfWeek = dayOfWeek;
    this.hourOfDay = hourOfDay;
    this.minuteOfHour = minuteOfHour;
  }

  evaluate(): boolean {
    const now = new Date();
    const currentDayOfWeek = now.getDay();
    const currentHourOfDay = now.getHours();
    const currentMinuteOfHour = now.getMinutes();

    // Check if the current time matches all specified criteria
    if (this.dayOfWeek !== undefined && this.dayOfWeek !== currentDayOfWeek) {
      return false;
    }

    if (this.hourOfDay !== undefined && this.hourOfDay !== currentHourOfDay) {
      return false;
    }

    if (
      this.minuteOfHour !== undefined &&
      this.minuteOfHour !== currentMinuteOfHour
    ) {
      return false;
    }

    return true;
  }
}

/**
 * CompositeCondition - combines multiple conditions with AND/OR logic
 */
export class CompositeCondition implements Condition {
  private readonly conditions: Condition[];
  private readonly operator: 'AND' | 'OR';

  constructor(conditions: Condition[], operator: 'AND' | 'OR' = 'AND') {
    this.conditions = conditions;
    this.operator = operator;
  }

  async evaluate(): Promise<boolean> {
    if (this.conditions.length === 0) {
      return true; // Empty conditions evaluate to true
    }

    const results = await Promise.all(
      this.conditions.map((condition) => condition.evaluate())
    );

    if (this.operator === 'AND') {
      return results.every((result) => result === true);
    } else {
      // OR
      return results.some((result) => result === true);
    }
  }
}
