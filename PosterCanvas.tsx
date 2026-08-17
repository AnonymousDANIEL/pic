"use client";

import Konva from "konva";
import {
  Circle,
  Ellipse,
  Group,
  Image as KonvaImage,
  Layer,
  Line,
  Rect,
  Stage,
  Text,
  Transformer,
} from "react-konva";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { formatHeadlineAmount, formatSuccessAmount, formatWithdrawAmount } from "@/lib/amount";
import type { ElementKey, ImageConfig, PosterConfig, TransformConfig } from "@/types/poster";

export const POSTER_SIZE = 1254;

export interface PosterCanvasHandle {
  exportImage: (format: "jpg" | "png", quality: number) => string;
}

interface PosterCanvasProps {
  config: PosterConfig;
  selected: ElementKey | null;
  onSelect: (key: ElementKey | null) => void;
  onTransform: (key: ElementKey, transform: TransformConfig) => void;
}

function useCanvasImage(src: string) {
  const [loaded, setLoaded] = useState<{ src: string; image: HTMLImageElement | null }>({ src: "", image: null });
  useEffect(() => {
    if (!src) return;
    let active = true;
    const next = new window.Image();
    next.decoding = "async";
    next.onload = () => active && setLoaded({ src, image: next });
    next.onerror = () => active && setLoaded({ src, image: null });
    next.src = src;
    return () => {
      active = false;
    };
  }, [src]);
  return loaded.src === src ? loaded.image : null;
}

function selectProps(key: ElementKey, onSelect: (key: ElementKey) => void) {
  return {
    onClick: () => onSelect(key),
    onTap: () => onSelect(key),
  };
}

function LogoLayer({
  config,
  elementKey,
  placeholder,
  accent = "#f4c96b",
  onSelect,
  onCommit,
}: {
  config: ImageConfig;
  elementKey: ElementKey;
  placeholder: string;
  accent?: string;
  onSelect: (key: ElementKey) => void;
  onCommit: (key: ElementKey, value: TransformConfig) => void;
}) {
  const image = useCanvasImage(config.src);
  const width = config.width;
  const height = image ? width * (image.height / image.width) : elementKey === "bankBar" ? 82 : 110;
  return (
    <Group
      id={elementKey}
      x={config.x}
      y={config.y}
      scaleX={config.scale}
      scaleY={config.scale}
      opacity={config.opacity}
      draggable
      onDragEnd={(event) => onCommit(elementKey, { x: event.target.x(), y: event.target.y(), scale: event.target.scaleX() })}
      onTransformEnd={(event) => onCommit(elementKey, { x: event.target.x(), y: event.target.y(), scale: event.target.scaleX() })}
      {...selectProps(elementKey, onSelect)}
    >
      <Rect
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        fill={image ? "rgba(255,255,255,0.04)" : "rgba(4,25,67,0.84)"}
        stroke={config.borderWidth ? config.borderColor : accent}
        strokeWidth={config.borderWidth || (image ? 0 : 2)}
        cornerRadius={config.borderRadius}
        shadowColor={config.shadowColor}
        shadowBlur={config.shadowBlur}
        shadowOpacity={0.7}
      />
      {image ? (
        <KonvaImage
          image={image}
          x={-width / 2}
          y={-height / 2}
          width={width}
          height={height}
          cornerRadius={config.borderRadius}
        />
      ) : elementKey === "bankBar" ? (
        <>
          <Rect x={-width / 2 + 12} y={-height / 2 + 10} width={width - 24} height={height - 20} fill="#f7f8fb" cornerRadius={14} />
          <Text
            x={-width / 2}
            y={-12}
            width={width}
            text="MAYBANK   CIMB   PUBLIC BANK   RHB   HONG LEONG"
            align="center"
            fontFamily="Arial, sans-serif"
            fontStyle="bold"
            fontSize={25}
            fill="#17345d"
          />
        </>
      ) : (
        <>
          <Circle x={-width / 2 + 40} radius={15} fillLinearGradientStartPoint={{ x: -12, y: -12 }} fillLinearGradientEndPoint={{ x: 12, y: 12 }} fillLinearGradientColorStops={[0, "#fff2a8", 0.45, "#dca42e", 1, "#8a4b00"]} />
          <Text
            x={-width / 2 + 65}
            y={-21}
            width={width - 78}
            height={48}
            text={placeholder}
            verticalAlign="middle"
            align="center"
            fontFamily="Arial Black, Arial, sans-serif"
            fontStyle="bold"
            fontSize={elementKey === "companyLogo" ? 34 : 22}
            fill="#fff7d5"
            stroke="#a66d12"
            strokeWidth={1}
          />
        </>
      )}
    </Group>
  );
}

