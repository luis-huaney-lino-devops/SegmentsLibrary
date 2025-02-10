import React, { useEffect, useRef } from "react";
import SegmentDisplay from "./GeneradorCanvas";

interface SegmentsProps {
  id?: string;
  pattern?: string;
  textopredefinido?: string;
  width?: number;
  height?: number;
  colorOn?: string;
  colorOff?: string;
  cantidadSegmentos?: 7 | 14 | 16;
  altoDisplay?: number;
  anchoDisplay?: number;
  distanciaEntreDigitos?: number;
  anchoSegmento?: number;
  distanciaSegmento?: number;
  tipoBorde?: 0 | 1 | 2 | 3;
  anguloDisplay?: number;
}

const Segments: React.FC<SegmentsProps> = ({
  id = "1",
  pattern = "#####",
  textopredefinido = "TUTEC",
  width = 300,
  height = 180,
  colorOn = "#4d91cd",
  colorOff = "#53595e45",
  cantidadSegmentos = 14,
  altoDisplay = 23.5,
  anchoDisplay = 14.5,
  distanciaEntreDigitos = 2.5,
  anchoSegmento = 3,
  distanciaSegmento = 0.3,
  tipoBorde = 3,
  anguloDisplay = 6
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const displayInstanceRef = useRef<InstanceType<typeof SegmentDisplay> | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Validar que cantidadSegmentos solo acepte 7, 14 o 16
    const segmentosValidos = [7, 14, 16] as const;
    const segmentosFinal = segmentosValidos.includes(cantidadSegmentos as 7 | 14 | 16) 
      ? cantidadSegmentos 
      : 7;

    // Validar que tipoBorde solo acepte 0, 1, 2 o 3
    const bordesValidos = [0, 1, 2, 3] as const;
    const bordeFinal = bordesValidos.includes(tipoBorde as 0 | 1 | 2 | 3) 
      ? tipoBorde 
      : 3;

    // Create new instance only if it doesn't exist
    if (!displayInstanceRef.current) {
      displayInstanceRef.current = new SegmentDisplay(`display-${id}`);
    }

    const display = displayInstanceRef.current;
    display.pattern = pattern;
    display.displayAngle = anguloDisplay;
    display.digitHeight = altoDisplay;
    display.digitWidth = anchoDisplay;
    display.digitDistance = distanciaEntreDigitos;
    display.segmentWidth = anchoSegmento;
    display.segmentDistance = distanciaSegmento;
    display.segmentCount = segmentosFinal;
    display.cornerType = bordeFinal;
    display.colorOn = colorOn;
    display.colorOff = colorOff;
    display.draw();
    display.setValue(textopredefinido);

    // Cleanup function
    return () => {
      displayInstanceRef.current = null;
    };
  }, [
    id,
    pattern,
    textopredefinido,
    colorOn,
    colorOff,
    cantidadSegmentos,
    altoDisplay,
    anchoDisplay,
    distanciaEntreDigitos,
    anchoSegmento,
    distanciaSegmento,
    tipoBorde,
    anguloDisplay
  ]);

  return (
    <canvas 
      ref={canvasRef} 
      id={`display-${id}`} 
      width={width} 
      height={height} 
    />
  );
};

export default Segments;