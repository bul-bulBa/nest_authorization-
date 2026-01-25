type TimeUnit = 'ms' | 's' | 'm' | 'h' | 'd';

const unitMultipliers: Record<TimeUnit, number> = {
    ms: 1,
    s: 1000,
    m: 1000 * 60,
    h: 1000 * 60 * 60,
    d: 1000 * 60 * 60 * 24,
};

export function toMilliseconds(value: number, unit: TimeUnit): number {
    if (!(unit in unitMultipliers)) {
        throw new Error(`Unsupported time unit: ${unit}`);
    }
    return value * unitMultipliers[unit];
}

export function ms(time: string): number {
    const regex = /^(\d+(?:\.\d+)?)(ms|s|m|h|d)$/i;
    const match = time.trim().match(regex);

    if (!match) {
        throw new Error(`Invalid time format: ${time}`);
    }

    const value = parseFloat(match[1]);
    const unit = match[2].toLowerCase() as TimeUnit;

    return toMilliseconds(value, unit);
}