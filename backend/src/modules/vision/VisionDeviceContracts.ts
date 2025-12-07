export interface VisionFrame {
  deviceId: string;
  base64: string;
  capturedAt: number;
}

export interface VisionObject {
  label: string;
  confidence: number;
}

export interface VisionTextBlock {
  text: string;
  position?: string;
}
