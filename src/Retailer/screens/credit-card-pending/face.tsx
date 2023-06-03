import React, {memo, useMemo} from 'react';
import Svg, {Circle, Path} from 'react-native-svg';

const EYE_COOFICIENT = 0.3;

const FACE_COOFICIENT = 0.35;

const MOUTH_RADIUS = 0.9;

export const ARC_SIZE = 100;
export const ARC_WIDTH = 10;

export const Face = memo(
  ({color, variant}: {color: string; variant: 'HAPPY' | 'SAD'}) => {
    const mouthDefinition = useMemo(() => {
      return `M ${EYE_COOFICIENT * ARC_SIZE} ${
        ARC_SIZE - FACE_COOFICIENT * ARC_SIZE
      } A ${ARC_SIZE / 2 - EYE_COOFICIENT} ${ARC_SIZE * MOUTH_RADIUS} 0 0 ${
        variant === 'HAPPY' ? '0' : '1'
      } ${ARC_SIZE - EYE_COOFICIENT * ARC_SIZE} ${
        ARC_SIZE - FACE_COOFICIENT * ARC_SIZE
      }`;
    }, [variant]);

    return (
      <Svg height="100%" width="100%" viewBox={`0 0 ${ARC_SIZE} ${ARC_SIZE}`}>
        <Circle
          r={ARC_SIZE / 2 - 10}
          cx={ARC_SIZE / 2}
          cy={ARC_SIZE / 2}
          strokeWidth={ARC_WIDTH}
          stroke={color}
          fill="transparent"
        />

        <Circle
          r={ARC_WIDTH / 2}
          fill={color}
          cx={EYE_COOFICIENT * ARC_SIZE}
          cy={EYE_COOFICIENT * ARC_SIZE}
        />
        <Circle
          r={ARC_WIDTH / 2}
          fill={color}
          cx={ARC_SIZE - EYE_COOFICIENT * ARC_SIZE}
          cy={EYE_COOFICIENT * ARC_SIZE}
        />
        <Path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={ARC_WIDTH}
          fill="transparent"
          stroke={color}
          d={mouthDefinition}
        />
      </Svg>
    );
  },
);
