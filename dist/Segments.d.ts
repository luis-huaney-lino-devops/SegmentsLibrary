import React from "react";
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
declare const Segments: React.FC<SegmentsProps>;
export default Segments;
//# sourceMappingURL=Segments.d.ts.map