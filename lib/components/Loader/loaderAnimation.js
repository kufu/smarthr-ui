"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rightSpin = exports.leftSpin = exports.line4FadeInOut = exports.line3FadeInOut = exports.line2FadeInOut = exports.line1FadeInOut = exports.fillUnfillRotate = exports.containerRotate = exports.spinnerEasing = exports.cogDuration = exports.lineDuration = void 0;
const styled_components_1 = require("styled-components");
exports.lineDuration = '4800ms';
exports.cogDuration = '1200ms';
exports.spinnerEasing = 'cubic-bezier(0.4, 0, 0.2, 1)';
exports.containerRotate = (0, styled_components_1.keyframes) `
  to {
    transform: rotate(360deg);
  }
`;
exports.fillUnfillRotate = (0, styled_components_1.keyframes) `
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
exports.line1FadeInOut = (0, styled_components_1.keyframes) `
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
exports.line2FadeInOut = (0, styled_components_1.keyframes) `
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
exports.line3FadeInOut = (0, styled_components_1.keyframes) `
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
exports.line4FadeInOut = (0, styled_components_1.keyframes) `
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
exports.leftSpin = (0, styled_components_1.keyframes) `
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
exports.rightSpin = (0, styled_components_1.keyframes) `
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