function PersonLayer({
  config,
  onSelect,
  onCommit,
}: {
  config: ImageConfig;
  onSelect: (key: ElementKey) => void;
  onCommit: (key: ElementKey, value: TransformConfig) => void;
}) {
  const image = useCanvasImage(config.src);
  const width = config.width;
  const height = image ? width * (image.height / image.width) : 650;
  return (
    <Group
      id="person"
      x={config.x}
      y={config.y}
      scaleX={config.scale}
      scaleY={config.scale}
      draggable
      onDragEnd={(event) => onCommit("person", { x: event.target.x(), y: event.target.y(), scale: event.target.scaleX() })}
      onTransformEnd={(event) => onCommit("person", { x: event.target.x(), y: event.target.y(), scale: event.target.scaleX() })}
      {...selectProps("person", onSelect)}
    >
      <Ellipse y={330} radiusX={width * 0.45} radiusY={310} fill="#e9ac2f" opacity={0.13} shadowColor="#ffc85a" shadowBlur={55} />
      {image ? (
        <KonvaImage
          image={image}
          x={-width / 2}
          y={0}
          width={width}
          height={height}
          shadowColor={config.shadowColor}
          shadowBlur={config.shadowBlur}
          shadowOpacity={0.65}
        />
      ) : (
        <Group y={24} listening={false}>
          <Circle y={116} radius={88} fillLinearGradientStartPoint={{ x: -55, y: -70 }} fillLinearGradientEndPoint={{ x: 70, y: 70 }} fillLinearGradientColorStops={[0, "#f4d5b7", 0.55, "#b87b55", 1, "#5d352c"]} stroke="#f5c960" strokeWidth={5} shadowColor="#f8c55a" shadowBlur={25} />
          <Line points={[-70, 105, -45, 43, 0, 17, 52, 47, 74, 110, 52, 70, 9, 55, -37, 72]} closed fill="#151c2e" tension={0.25} />
          <Line points={[-215, 610, -185, 310, -84, 244, 0, 270, 84, 244, 185, 310, 215, 610]} closed fillLinearGradientStartPoint={{ x: -180, y: 260 }} fillLinearGradientEndPoint={{ x: 190, y: 620 }} fillLinearGradientColorStops={[0, "#17294c", 0.42, "#07152e", 1, "#010714"]} stroke="#d9a637" strokeWidth={5} shadowColor="#050914" shadowBlur={28} />
          <Line points={[-78, 244, 0, 380, 80, 244, 45, 535, -45, 535]} closed fill="#f3f5ff" />
          <Line points={[-20, 318, 0, 378, 22, 318, 13, 500, 0, 540, -13, 500]} closed fill="#d6a22e" />
          <Line points={[-180, 323, -64, 528, -28, 288, -85, 240]} closed fill="#0d1b37" stroke="#5676a8" strokeWidth={2} />
          <Line points={[180, 323, 64, 528, 28, 288, 85, 240]} closed fill="#0d1b37" stroke="#5676a8" strokeWidth={2} />
          <Text x={-250} y={570} width={500} text="UPLOAD YOUR PERSON" align="center" fontSize={19} letterSpacing={4} fill="#f5d67c" opacity={0.7} />
        </Group>
      )}
    </Group>
  );
}

