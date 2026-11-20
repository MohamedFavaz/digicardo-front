import { describe, expect, it } from "vitest";
import { centredView, clampView, outputRect, outputSize, scaleLimits, zoomAt } from "@/lib/editor/crop";

const FRAME = 280;

describe("image cropper geometry", () => {
  it("allows zooming out until the whole image fits, and in to 5x cover", () => {
    const { min, cover, max } = scaleLimits(1000, 500, FRAME);
    expect(min).toBeCloseTo(0.28);
    expect(cover).toBeCloseTo(0.56);
    expect(max).toBeCloseTo(2.8);
  });

  it("starts centred and covering the frame", () => {
    const v = centredView(1000, 500, FRAME, scaleLimits(1000, 500, FRAME).cover);
    expect(v.y).toBeCloseTo(0);
    expect(v.x).toBeCloseTo((FRAME - 560) / 2);
  });

  it("never leaves a gap when the image is bigger than the frame", () => {
    const v = clampView({ scale: 0.56, x: 50, y: -40 }, 1000, 500, FRAME);
    expect(v.x).toBe(0);
    expect(v.y).toBe(0);
    const w = clampView({ scale: 0.56, x: -900, y: 0 }, 1000, 500, FRAME);
    expect(w.x).toBeCloseTo(FRAME - 560);
  });

  it("keeps a zoomed-out (letterboxed) image inside the frame", () => {
    const v = clampView({ scale: 0.28, x: -30, y: 500 }, 1000, 500, FRAME);
    expect(v.x).toBe(0);
    expect(v.y).toBeCloseTo(FRAME - 140);
  });

  it("zooms around the pointer", () => {
    const start = centredView(1000, 1000, FRAME, 0.28);
    const v = zoomAt(start, 0.56, 140, 140, 1000, 1000, FRAME);
    expect(v.x).toBeCloseTo(-140);
    expect(v.y).toBeCloseTo(-140);
  });

  it("maps the frame to the output square", () => {
    const r = outputRect({ scale: 0.5, x: -10, y: 20 }, 1000, 400, FRAME, 560);
    expect(r).toEqual({ dx: -20, dy: 40, dw: 1000, dh: 400 });
  });

  it("picks an output size between 256 and 1024 without upscaling detail", () => {
    expect(outputSize({ scale: 0.1, x: 0, y: 0 }, FRAME)).toBe(1024);
    expect(outputSize({ scale: 0.5, x: 0, y: 0 }, FRAME)).toBe(560);
    expect(outputSize({ scale: 3, x: 0, y: 0 }, FRAME)).toBe(256);
  });
});
