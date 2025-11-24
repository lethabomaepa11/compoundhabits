export const classifyActivity = async (text: string) => {
    const model = 'llama-3.1-8b-instant';
    const instruct = `Classify the user input into one category. Examples:
                    - "I want to start jogging daily": new habit
                    - "I want to meditate every morning": new habit
                    - "Create a fitness routine with workouts and tracking": new system
                    - "Track my spending habits": new system
                    - "Log today's 5km run in my exercise habit": activity
                    - "I drank water 3 times today": activity

                    Input: ${text}
                    Output: Only the category (habit / system / activity).`
    
}