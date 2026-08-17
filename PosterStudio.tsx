"use client";

import { useEffect, useRef, useState } from "react";
import ControlPanel from "@/components/editor/ControlPanel";
import { PosterCanvas, POSTER_SIZE, type PosterCanvasHandle } from "@/components/canvas/PosterCanvas";
import { amountDigits } from "@/lib/amount";
import { createDefaultPoster } from "@/lib/defaultPoster";
import { loadAutosave, loadPreset, saveAutosave, savePreset } from "@/lib/storage";
import type { ElementKey, ImageKey, PosterConfig, TransformConfig } from "@/types/poster";

function mergeSaved(saved: PosterConfig): PosterConfig {
  const defaults = createDefaultPoster();
  return {
    ...defaults,
    ...saved,
    companyLogo: { ...defaults.companyLogo, ...saved.companyLogo },
    gameLogoLeft: { ...defaults.gameLogoLeft, ...saved.gameLogoLeft },
    gameLogoRight: { ...defaults.gameLogoRight, ...saved.gameLogoRight },
    person: { ...defaults.person, ...saved.person },
    background: { ...defaults.background, ...saved.background },
    withdraw: { ...defaults.withdraw, ...saved.withdraw },
    success: { ...defaults.success, ...saved.success },
    headline: {
      line1: { ...defaults.headline.line1, ...saved.headline?.line1 },
      cuci: { ...defaults.headline.cuci, ...saved.headline?.cuci },
      amount: { ...defaults.headline.amount, ...saved.headline?.amount },
    },
    bankBar: { ...defaults.bankBar, ...saved.bankBar },
    export: { ...defaults.export, ...saved.export },
  };
}

export default function PosterStudio() {
  const [config, setConfig] = useState<PosterConfig>(() => {
    const saved = loadAutosave();
    return saved ? mergeSaved(saved) : createDefaultPoster();
  });
  const [selected, setSelected] = useState<ElementKey | null>(null);
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [previewScale, setPreviewScale] = useState(0.72);
  const canvasRef = useRef<PosterCanvasHandle>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const blobUrls = useRef<Set<string>>(new Set());

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2800);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => saveAutosave(config), 500);
    return () => window.clearTimeout(timer);
  }, [config]);

  useEffect(() => {
    const node = previewRef.current;
    if (!node) return;
    const update = () => setPreviewScale(Math.min(1, Math.max(0.2, node.clientWidth / POSTER_SIZE)));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const urls = blobUrls.current;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const upload = (key: ImageKey, file: File) => {
    const validTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      notify("请选择 PNG、JPG、JPEG 或 WEBP 图片");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      notify("图片超过 12MB，请先压缩后再上传");
      return;
    }
    const url = URL.createObjectURL(file);
    blobUrls.current.add(url);
    setConfig((current) => ({ ...current, [key]: { ...current[key], src: url } }));
    notify(`${file.name} 已加入海报`);
  };

  const updateTransform = (key: ElementKey, transform: TransformConfig) => {
    setConfig((current) => {
      if (["companyLogo", "gameLogoLeft", "gameLogoRight", "person", "bankBar"].includes(key)) {
        const imageKey = key as Exclude<ImageKey, "background">;
        return { ...current, [imageKey]: { ...current[imageKey], ...transform } };
      }
      if (key === "withdraw" || key === "success") {
        return { ...current, [key]: { ...current[key], ...transform } };
      }
      const headlineKey = key === "headlineLine1" ? "line1" : key === "headlineAmount" ? "amount" : "cuci";
      return {
        ...current,
        headline: { ...current.headline, [headlineKey]: { ...current.headline[headlineKey], ...transform } },
      };
    });
  };

  const handleExport = async (format: "jpg" | "png") => {
    if (exporting) return;
    setExporting(true);
    try {
      await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
      const dataUrl = canvasRef.current?.exportImage(format, config.export.quality);
      if (!dataUrl) throw new Error("Export failed");
      const company = config.companyName.trim().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "POSTER";
      const amount = amountDigits(config.masterAmount);
      const date = config.withdraw.date || new Date().toISOString().slice(0, 10);
      const anchor = document.createElement("a");
      anchor.href = dataUrl;
      anchor.download = `${company}-RM${amount}-${date}.${format === "png" ? "png" : "jpg"}`;
      anchor.click();
      notify(`${format.toUpperCase()} 已导出 · 1254 × 1254`);
    } catch {
      notify("导出失败，请稍后再试或更换较小的图片");
    } finally {
      setExporting(false);
    }
  };

  const useCurrentTime = () => {
    const now = new Date();
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    setConfig((current) => ({ ...current, withdraw: { ...current.withdraw, date, time } }));
    notify("已使用当前日期和时间");
  };

  const save = () => notify(savePreset(config) ? "Preset 已保存到此浏览器" : "浏览器储存空间不足，设定未保存");
  const load = () => {
    const saved = loadPreset();
    if (!saved) {
      notify("还没有已保存的 Preset");
      return;
    }
    setConfig(mergeSaved(saved));
    setSelected(null);
    notify("Preset 已载入");
  };
  const reset = () => {
    if (!window.confirm("确定恢复默认模板？当前未保存的设定会被清除。")) return;
    setConfig(createDefaultPoster());
    setSelected(null);
    notify("已恢复默认模板");
  };

  return (
    <main className="studio-shell">
      <ControlPanel
        config={config}
        exporting={exporting}
        onChange={setConfig}
        onUpload={upload}
        onSavePreset={save}
        onLoadPreset={load}
        onReset={reset}
        onUseCurrentTime={useCurrentTime}
        onExport={handleExport}
      />

      <section className="preview-panel">
        <header className="preview-header">
          <div><span className="eyebrow">LIVE CANVAS</span><h2>Poster Preview</h2></div>
          <div className="preview-meta"><span><i className="live-dot" /> Auto-updated</span><strong>1254 × 1254</strong></div>
        </header>
        <div className="preview-help"><span>点击元素选中 · 拖动移动 · 拖四角缩放</span><button onClick={() => setSelected(null)}>Clear selection</button></div>
        <div className="preview-viewport" ref={previewRef}>
          <div className="canvas-space" style={{ width: POSTER_SIZE * previewScale, height: POSTER_SIZE * previewScale }}>
            <div className="canvas-scaled" style={{ transform: `scale(${previewScale})` }}>
              <PosterCanvas ref={canvasRef} config={config} selected={selected} onSelect={setSelected} onTransform={updateTransform} />
            </div>
          </div>
        </div>
        <footer className="preview-footer"><span>所有图片只在你的浏览器中处理</span><button className="primary-export" disabled={exporting} onClick={() => handleExport(config.export.format)}>{exporting ? "EXPORTING…" : `EXPORT ${config.export.format.toUpperCase()}`}</button></footer>
      </section>
      {toast && <div className="toast" role="status">{toast}</div>}
    </main>
  );
}
