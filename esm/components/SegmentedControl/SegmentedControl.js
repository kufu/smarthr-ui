import React, { useCallback, useEffect, useRef, useState, } from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../Button';
import { useClassNames } from './useClassNames';
export const SegmentedControl = ({ options, value, onClickOption, size = 'default', isSquare = false, className = '', ...props }) => {
    const themes = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef(null);
    const handleKeyDown = useCallback((e) => {
        if (!isFocused || !containerRef.current || !document.activeElement) {
            return;
        }
        const radios = Array.from(containerRef.current.querySelectorAll('[role="radio"]:not(:disabled)'));
        if (radios.length < 2) {
            return;
        }
        const focusedIndex = radios.indexOf(document.activeElement);
        if (focusedIndex === -1) {
            return;
        }
        switch (e.key) {
            case 'Down':
            case 'ArrowDown':
            case 'Right':
            case 'ArrowRight': {
                const nextIndex = focusedIndex + 1;
                const nextRadio = radios[nextIndex % radios.length];
                if (nextRadio instanceof HTMLButtonElement) {
                    nextRadio.focus();
                }
                break;
            }
            case 'Up':
            case 'ArrowUp':
            case 'Left':
            case 'ArrowLeft': {
                const nextIndex = focusedIndex - 1;
                const nextRadio = radios[(nextIndex + radios.length) % radios.length];
                if (nextRadio instanceof HTMLButtonElement) {
                    nextRadio.focus();
                }
                break;
            }
        }
    }, [isFocused]);
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);
    const includesSelected = value && options.some((option) => option.value === value);
    const getRovingTabIndex = useCallback((option, index) => {
        if (isFocused) {
            return -1;
        }
        if (!includesSelected) {
            return index === 0 ? 0 : -1;
        }
        return option.value === value ? 0 : -1;
    }, [includesSelected, isFocused, value]);
    const classNames = useClassNames();
    return (React.createElement(Container, { ...props, className: `${className} ${classNames.wrapper}`, onFocus: () => setIsFocused(true), onBlur: () => setIsFocused(false), ref: containerRef, role: "toolbar" },
        React.createElement("div", { role: "radiogroup" }, options.map((option, i) => {
            const isSelected = !!value && value === option.value;
            const onClick = onClickOption ? () => onClickOption(option.value) : undefined;
            return (React.createElement(StyledButton, { "aria-label": option.ariaLabel, key: option.value, disabled: option.disabled, onClick: onClick, size: size, square: isSquare, themes: themes, tabIndex: getRovingTabIndex(option, i), role: "radio", "aria-checked": isSelected, className: classNames.button }, option.content));
        }))));
};
const Container = styled.div `
  display: inline-flex;
`;
const StyledButton = styled(Button)(({ themes: { border, color, radius, shadow } }) => css `
      margin: 0;
      border-radius: 0;

      &[aria-checked='true'] {
        border-color: ${color.MAIN};
        background-color: ${color.MAIN};
        color: ${color.TEXT_WHITE};
        &.hover {
          border-color: ${color.hoverColor(color.MAIN)};
          background-color: ${color.hoverColor(color.MAIN)};
        }
      }

      &:focus-visible {
        ${shadow.focusIndicatorStyles}
      }
      &:first-child {
        border-top-left-radius: ${radius.m};
        border-bottom-left-radius: ${radius.m};
      }
      &:last-child {
        border-top-right-radius: ${radius.m};
        border-bottom-right-radius: ${radius.m};
      }
      & + & {
        margin-left: -${border.lineWidth};
      }
    `);
//# sourceMappingURL=SegmentedControl.js.map