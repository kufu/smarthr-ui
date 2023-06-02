import { keyframes } from 'styled-components';
export const lineDuration = '4800ms';
export const cogDuration = '1200ms';
export const spinnerEasing = 'cubic-bezier(0.4, 0, 0.2, 1)';
export const containerRotate = keyframes `
  to {
    transform: rotate(360deg);
  }
`;
export const fillUnfillRotate = keyframes `
  12.5% {
    transform: rotate(135deg);
  }
  25% {
    transform: rotate(270deg);
  }
  37.5% {
    transform: rotate(405deg);
  }
  50% {
    transform: rotate(540deg);
  }
  62.5% {
    transform: rotate(675deg);
  }
  75% {
    transform: rotate(810deg);
  }
  87.5% {
    transform: rotate(945deg);
  }
  to {
    transform: rotate(1080deg);
  }
`;
export const line1FadeInOut = keyframes `
  0% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  26% {
    opacity: 0;
  }
  89% {
    opacity: 0;
  }
  90% {
    opacity: 1;
  }
  to {
    opacity: 1;
  }
`;
export const line2FadeInOut = keyframes `
  0% {
    opacity: 0;
  }
  15% {
    opacity: 0;
  }
  25% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  51% {
    opacity: 0;
  }
`;
export const line3FadeInOut = keyframes `
  0% {
    opacity: 0;
  }
  40% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  76% {
    opacity: 0;
  }
`;
export const line4FadeInOut = keyframes `
  0% { 
    opacity: 0;
  }
  65% {
    opacity: 0;
  }
  75% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;
export const leftSpin = keyframes `
  0% {
    transform: rotate(130deg);
  }
  50% {
    transform: rotate(-5deg);
  }
  to {
    transform: rotate(130deg);
  }
`;
export const rightSpin = keyframes `
  0% {
    transform: rotate(-130deg);
  }
  50% {
    transform: rotate(5deg);
  }
  to {
    transform: rotate(-130deg);
  }
`;
//# sourceMappingURL=loaderAnimation.js.map