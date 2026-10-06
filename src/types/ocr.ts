export type BoundingBox = {
  /** Normalized 0..1, origin top-left. */
  x: number;
  y: number;
  width: number;
  height: number;
};

export type OCRBlock = {
  text: string;
  confidence?: number;
  boundingBox: BoundingBox;
};

export type OCRDocument = {
  imageUri: string;
  blocks: OCRBlock[];
  /** Full recognized text in engine reading order. */
  text: string;
  engine: 'ios-vision' | 'android-mlkit';
  durationMs: number;
};

export interface OCRProvider {
  recognize(imageUri: string): Promise<OCRDocument>;
}
