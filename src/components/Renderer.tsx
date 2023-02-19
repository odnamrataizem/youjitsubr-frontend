import {
  DocumentRenderer,
  DocumentRendererProps,
} from '@keystone-6/document-renderer';
import Image from 'next/image';
import React, { useEffect, useMemo, useRef } from 'react';

type EmbedProps = {
  src: string;
  alt: string;
  data: any;
  caption: React.ReactNode;
};

function Embed({ src, alt, data, caption }: EmbedProps) {
  data = JSON.parse(data);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const resizeObserver = useMemo(
    () =>
      globalThis.ResizeObserver
        ? new ResizeObserver(entries => {
            const iframe = iframeRef.current;

            if (!iframe) {
              return;
            }

            const { height } = entries[0].contentRect;
            iframe.style.height = `${height}px`;
            iframe.style.aspectRatio = '';
          })
        : { observe: () => {}, unobserve: () => {} },
    [],
  );

  useEffect(() => {
    const iframe = iframeRef.current;

    if (!iframe?.contentDocument) {
      return;
    }

    const ready = () => {
      if (iframe?.contentDocument?.readyState !== 'complete') {
        return;
      }

      resizeObserver.observe(iframe.contentDocument.documentElement);
      iframe.contentDocument.removeEventListener('readystatechange', ready);

      const contents = iframe.contentDocument.body;

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
    };

    if (iframe.contentDocument.readyState === 'complete') {
      ready();
    } else {
      iframe.contentDocument.addEventListener('readystatechange', ready);
    }

    return () => {
      if (!iframe?.contentDocument) {
        return;
      }

      try {
        iframe.contentDocument.removeEventListener('readystatechange', ready);
        resizeObserver.unobserve(iframe?.contentDocument?.documentElement);
      } catch {}
    };
  }, [data, resizeObserver]);

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
            width: '100%',
            aspectRatio: '16 / 9',
            border: '0',
            verticalAlign: 'top',
          }}
          srcDoc={`<!DOCTYPE html><html lang=${process.env.NEXT_PUBLIC_LOCALE}><style>html{font-size:125%;color:#000}html.dark{color:#fff}body{margin:0;padding:0;display:flex;flex-direction:column;align-items:center}iframe,img{max-width:100%}</style><body>${data.html}</body></html>`}
        />
      )}
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

const componentBlocks: DocumentRendererProps['componentBlocks'] = {
  embed: Embed,
};

type RendererProps = {
  document: DocumentRendererProps['document'];
};

export default function Renderer({ document }: RendererProps) {
  return (
    <DocumentRenderer document={document} componentBlocks={componentBlocks} />
  );
}
