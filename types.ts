import type { ReactNode } from 'react';

export type Page = 'home' | 'chat' | 'calculator' | 'optimize' | 'visualize' | 'report' | 'test-ai';

export interface NavItem {
  id: Page;
  label: string;
  icon: ReactNode;
}

export interface UploadedFile {
  name: string;
  type: string;
  size: number;
  base64: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  attachments?: UploadedFile[];
  timestamp: number;
}

export interface AnalysisParams {
  partType: string;
  materialType: string;
  outerDia: number;
  innerDia: number;
  length: number;
}

export interface VisualData {
  stress: { max: number; location: string };
  deformation: { max: number; location: string };
  utilization: number;
}

export interface AnalysisData {
  params: AnalysisParams;
  visualData: VisualData;
}

export interface CalculationResult {
  id: string;
  title: string;
  inputs: { label: string; value: string | number }[];
  output: { label: string; value: string | number }[];
  description?: string;
  timestamp?: number;
}
