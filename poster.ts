export type AmountStyle = "solid" | "gold" | "silver";
export type ExportFormat = "jpg" | "png";

export interface TransformConfig {
  x: number;
  y: number;
  scale: number;
}

export interface ImageConfig extends TransformConfig {
  src: string;
  width: number;
  opacity: number;
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
  shadowBlur: number;
  shadowColor: string;
}

export interface BackgroundConfig {
  src: string;
  x: number;
  y: number;
  scale: number;
  brightness: number;
  contrast: number;
  blur: number;
  overlay: number;
}

export interface TextLayerConfig extends TransformConfig {
  text: string;
  fontSize: number;
  fontWeight: number;
  fontFamily: string;
  fill: string;
  stroke: string;
  strokeWidth: number;
  shadowColor: string;
  shadowBlur: number;
}

export interface WithdrawConfig extends TransformConfig {
  title: string;
  orderId: string;
  amount: string;
  amountColor: string;
  amountFontSize: number;
  amountFontWeight: number;
  date: string;
  time: string;
}

export interface SuccessConfig extends TransformConfig {
  title: string;
  amount: string;
  amountColor: string;
  description1: string;
  description2: string;
}

export interface HeadlineConfig {
  line1: TextLayerConfig;
  cuci: TextLayerConfig;
  amount: TextLayerConfig & { style: AmountStyle; decimals: 0 | 1 | 2; value: string };
}

export interface ExportConfig {
  format: ExportFormat;
  quality: number;
}

export interface PosterConfig {
  template: "template-1";
  companyName: string;
  companyLogo: ImageConfig;
  gameLogoLeft: ImageConfig;
  gameLogoRight: ImageConfig;
  person: ImageConfig;
  background: BackgroundConfig;
  masterAmount: string;
  syncAmounts: boolean;
  withdraw: WithdrawConfig;
  success: SuccessConfig;
  headline: HeadlineConfig;
  bankBar: ImageConfig;
  export: ExportConfig;
}

export type ImageKey =
  | "companyLogo"
  | "gameLogoLeft"
  | "gameLogoRight"
  | "person"
  | "background"
  | "bankBar";

export type ElementKey =
  | "companyLogo"
  | "gameLogoLeft"
  | "gameLogoRight"
  | "person"
  | "withdraw"
  | "success"
  | "headlineLine1"
  | "cuci"
  | "headlineAmount"
  | "bankBar";

