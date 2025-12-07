// Placeholder for a future vision model integration.

export class VisionService {
  async analyzeFrame(imageBase64: string) {
    // In a real implementation, this would call a vision model.
    return {
      textBlocks: ['detected text placeholder'],
      objects: [{ label: 'person', confidence: 0.98 }],
      rawInput: imageBase64 ? '[base64-image]' : 'missing',
    };
  }
}