function BackgroundLayer({ config }: { config: PosterConfig["background"] }) {
  const image = useCanvasImage(config.src);
  const imageRef = useRef<Konva.Image>(null);
  const cover = useMemo(() => {
    if (!image) return null;
    const scale = Math.max(POSTER_SIZE / image.width, POSTER_SIZE / image.height) * config.scale;
    const width = image.width * scale;
    const height = image.height * scale;
    return { width, height, x: (POSTER_SIZE - width) / 2 + config.x, y: (POSTER_SIZE - height) / 2 + config.y };
  }, [config.scale, config.x, config.y, image]);

  useEffect(() => {
    const node = imageRef.current;
    if (!node || !image) return;
    node.clearCache();
    node.cache({ pixelRatio: 1 });
    node.getLayer()?.batchDraw();
  }, [image, config.brightness, config.contrast, config.blur]);

  return (
    <>
      <Rect
        width={POSTER_SIZE}
        height={POSTER_SIZE}
        fillLinearGradientStartPoint={{ x: 60, y: 0 }}
        fillLinearGradientEndPoint={{ x: 1170, y: 1254 }}
        fillLinearGradientColorStops={[0, "#020817", 0.34, "#061b48", 0.67, "#0a3472", 1, "#020817"]}
      />
      {image && cover && (
        <KonvaImage
          ref={imageRef}
          image={image}
          {...cover}
          filters={[Konva.Filters.Brighten, Konva.Filters.Contrast, Konva.Filters.Blur]}
          brightness={config.brightness / 100}
          contrast={config.contrast}
          blurRadius={config.blur}
        />
      )}
      <Rect width={POSTER_SIZE} height={POSTER_SIZE} fill="#03122f" opacity={config.overlay} />
    </>
  );
}

function CasinoDecor() {
  const coins = [
    [42, 1040, 24], [116, 1120, 17], [1184, 1050, 22], [1104, 1130, 15],
    [38, 285, 16], [1210, 300, 17], [310, 735, 13], [982, 750, 15],
  ];
  return (
    <Group listening={false}>
      {Array.from({ length: 15 }, (_, index) => {
        const angle = (index / 15) * Math.PI * 2;
        return <Line key={index} points={[627, 650, 627 + Math.cos(angle) * 860, 650 + Math.sin(angle) * 860]} stroke="#f4cc68" strokeWidth={5} opacity={0.05} />;
      })}
      <Ellipse x={627} y={620} radiusX={470} radiusY={520} stroke="#e3ad3e" strokeWidth={5} opacity={0.19} shadowColor="#ffc95d" shadowBlur={30} />
      <Ellipse x={627} y={620} radiusX={410} radiusY={455} stroke="#ffffff" strokeWidth={2} opacity={0.09} />
      {coins.map(([x, y, radius], index) => (
        <Group key={index} x={x} y={y} rotation={index * 17}>
          <Circle radius={radius} fillLinearGradientStartPoint={{ x: -radius, y: -radius }} fillLinearGradientEndPoint={{ x: radius, y: radius }} fillLinearGradientColorStops={[0, "#fff5a5", 0.35, "#e8ae2e", 0.75, "#8b4d08", 1, "#ffd765"]} stroke="#fff0a2" strokeWidth={2} shadowColor="#f4b739" shadowBlur={12} />
          <Text x={-radius} y={-radius * 0.56} width={radius * 2} text="$" align="center" fontStyle="bold" fontSize={radius} fill="#7d480b" />
        </Group>
      ))}
      <Rect x={58} y={1124} width={1138} height={92} cornerRadius={32} fill="#02112c" opacity={0.75} stroke="#d7a947" strokeWidth={2} />
    </Group>
  );
}

function formatPosterDate(date: string, time: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour = 0, minute = 0] = time.split(":").map(Number);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const h12 = hour % 12 || 12;
  return `${day || 1} ${months[(month || 1) - 1]} ${year || 2026} ${h12}:${String(minute).padStart(2, "0")}${hour >= 12 ? "PM" : "AM"}`;
}

