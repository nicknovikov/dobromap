'use client';

import React, { useEffect, useLayoutEffect, useRef, useState, WheelEventHandler } from "react";
import { Group, Layer, Path, Rect, Stage, Text } from "react-konva";
import jsonRegions from './regions.json';
import Konva from "konva";
import { Shape } from "konva/lib/Shape";
import { MapRegion } from "@/types";

const regions = jsonRegions as [ MapRegion ];

interface KonvaMapProps
  extends Pick<
    React.HTMLAttributes<HTMLDivElement>,
    "className" | "role" | "style" | "tabIndex" | "title" | "onClick"
  > {
    onRegionClick: (region: MapRegion) => void
  }

const KonvaMap: React.FC<KonvaMapProps> = ({ className, onRegionClick, ...rest }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const groupRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const [scale, setScale] = useState(1);

  const [ tooltip, setTooltip ] = useState({ visible: false, x: 0, y: 0, width: 0, height: 0, text: '' });

  const tooltipRef = useRef(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleWheel: WheelEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();

    setScale((prevScale) => {
      const delta = event.deltaY < 0 ? 0.1 : -0.1; // up = increase, down = decrease
      const nextScale = prevScale + delta;

      // Clamp scale to reasonable bounds
      return Math.min(Math.max(nextScale, 0.5), 3);
    });
  };

  /* useEffect(() => {
    if (!groupRef.current || !size.width || !size.height) return;

    console.info(size.width, size.height);

    const group = groupRef.current;

    const layer = group.getLayer();

    layer.draw();

    const bounds = group.getClientRect({ skipTransform: true });

    console.info('*** BOUNDS', bounds);

    const scale = Math.min(
      size.width / bounds.width,
      size.height / bounds.height
    );

    group.scale({ x: scale, y: scale });

    group.position({
      x: (size.width - bounds.width * scale) / 2 - bounds.x * scale,
      y: (size.height - bounds.height * scale) / 2 - bounds.y * scale
    });

    group.getLayer().batchDraw();
  }, [size, regions]); */

  // @ts-ignore TODO: Check arguments typing
  function animateFill(node, toColor) {
    new Konva.Tween({
      node,
      duration: 0.2,
      fill: toColor,
      easing: Konva.Easings.EaseInOut,
    }).play();
  }

  useLayoutEffect(() => {
    if (!tooltipRef.current) return;

      const textNode: Shape = tooltipRef.current;

      setTooltip(prev => ({
        ...prev,
        y: prev.y - textNode.height(),
        width: textNode.width(),
        height: textNode.height(),
      }));
  }, [tooltip.text]);

  // @ts-ignore TODO: Check arguments typing
  function onMouseEnter(path, region: MapRegion) {
    const pointerPosition = path.getStage().getPointerPosition();
    // @ts-ignore Check arguments typing
    setTooltip({ visible: true, x: pointerPosition.x - path.getStage().position().x, y: pointerPosition.y - path.getStage().position().y, text: region.title || '' });
    animateFill(path, region.hover || 'red');
  }

  // @ts-ignore TODO: Check typing
  function onMouseLeave(path, region) {
    animateFill(path, region.fill || '#e5e7eb');
    // @ts-ignore TODO: Check properties
    setTooltip({ visible: false });
  }

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }} onWheel={ handleWheel }>

        <Stage width={size.width} height={size.height} draggable scaleX={ scale } scaleY={ scale }>
          <Layer>
            {regions.map(region => (
                <Path
                  key={region.id}
                  data={region.path}
                  fill={ region.fill || "#e5e7eb" }
                  onMouseEnter={ (e) => { onMouseEnter(e.target, region) }}
                  onMouseLeave={ (e) => { onMouseLeave(e.target, region) } }
                  onClick={ () => onRegionClick(region) }
                />
              ))}
          </Layer>
          <Layer listening={false} visible={tooltip.visible}>
            <Rect x={tooltip.x} y={tooltip.y} width={tooltip.width} height={tooltip.height} fill="#0009" />
            <Text ref={tooltipRef} x={tooltip.x} y={tooltip.y} text={tooltip.text} padding={5} fontSize={14} fill="white" />
          </Layer>
        </Stage>

    </div>
  );
};

export default KonvaMap;
