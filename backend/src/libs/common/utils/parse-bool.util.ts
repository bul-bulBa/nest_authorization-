export function parseBoolean(value: string): boolean {
    if(typeof value === 'boolean') return value
    
    if(typeof value === 'string') {
        const lowerValue = value.trim().toLowerCase()
        
        return lowerValue === 'true' ? true : false
    }

    throw new Error(
        `Can't transform value: ${value} to logic value`
    )
}