function HeadlineText({
  elementKey,
  layer,
  text,
  width,
  align = "center",
  gradient,
  onSelect,
  onCommit,
}: {
  elementKey: ElementKey;
  layer: PosterConfig["headline"]["line1"];
  text: string;
  width: number;
  align?: "left" | "center";
  gradient?: "gold" | "silver" | false;
  onSelect: (key: ElementKey) => void;
  onCommit: (key: ElementKey, value: TransformConfig) => void;
}) {
  const gradientStops = gradient === "gold"
    ? [0, "#fff7ad", 0.28, "#f5c849", 0.58, "#ad650a", 0.78, "#ffe578", 1, "#c67b12"]
    : gradient === "silver"
      ? [0, "#ffffff", 0.34, "#b9c6d8", 0.58, "#65758c", 0.82, "#eef4ff", 1, "#8e9aaa"]
      : undefined;
  return (
    <Group
      id={elementKey}
      x={layer.x}
      y={layer.y}
      scaleX={layer.scale}
      scaleY={layer.scale}
      draggable
      onDragEnd={(event) => onCommit(elementKey, { x: event.target.x(), y: event.target.y(), scale: event.target.scaleX() })}
      onTransformEnd={(event) => onCommit(elementKey, { x: event.target.x(), y: event.target.y(), scale: event.target.scaleX() })}
      {...selectProps(elementKey, onSelect)}
    >
      <Text
        x={align === "center" ? -width / 2 : 0}
        width={width}
        text={text}
        align={align}
        fontSize={layer.fontSize}
        fontFamily={layer.fontFamily}
        fontStyle="bold"
        fill={gradientStops ? undefined : layer.fill}
        fillLinearGradientStartPoint={gradientStops ? { x: 0, y: 0 } : undefined}
        fillLinearGradientEndPoint={gradientStops ? { x: 0, y: layer.fontSize } : undefined}
        fillLinearGradientColorStops={gradientStops}
        stroke={layer.stroke}
        strokeWidth={layer.strokeWidth}
        lineJoin="round"
        shadowColor={layer.shadowColor}
        shadowBlur={layer.shadowBlur}
        shadowOffset={{ x: 6, y: 9 }}
        shadowOpacity={0.9}
      />
    </Group>
  );
}

