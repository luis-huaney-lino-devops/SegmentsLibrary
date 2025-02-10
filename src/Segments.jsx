import React, { useEffect, useRef } from "react";
import SegmentDisplay from "./GeneradorCanvas";

const Segments = ({
  id = "1",
  pattern = "#####", // Patrón por defecto
  textopredefinido = "TUTEC", // Texto por defecto
  width = 300,
  height = 180,
  colorOn = "#4d91cd",
  colorOff = "#53595e45",
  cantidadSegmentos = 14, // Solo puede ser 7, 14 o 16
  altoDisplay = 23.5,
  anchoDisplay = 14.5,
  distanciaEntreDigitos = 2.5,
  anchoSegmento = 3,
  distanciaSegmento = 0.3,
  tipoBorde = 3, // Tipo de borde permitido: 0, 1, 2, 3
  anguloDisplay = 6 // Ángulo de inclinación del display
}) => {
  const canvasRef = useRef(null);
  const displayInstanceRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Validar que cantidadSegmentos solo acepte 7, 14 o 16
    const segmentosValidos = [7, 14, 16];
    const segmentosFinal = segmentosValidos.includes(cantidadSegmentos) ? cantidadSegmentos : 7;

    // Validar que tipoBorde solo acepte 0, 1, 2 o 3
    const bordesValidos = [0, 1, 2, 3];
    const bordeFinal = bordesValidos.includes(tipoBorde) ? tipoBorde : 3;

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