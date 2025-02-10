# Documentación del Componente Segments
## Licencia
MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Descripción
El componente `Segments` permite mostrar un display de segmentos al estilo de relojes digitales o pantallas de calculadoras. Es altamente configurable y admite distintos tamaños, colores y estilos de segmentos.

## Instalación
Para usar este componente en tu proyecto, primero instala la librería:

```sh
npm install segmentslibrary
```

Luego, impórtalo en tu código:

```jsx
import Segments from "segmentslibrary";
```

## Props del Componente
| Propiedad              | Tipo    | Descripción |
|------------------------|---------|-------------|
| `id`                  | String  | Identificador único del display (por defecto "1"). |
| `pattern`             | String  | Patrón del display (ej. "#####", "##:##:##"). |
| `textopredefinido`    | String  | Texto inicial que se mostrará en el display. |
| `width`               | Number  | Ancho del canvas (px). |
| `height`              | Number  | Alto del canvas (px). |
| `colorOn`             | String  | Color de los segmentos activos. |
| `colorOff`            | String  | Color de los segmentos inactivos. |
| `cantidadSegmentos`   | Number  | Cantidad de segmentos (7, 14 o 16). |
| `altoDisplay`         | Number  | Altura de los dígitos. |
| `anchoDisplay`        | Number  | Ancho de los dígitos. |
| `distanciaEntreDigitos` | Number | Espacio entre los dígitos. |
| `anchoSegmento`       | Number  | Ancho de los segmentos. |
| `distanciaSegmento`   | Number  | Distancia entre los segmentos. |
| `tipoBorde`          | Number  | Tipo de borde (0, 1, 2 o 3). |
| `anguloDisplay`       | Number  | Ángulo de inclinación del display. |

## Ejemplo: Crear un Reloj Digital
Para mostrar un reloj en tiempo real con este componente:

```jsx
import React, { useState, useEffect } from 'react';
import Segments from 'segmentslibrary';  // Ajusta la ruta según tu estructura de archivos

const DigitalClock = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const formatTime = (date) => {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    };

    setTime(formatTime(new Date()));

    const intervalId = setInterval(() => {
      setTime(formatTime(new Date()));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="digital-clock">
      <Segments
        id="reloj"
        textopredefinido={time}
        pattern="##:##:##"
        width={400}
        height={200}
        colorOn="#ff5555"
        colorOff="#33333330"
        altoDisplay={30}
        anchoDisplay={18}
        distanciaEntreDigitos={3}
        anchoSegmento={3.5}
        cantidadSegmentos={7}
        anguloDisplay={7}
      />
    </div>
  );
};

export default DigitalClock;
```

## Ejemplo: Animación de Palabra Letra por Letra
Para animar una palabra letra por letra con parpadeo:

```jsx
import React, { useState, useEffect } from 'react'; 
import Segments from 'segmentslibrary';  // Ajusta la ruta según tu estructura de archivos

const AnimatedSegments = ({
  text = "TUTEC",
  animationSpeed = 500,
  blinkCount = 2,
  id = "animated"
}) => {
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);
  const [blinkPhase, setBlinkPhase] = useState(0);

  useEffect(() => {
    const animate = () => {
      if (index <= text.length) {
        setDisplayText(text.substring(0, index));
        setIndex(prev => prev + 1);
      } else if (blinkPhase < blinkCount * 2) {
        if (blinkPhase % 2 === 0) {
          setDisplayText('     ');
        } else {
          setDisplayText(text);
        }
        setBlinkPhase(prev => prev + 1);
      } else {
        setIndex(0);
        setBlinkPhase(0);
      }
    };

    const intervalId = setInterval(animate, animationSpeed);
    return () => clearInterval(intervalId);
  }, [text, animationSpeed, blinkCount, index, blinkPhase]);

  return (
    <Segments
      id={id}
      textopredefinido={displayText}
      pattern="#####"
      width={300}
      height={180}
      colorOn="#4d91cd"
      colorOff="#53595e45"
      cantidadSegmentos={14}
      altoDisplay={23.5}
      anchoDisplay={14.5}
      distanciaEntreDigitos={2.5}
      anchoSegmento={3}
      distanciaSegmento={0.3}
      tipoBorde={3}
      anguloDisplay={6}
    />
  );
};

export default AnimatedSegments;
```

## Ejemplo de Manejo de Errores
Si se proporciona un valor incorrecto en `cantidadSegmentos`, el componente lo corregirá automáticamente a 7, 14 o 16.

```jsx
<Segments cantidadSegmentos={10} />  // Se corregirá a 7
```



Este componente es ideal para paneles de control, relojes digitales, y más. 🚀

