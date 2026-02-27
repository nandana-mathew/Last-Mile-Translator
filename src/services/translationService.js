import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

export class TranslationService {
  constructor(region, modelId = 'anthropic.claude-v2', maxTokens = 1000) {
    this.bedrockClient = new BedrockRuntimeClient({ region });
    this.modelId = modelId;
    this.maxTokens = maxTokens;
  }

  async generatePlainLanguageSummary(text, entities) {
    const prompt = this.buildSummaryPrompt(text, entities);
    
    try {
      const summary = await this.invokeBedrock(prompt);
      return {
        brief: this.extractBrief(summary),
        detailed: this.extractDetailed(summary),
        actions: this.extractActions(summary),
        comprehensive: summary
      };
    } catch (error) {
      console.error('Summary generation failed:', error);
      throw new Error(`Failed to generate summary: ${error.message}`);
    }
  }

  buildSummaryPrompt(text, entities) {
    return `You are a government document translator. Convert this complex government document into plain language that an 8th grader can understand.

Document Text:
${text.substring(0, 3000)}

Key Entities:
- Dates: ${entities.dates?.map(d => d.text).join(', ') || 'None'}
- Organizations: ${entities.organizations?.map(o => o.text).join(', ') || 'None'}
- Locations: ${entities.locations?.map(l => l.text).join(', ') || 'None'}

Provide:
1. A 1-2 sentence brief summary
2. A detailed 2-3 paragraph explanation
3. Key action items if any

Format your response as JSON:
{
  "brief": "brief summary here",
  "detailed": "detailed explanation here",
  "actions": ["action 1", "action 2"]
}`;
  }

  async invokeBedrock(prompt) {
    const payload = {
      prompt: `\n\nHuman: ${prompt}\n\nAssistant:`,
      max_tokens_to_sample: this.maxTokens,
      temperature: 0.5,
      top_p: 0.9
    };

    const command = new InvokeModelCommand({
      modelId: this.modelId,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(payload)
    });

    const response = await this.bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    if (!responseBody.completion) {
      throw new Error('Invalid Bedrock response');
    }
    
    return responseBody.completion;
  }

  extractBrief(summary) {
    try {
      const json = JSON.parse(summary);
      return json.brief;
    } catch {
      const briefMatch = summary.match(/BRIEF:\s*(.+?)(?=DETAILED:|$)/s);
      return briefMatch ? briefMatch[1].trim() : summary.substring(0, 200);
    }
  }

  extractDetailed(summary) {
    try {
      const json = JSON.parse(summary);
      return json.detailed;
    } catch {
      const detailedMatch = summary.match(/DETAILED:\s*(.+?)(?=ACTIONS:|$)/s);
      return detailedMatch ? detailedMatch[1].trim() : summary.substring(0, 500);
    }
  }

  extractActions(summary) {
    try {
      const json = JSON.parse(summary);
      return json.actions || [];
    } catch {
      const actionsMatch = summary.match(/ACTIONS:\s*(.+?)$/s);
      if (actionsMatch) {
        return actionsMatch[1].split('\n').filter(line => line.trim());
      }
      return [];
    }
  }
}
