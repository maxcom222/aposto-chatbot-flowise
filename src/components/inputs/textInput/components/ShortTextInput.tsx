import { createSignal, splitProps } from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';

type ShortTextInputProps = {
  ref: HTMLInputElement | HTMLTextAreaElement | undefined;
  onInput: (value: string) => void;
  fontSize?: number;
  disabled?: boolean;
  onChangeFocus?: (isfocused: boolean) => void;
} & Omit<JSX.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onInput'>;

const DEFAULT_HEIGHT = 56;
const LINE_HEIGHT = 24; // Approximate line height in pixels

export const ShortTextInput = (props: ShortTextInputProps) => {
  const [local, others] = splitProps(props, ['ref', 'onInput']);
  const [height, setHeight] = createSignal(DEFAULT_HEIGHT);
  const [overflowY, setOverflowY] = createSignal<'hidden' | 'auto'>('hidden');

  const handleInput = (e: InputEvent) => {
    const target = e.currentTarget as HTMLTextAreaElement;
    if (props.ref) {
      const currentHeight = target.scrollHeight;
      const lineCount = Math.floor(currentHeight / LINE_HEIGHT);

      if (target.value === '') {
        setHeight(DEFAULT_HEIGHT);
        setOverflowY('hidden');
      } else {
        setHeight(currentHeight - 24);
        setOverflowY(lineCount > 3 ? 'auto' : 'hidden');
      }

      local.onInput(target.value);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const target = e.currentTarget as HTMLTextAreaElement;
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      target.value += '\n';
      handleInput(e as unknown as InputEvent);
    }
  };

  const handleFocus = () => {
    if (props.onChangeFocus) {
      props.onChangeFocus(true);
    }
  };

  const handleBlur = () => {
    if (props.onChangeFocus) {
      props.onChangeFocus(false);
    }
  };

  return (
    <textarea
      ref={props.ref}
      class="focus:outline-none bg-transparent px-4 py-4 flex-1 w-full h-full min-h-[56px] max-h-[128px] text-input disabled:opacity-50 disabled:cursor-not-allowed disabled:brightness-100"
      disabled={props.disabled}
      style={{
        'font-size': props.fontSize ? `${props.fontSize}px` : '16px',
        resize: 'none',
        height: `${props.value !== '' ? height() : DEFAULT_HEIGHT}px`,
        'overflow-y': overflowY(),
        'overflow-x': 'hidden', // Prevent horizontal scrolling
      }}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      {...others}
    />
  );
};
