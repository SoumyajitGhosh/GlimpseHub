import type { ReactNode } from "react";
import {
  useTransition as useSpringTransition,
  animated,
} from "@react-spring/web";
import classNames from "classnames";

import TextButton from "../Button/TextButton/TextButton";
import type { AnimatedStyle } from "../../types";

export interface DialogOption {
  text: string;
  warning?: boolean;
  className?: string;
  onClick?: () => void;
}

interface OptionsDialogProps {
  hide: () => void;
  options: DialogOption[];
  children?: ReactNode;
  title?: string;
  cancelButton?: boolean;
}

type LegacyTransitionFn = (
  render: (t: { key: string; props: AnimatedStyle }) => ReactNode
) => ReactNode;

const OptionsDialog = ({
  hide,
  options,
  children,
  title,
  cancelButton = true,
}: OptionsDialogProps) => {
  // NOTE: this uses a legacy react-spring transition call shape that is kept
  // verbatim from the pre-migration code — only the types are added here.
  const [transitions] = useSpringTransition(true, () => ({
    from: { transform: "scale(1.2)", opacity: 0.5 },
    enter: { transform: "scale(1)", opacity: 1 },
    leave: { opacity: 0 },
    config: {
      mass: 1,
      tension: 500,
      friction: 30,
    },
  })) as unknown as [LegacyTransitionFn];

  return transitions(({ key, props }) => (
    <animated.div style={props} key={key} className="options-dialog">
      {title && (
        <header className="options-dialog__title">
          <h1 className="heading-3">{title}</h1>
          {!cancelButton && (
            <TextButton style={{ fontSize: "3rem" }} onClick={() => hide()}>
              &#10005;
            </TextButton>
          )}
        </header>
      )}
      {children}
      {options.map((option, idx) => {
        const buttonClassNames = classNames({
          "options-dialog__button": true,
          "options-dialog__button--warning": option.warning,
          [option.className ?? ""]: option.className,
        });
        return (
          <button
            onClick={(event) => {
              if ("onClick" in option && option.onClick) {
                event.stopPropagation();
                option.onClick();
                hide();
              }
            }}
            className={buttonClassNames}
            key={idx}
          >
            {option.text}
          </button>
        );
      })}
      {cancelButton && (
        <button
          className="options-dialog__button"
          onClick={(event) => {
            event.nativeEvent.stopImmediatePropagation();
            hide();
          }}
        >
          Cancel
        </button>
      )}
    </animated.div>
  ));
};

export default OptionsDialog;
