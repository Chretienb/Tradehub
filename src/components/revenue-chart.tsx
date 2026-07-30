"use client";

import { useId, useMemo, useState } from "react";

type Point = { label: string; value: number };

function buildSmoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const midX = (p0.x + p1.x) / 2;
    d += ` C ${midX} ${p0.y}, ${midX} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  return d;
}

export function RevenueChart({ data }: { data: Point[] }) {
  const gradientId = useId();
  const [active, setActive] = useState(data.length - 1);

  const width = 640;
  const height = 200;
  const padY = 24;

  const { linePath, areaPath, coords } = useMemo(() => {
    const values = data.map((d) => d.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;

    const coords = data.map((d, i) => ({
      x: (i / (data.length - 1)) * width,
      y: padY + (1 - (d.value - min) / range) * (height - padY * 2),
    }));

    const linePath = buildSmoothPath(coords);
    const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${height} L ${coords[0].x} ${height} Z`;

    return { linePath, areaPath, coords };
  }, [data]);

  const activePoint = coords[active];
  const activeValue = data[active];

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div>
          <p className="font-heading text-3xl font-medium tracking-tight">{activeValue.value}k $</p>
          <p className="text-sm text-muted-foreground">{activeValue.label} 2026</p>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mt-4 h-44 w-full overflow-visible"
        preserveAspectRatio="none"
        onMouseLeave={() => setActive(data.length - 1)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path d={areaPath} fill={`url(#${gradientId})`} />
        <path d={linePath} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {activePoint && (
          <g>
            <line x1={activePoint.x} y1={0} x2={activePoint.x} y2={height} stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx={activePoint.x} cy={activePoint.y} r="5" fill="var(--primary)" stroke="var(--background)" strokeWidth="2" />
          </g>
        )}

        {coords.map((c, i) => (
          <rect
            key={i}
            x={c.x - width / data.length / 2}
            y={0}
            width={width / data.length}
            height={height}
            fill="transparent"
            onMouseEnter={() => setActive(i)}
            className="cursor-pointer"
          />
        ))}
      </svg>

      <div className="flex justify-between text-xs text-muted-foreground">
        {data.map((d, i) => (
          <span key={d.label} className={i === active ? "font-medium text-foreground" : undefined}>
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}
