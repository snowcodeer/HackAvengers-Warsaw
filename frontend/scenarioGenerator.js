
/**
 * Generates a dynamic scenario based on user input using Anthropic Claude.
 * @param {string} userPrompt - The user's description of the scenario (e.g., "Buying a train ticket in Tokyo").
 * @param {string} language - The target language (e.g., "japanese").
 * @returns {Promise<Object>} - The generated scenario data.
 */
export async function generateDynamicScenario(userPrompt, language) {
    try {
        const response = await fetch('http://localhost:8000/api/scenario/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: userPrompt,
                language: language
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Generation failed: ${errorData.detail || response.statusText}`);
        }

        const scenarioData = await response.json();
        return scenarioData;

    } catch (error) {
        console.error("Scenario generation failed:", error);
        throw error;
    }
}
