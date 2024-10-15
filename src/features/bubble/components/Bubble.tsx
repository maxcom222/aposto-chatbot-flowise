import { createSignal, Show, splitProps, onCleanup, createEffect } from 'solid-js';
import styles from '../../../assets/index.css';
import { BubbleButton } from './BubbleButton';
import { BubbleParams } from '../types';
import { Bot, BotProps } from '../../../components/Bot';
import Tooltip from './Tooltip';
import { getBubbleButtonSize } from '@/utils';

const defaultButtonColor = '#3B81F6';
const defaultIconColor = 'white';

export type BubbleProps = BotProps & BubbleParams;

export const Bubble = (props: BubbleProps) => {
  const [bubbleProps] = splitProps(props, ['theme']);

  const [isBotOpened, setIsBotOpened] = createSignal(false);
  const [isBotStarted, setIsBotStarted] = createSignal(false);
  const [buttonPosition, setButtonPosition] = createSignal({
    bottom: bubbleProps.theme?.button?.bottom ?? 20,
    right: bubbleProps.theme?.button?.right ?? 20,
  });

  const openBot = () => {
    if (!isBotStarted()) setIsBotStarted(true);
    setIsBotOpened(true);
  };

  const closeBot = () => {
    setIsBotOpened(false);
  };

  const toggleBot = () => {
    isBotOpened() ? closeBot() : openBot();
  };

  onCleanup(() => {
    setIsBotStarted(false);
  });

  const buttonSize = getBubbleButtonSize(props.theme?.button?.size); // Default to 48px if size is not provided
  const buttonBottom = props.theme?.button?.bottom ?? 20;
  const chatWindowBottom = buttonBottom + buttonSize + 10; // Adjust the offset here for slight shift

  // Add viewport meta tag dynamically
  createEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, interactive-widget=resizes-visual';
    document.head.appendChild(meta);

    return () => {
      document.head.removeChild(meta);
    };
  });

  const showTooltip = bubbleProps.theme?.tooltip?.showTooltip ?? false;

  return (
    <>
      <style>{styles}</style>
      <Tooltip
        showTooltip={showTooltip && !isBotOpened()}
        position={buttonPosition()}
        buttonSize={buttonSize}
        tooltipMessage={bubbleProps.theme?.tooltip?.tooltipMessage}
        tooltipBackgroundColor={bubbleProps.theme?.tooltip?.tooltipBackgroundColor}
        tooltipTextColor={bubbleProps.theme?.tooltip?.tooltipTextColor}
        tooltipFontSize={bubbleProps.theme?.tooltip?.tooltipFontSize} // Set the tooltip font size
      />
      <BubbleButton
        {...bubbleProps.theme?.button}
        toggleBot={toggleBot}
        isBotOpened={isBotOpened()}
        setButtonPosition={setButtonPosition}
        dragAndDrop={bubbleProps.theme?.button?.dragAndDrop ?? false}
        autoOpen={bubbleProps.theme?.button?.autoWindowOpen?.autoOpen ?? false}
        openDelay={bubbleProps.theme?.button?.autoWindowOpen?.openDelay}
        autoOpenOnMobile={bubbleProps.theme?.button?.autoWindowOpen?.autoOpenOnMobile ?? false}
      />
      <div
        part="bot"
        style={{
          height: bubbleProps.theme?.chatWindow?.height ? `calc(90%)` : 'calc(88%)',
          width: bubbleProps.theme?.chatWindow?.width ? `${bubbleProps.theme?.chatWindow?.width.toString()}px` : undefined,
          transition: 'transform 200ms cubic-bezier(0, 1.2, 1, 1), opacity 150ms ease-out',
          'transform-origin': 'bottom right',
          transform: isBotOpened() ? 'scale3d(1, 1, 1)' : 'scale3d(0, 0, 1)',
          'box-shadow': 'rgb(0 0 0 / 16%) 0px 5px 40px',
          'background-color': bubbleProps.theme?.chatWindow?.backgroundColor || '#ffffff',
          'background-image': bubbleProps.theme?.chatWindow?.backgroundImage ? `url(${bubbleProps.theme?.chatWindow?.backgroundImage})` : 'none',
          'background-size': 'cover',
          'background-position': 'center',
          'background-repeat': 'no-repeat',
          'z-index': 42424242,
          bottom: `16px`,
          right: `16px`,
        }}
        class={
          `fixed sm:right-5 rounded-2xl w-full sm:w-[420px] max-h-[100%]` +
          (isBotOpened() ? ' opacity-1' : ' opacity-0 pointer-events-none') +
          ` bottom-${chatWindowBottom}px`
        }
      >
        <Show when={true}>
          <div class="relative h-full">
            <Show when={true}>
              {/* Cross button For only mobile screen use this <Show when={isBotOpened() && window.innerWidth <= 640}>  */}
              <button
                onClick={closeBot}
                class="py-2 pr-3 absolute top-0 right-[-8px] m-[6px] bg-transparent text-white rounded-full z-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:brightness-100 transition-all filter hover:brightness-90 active:brightness-75"
                title="Close Chat"
              >
                <svg width="30" height="30" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0" /><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" /><g id="SVGRepo_iconCarrier"> <title>close-circle</title> <g id="Layer_2" data-name="Layer 2"> <g id="invisible_box" data-name="invisible box"> <rect width="48" height="48" fill="none" /> </g> <g id="icons_Q2" data-name="icons Q2"> <path d="M24,6A18,18,0,1,1,6,24,18.1,18.1,0,0,1,24,6m0-4A22,22,0,1,0,46,24,21.9,21.9,0,0,0,24,2Z" /> <path d="M26.8,24l5.6-5.5a2.1,2.1,0,0,0,.2-2.7,1.9,1.9,0,0,0-3-.2L24,21.2l-5.6-5.6a1.9,1.9,0,0,0-3,.2,2.1,2.1,0,0,0,.2,2.7L21.2,24l-5.6,5.5a2.1,2.1,0,0,0-.2,2.7,1.9,1.9,0,0,0,3,.2L24,26.8l5.6,5.6a1.9,1.9,0,0,0,3-.2,2.1,2.1,0,0,0-.2-2.7Z" /> </g> </g> </g></svg>
              </button>
            </Show>
            <Bot
              badgeBackgroundColor={bubbleProps.theme?.chatWindow?.backgroundColor}
              bubbleBackgroundColor={bubbleProps.theme?.button?.backgroundColor ?? defaultButtonColor}
              bubbleTextColor={bubbleProps.theme?.button?.iconColor ?? defaultIconColor}
              showTitle={bubbleProps.theme?.chatWindow?.showTitle}
              showAgentMessages={bubbleProps.theme?.chatWindow?.showAgentMessages}
              title={bubbleProps.theme?.chatWindow?.title}
              titleAvatarSrc={bubbleProps.theme?.chatWindow?.titleAvatarSrc}
              welcomeMessage={bubbleProps.theme?.chatWindow?.welcomeMessage}
              errorMessage={bubbleProps.theme?.chatWindow?.errorMessage}
              poweredByTextColor={bubbleProps.theme?.chatWindow?.poweredByTextColor}
              textInput={bubbleProps.theme?.chatWindow?.textInput}
              botMessage={bubbleProps.theme?.chatWindow?.botMessage}
              userMessage={bubbleProps.theme?.chatWindow?.userMessage}
              feedback={bubbleProps.theme?.chatWindow?.feedback}
              fontSize={bubbleProps.theme?.chatWindow?.fontSize}
              footer={bubbleProps.theme?.chatWindow?.footer}
              starterPrompts={bubbleProps.theme?.chatWindow?.starterPrompts}
              starterPromptFontSize={bubbleProps.theme?.chatWindow?.starterPromptFontSize}
              chatflowid={props.chatflowid}
              chatflowConfig={props.chatflowConfig}
              apiHost={props.apiHost}
              onRequest={props.onRequest}
              observersConfig={props.observersConfig}
              clearChatOnReload={bubbleProps.theme?.chatWindow?.clearChatOnReload}
            />
          </div>
        </Show>
      </div>
    </>
  );
};
