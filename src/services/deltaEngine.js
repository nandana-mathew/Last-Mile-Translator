import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

export class DeltaEngine {
  constructor(region, modelId = 'anthropic.claude-v2') {
    this.bedrockClient = new BedrockRuntimeClient({ region });
    this.modelId = modelId;
  }

  async compareDocuments(currentText, previousText) {
    if (!previousText) {
      return {
        hasChanges: false,
        changes: [],
        affected: [],
        summary: 'No previous version available for comparison'
      };
    }

    const prompt = this.buildComparisonPrompt(currentText, previousText);
    
    try {
      const result = await this.invokeBedrock(prompt);
      return this.parseComparisonResult(result);
    } catch (error) {
      console.error('Document comparison failed:', error);
      throw new Error(`Failed to compare documents: ${error.message}`);
    }
  }

  buildComparisonPrompt(currentText, previousText) {
    return `Compare these two government policy documents and provide a structured analysis.

PREVIOUS VERSION:
${previousText.substring(0, 2500)}

CURRENT VERSION:
${currentText.substring(0, 2500)}

Analyze and respond in JSON format:
{
  "changes": ["list of specific changes"],
  "affected": ["list of groups/people affected"],
  "summary": "brief summary of overall impact",
  "severity": "low|medium|high"
}`;
  }

  async invokeBedrock(prompt) {
    const payload = {
      prompt: `\n\nHuman: ${prompt}\n\nAssistant:`,
      max_tokens_to_sample: 1500,
      temperature: 0.3,
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

  parseComparisonResult(result) {
    try {
      const json = JSON.parse(result);
      return {
        hasChanges: true,
        changes: json.changes || [],
        affected: json.affected || [],
        summary: json.summary || '',
        severity: json.severity || 'medium'
      };
    } catch {
      const changes = result.split('\n')
        .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
        .map(line => line.replace(/^[-•]\s*/, '').trim());

      return {
        hasChanges: changes.length > 0,
        changes,
        affected: [],
        summary: result.substring(0, 200),
        severity: 'medium'
      };
    }
  }
}