export const PosterCanvas = forwardRef<PosterCanvasHandle, PosterCanvasProps>(function PosterCanvas(
  { config, selected, onSelect, onTransform },
  ref,
) {
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const safeAreaRef = useRef<Konva.Rect>(null);

  const syncedAmount = config.masterAmount;
  const withdrawAmount = formatWithdrawAmount(config.syncAmounts ? syncedAmount : config.withdraw.amount, 2);
  const successAmount = formatSuccessAmount(config.syncAmounts ? syncedAmount : config.success.amount, 1);
  const headlineAmount = formatHeadlineAmount(
    config.syncAmounts ? syncedAmount : config.headline.amount.value,
    config.headline.amount.decimals,
  );

  useEffect(() => {
    const transformer = transformerRef.current;
    const stage = stageRef.current;
    if (!transformer || !stage) return;
    const node = selected ? stage.findOne(`#${selected}`) : null;
    transformer.nodes(node ? [node] : []);
    transformer.getLayer()?.batchDraw();
  }, [selected, config]);

  useImperativeHandle(ref, () => ({
    exportImage(format, quality) {
      const stage = stageRef.current;
      if (!stage) throw new Error("Canvas is not ready");
      const transformer = transformerRef.current;
      const safeArea = safeAreaRef.current;
      transformer?.hide();
      safeArea?.hide();
      stage.batchDraw();
      try {
        return stage.toDataURL({ mimeType: format === "png" ? "image/png" : "image/jpeg", quality, pixelRatio: 1 });
      } finally {
        transformer?.show();
        safeArea?.show();
        stage.batchDraw();
      }
    },
  }));

  const commit = (key: ElementKey, value: TransformConfig) => {
    onTransform(key, { ...value, scale: Math.max(0.2, Math.min(3, value.scale)) });
  };

  return (
    <Stage
      ref={stageRef}
      width={POSTER_SIZE}
      height={POSTER_SIZE}
      onMouseDown={(event) => event.target === event.target.getStage() && onSelect(null)}
      onTouchStart={(event) => event.target === event.target.getStage() && onSelect(null)}
    >
      <Layer>
        <BackgroundLayer config={config.background} />
        <CasinoDecor />
        <PersonLayer config={config.person} onSelect={onSelect} onCommit={commit} />

        <LogoLayer config={config.gameLogoLeft} elementKey="gameLogoLeft" placeholder="LUCKY365" onSelect={onSelect} onCommit={commit} />
        <LogoLayer config={config.gameLogoRight} elementKey="gameLogoRight" placeholder="PYRAMID" onSelect={onSelect} onCommit={commit} />

        <Group
          id="withdraw"
          x={config.withdraw.x}
          y={config.withdraw.y}
          scaleX={config.withdraw.scale}
          scaleY={config.withdraw.scale}
          draggable
          onDragEnd={(event) => commit("withdraw", { x: event.target.x(), y: event.target.y(), scale: event.target.scaleX() })}
          onTransformEnd={(event) => commit("withdraw", { x: event.target.x(), y: event.target.y(), scale: event.target.scaleX() })}
          {...selectProps("withdraw", onSelect)}
        >
          <Rect width={420} height={225} cornerRadius={28} fill="rgba(251,253,255,0.94)" stroke="#f2c35a" strokeWidth={3} shadowColor="#000d25" shadowBlur={24} shadowOpacity={0.65} />
          <Rect width={420} height={54} cornerRadius={[28, 28, 0, 0]} fill="#eaf0f7" />
          <Text x={26} y={15} text={config.withdraw.title} fontSize={25} fontStyle="bold" fill="#142746" />
          <Text x={26} y={73} text={config.withdraw.orderId} fontSize={22} fill="#59677b" />
          <Text x={26} y={110} text="Jumlah :" fontSize={24} fill="#293a54" />
          <Text x={126} y={103} width={270} text={withdrawAmount} align="right" fontSize={config.withdraw.amountFontSize} fontStyle="bold" fill={config.withdraw.amountColor} />
          <Line points={[26, 165, 394, 165]} stroke="#d6dde7" strokeWidth={2} />
          <Text x={26} y={181} width={368} text={formatPosterDate(config.withdraw.date, config.withdraw.time)} align="center" fontSize={22} fill="#35445d" />
        </Group>

        <Group
          id="success"
          x={config.success.x}
          y={config.success.y}
          scaleX={config.success.scale}
          scaleY={config.success.scale}
          draggable
          onDragEnd={(event) => commit("success", { x: event.target.x(), y: event.target.y(), scale: event.target.scaleX() })}
          onTransformEnd={(event) => commit("success", { x: event.target.x(), y: event.target.y(), scale: event.target.scaleX() })}
          {...selectProps("success", onSelect)}
        >
          <Rect width={410} height={305} cornerRadius={30} fill="rgba(251,253,255,0.95)" stroke="#f2c35a" strokeWidth={3} shadowColor="#000d25" shadowBlur={24} shadowOpacity={0.7} />
          <Circle x={205} y={57} radius={31} fill="#25a879" shadowColor="#25a879" shadowBlur={14} />
          <Text x={177} y={36} width={56} text="✓" align="center" fontSize={40} fontStyle="bold" fill="#ffffff" />
          <Text x={30} y={102} width={350} text={config.success.title} align="center" fontSize={25} fontStyle="bold" fill="#172a45" />
          <Text x={30} y={140} width={350} text={successAmount} align="center" fontSize={35} fontStyle="bold" fill={config.success.amountColor} />
          <Text x={38} y={188} width={334} text={config.success.description1} align="center" fontSize={18} lineHeight={1.3} fill="#59677b" />
          <Text x={30} y={263} width={350} text={config.success.description2} align="center" fontSize={19} fontStyle="bold" fill="#213756" />
        </Group>

        <HeadlineText elementKey="headlineLine1" layer={config.headline.line1} text={config.headline.line1.text} width={1100} onSelect={onSelect} onCommit={commit} />
        <HeadlineText elementKey="cuci" layer={config.headline.cuci} text={config.headline.cuci.text} width={270} align="left" onSelect={onSelect} onCommit={commit} />
        <HeadlineText
          elementKey="headlineAmount"
          layer={config.headline.amount}
          text={headlineAmount}
          width={630}
          align="left"
          gradient={config.headline.amount.style === "solid" ? false : config.headline.amount.style}
          onSelect={onSelect}
          onCommit={commit}
        />

        <LogoLayer config={config.bankBar} elementKey="bankBar" placeholder="BANKS" onSelect={onSelect} onCommit={commit} />
        <LogoLayer config={config.companyLogo} elementKey="companyLogo" placeholder={config.companyName} onSelect={onSelect} onCommit={commit} />

        <Rect ref={safeAreaRef} x={30} y={30} width={POSTER_SIZE - 60} height={POSTER_SIZE - 60} stroke="#f6d475" strokeWidth={2} dash={[10, 10]} opacity={selected ? 0.38 : 0} listening={false} />
        <Transformer
          ref={transformerRef}
          rotateEnabled={false}
          keepRatio
          enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
          borderStroke="#ffcf5c"
          borderStrokeWidth={3}
          anchorFill="#ffffff"
          anchorStroke="#a96e05"
          anchorSize={16}
          boundBoxFunc={(oldBox, nextBox) => (nextBox.width < 30 || nextBox.height < 30 ? oldBox : nextBox)}
        />
      </Layer>
    </Stage>
  );
});
