import { isMobile } from '@/utils/isMobileSignal';
import { createEffect, createSignal, Show } from 'solid-js';
import { isNotEmpty } from '@/utils/index';
import { DefaultAvatar } from './DefaultAvatar';

export const Avatar = (props: { initialAvatarSrc?: string; width?: string; height?: string }) => {
  const [avatarSrc, setAvatarSrc] = createSignal(props.initialAvatarSrc);

  createEffect(() => {
    if (avatarSrc()?.startsWith('{{') && props.initialAvatarSrc?.startsWith('http')) setAvatarSrc(props.initialAvatarSrc);
  });

  const avatarWidth = props.width || (isMobile() ? 'w-6' : 'w-8');
  const avatarHeight = props.height || (isMobile() ? 'h-6' : 'h-8');

  return (
    <Show when={isNotEmpty(avatarSrc())} keyed fallback={<DefaultAvatar />}>
      <figure
        class={`flex justify-center items-center rounded-full text-white relative flex-shrink-0 ${avatarWidth} ${avatarHeight} ${
          isMobile() ? 'text-sm' : 'text-xl'
        }`}
      >
        <img src={avatarSrc()} alt="Bot avatar" class="object-cover w-full h-full" />
      </figure>
    </Show>
  );
};
