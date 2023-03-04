import {
  DocumentRenderer,
  DocumentRendererProps,
} from '@keystone-6/document-renderer';
import { styled } from '@linaria/react';
import useResizeObserver from '@react-hook/resize-observer';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { BsBoxArrowUpRight } from 'react-icons/bs';
import { useColorScheme } from '../lib/store/color-scheme';

type SmartLinkProps = {
  children: React.ReactNode;
  href: string;
};

const StyledIcon = styled(BsBoxArrowUpRight)`
  display: inline-block;
  vertical-align: -0.1em;
  margin-inline-start: 0.3em;

  html[dir='rtl'] & {
    transform: scaleX(-1);
  }
`;

function SmartLink({ href, children }: SmartLinkProps) {
  if (/^[^\/]+:\/\//.test(href)) {
    return (
      <a href={href} rel="external">
        {children}
        <StyledIcon />
      </a>
    );
  }

  return <Link href={href}>{children}</Link>;
}

type EmbedProps = {
  src: string;
  alt: string;
  data: any;
  caption: React.ReactNode;
};

function Embed({ src, alt, data, caption }: EmbedProps) {
  data = JSON.parse(data);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeContents, setIframeContents] = useState<HTMLElement>();
  useResizeObserver(iframeContents ?? null, entry => {
    const iframe = iframeRef.current;

    if (!iframe) {
      return;
    }

    const { height } = entry.contentRect;
    iframe.style.height = `${height}px`;
    iframe.style.aspectRatio = '';
  });

  useEffect(() => {
    const iframe = iframeRef.current;

    if (!iframe?.contentDocument) {
      return;
    }

    const ready = () => {
      if (
        iframe?.contentDocument?.readyState !== 'complete' ||
        !iframe.contentDocument.documentElement.dataset.loaded
      ) {
        setTimeout(ready, 25);
        return;
      }

      setIframeContents(iframe.contentDocument.documentElement);
    };

    if (iframe.contentDocument.readyState === 'complete') {
      ready();
    } else {
      iframe.contentDocument.addEventListener('readystatechange', ready, {
        once: true,
      });
    }

    return () => {
      iframe.contentDocument?.removeEventListener('readystatechange', ready);
    };
  }, []);

  useEffect(() => {
    const contents = iframeContents?.querySelector('body');

    if (!contents) {
      return;
    }

    if (data.type === 'video') {
      for (const iframe of contents.querySelectorAll('iframe')) {
        if (iframe.width === '100%') {
          continue;
        }

        iframe.style.width = '100%';
        iframe.style.height = 'auto';
        iframe.style.aspectRatio = `${iframe.width} / ${iframe.height}`;
      }
    }

    for (const image of contents.querySelectorAll('img')) {
      image.style.height = 'auto';
      image.style.aspectRatio = `${image.width} / ${image.height}`;
    }

    for (const script of contents.querySelectorAll('script')) {
      const newScript = document.createElement('script');

      for (const attribute of script.attributes) {
        newScript.setAttribute(attribute.name, attribute.value);
      }

      newScript.append(document.createTextNode(script.innerHTML));
      script.parentNode?.replaceChild(newScript, script);
    }
  }, [data, iframeContents]);

  const [srcDoc, setSrcDoc] = useState(data.html);

  let [, , theme] = useColorScheme();

  useEffect(() => {
    if (!data.html) {
      return;
    }

    let html = data.html;
    if (/(?=class="twitter)/.test(data.html)) {
      html = html.replace(
        /(?=class="twitter)/,
        `data-theme="${theme}" `,
      );
    }

    setSrcDoc(
      `<!DOCTYPE html><html data-loaded="true" class="${theme}" lang=${process.env.NEXT_PUBLIC_LOCALE}><style>html{font-size:125%;color:#000}html.dark{color:#fff}body{margin:0;padding:0;display:flex;flex-direction:column;align-items:center}iframe,img{max-width:100%}</style><body>${html}</body></html>`,
    );
  }, [data.html, theme]);

  return (
    <figure>
      {data.type === 'uploaded-image' ? (
        <Image
          src={data.src}
          alt={alt}
          width={data.width}
          height={data.height}
          style={{
            height: 'auto',
            aspectRatio: `${data.width} / ${data.height}`,
          }}
        />
      ) : (
        <iframe
          ref={iframeRef}
          style={{
            width: 'var(--size-full)',
            aspectRatio: '16 / 9',
            border: '0',
            verticalAlign: 'top',
          }}
          srcDoc={srcDoc}
        />
      )}
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

const renderers: DocumentRendererProps['renderers'] = {
  inline: {
    link: SmartLink,
  },
};

const componentBlocks: DocumentRendererProps['componentBlocks'] = {
  embed: Embed,
};

type RendererProps = {
  document: DocumentRendererProps['document'];
};

export default function Renderer({ document }: RendererProps) {
  return (
    <DocumentRenderer
      document={document}
      renderers={renderers}
      componentBlocks={componentBlocks}
    />
  );
}
