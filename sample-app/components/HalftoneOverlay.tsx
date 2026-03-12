import React, { useState, useRef } from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import Svg, { Defs, Pattern, Circle, Rect } from 'react-native-svg';

type Props = {
  dotSize?: number;
  spacing?: number;
  opacity?: number;
};

let idCounter = 0;

export default function HalftoneOverlay({
  dotSize = 0.8,
  spacing = 4,
  opacity = 0.1,
}: Props) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const patternId = useRef(`halftone-${idCounter++}`).current;

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ width, height });
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none" onLayout={onLayout}>
      {size.width > 0 && size.height > 0 && (
        <Svg width={size.width} height={size.height}>
          <Defs>
            <Pattern
              id={patternId}
              x="0"
              y="0"
              width={spacing}
              height={spacing}
              patternUnits="userSpaceOnUse"
            >
              <Circle
                cx={spacing / 2}
                cy={spacing / 2}
                r={dotSize}
                fill={`rgba(0,0,0,${opacity})`}
              />
            </Pattern>
          </Defs>
          <Rect
            x="0"
            y="0"
            width={size.width}
            height={size.height}
            fill={`url(#${patternId})`}
          />
        </Svg>
      )}
    </View>
  );
}
