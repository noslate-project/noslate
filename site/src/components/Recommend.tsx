import { Block } from './Block';
import React from 'react';
import { styled } from '../styled';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
});

const ExtensionHref = styled('a', {
  display: 'flex',
  borderRadius: 8,
});

const Extension = styled('img', {
  height: 200,
  borderRadius: 8,
});

const RecommendList = [
  {
    image: '//img.alicdn.com/imgextra/i1/O1CN014Dv62Y1Er4n5ypBns_!!6000000000404-2-tps-600-200.png',
    link: '//midwayjs.org/',
    title: '和 Midway.js 高效集成',
  },
];

export function Recommend() {
  return (
    <Block title="Recommend" subtitle="Great extensions from the open source community" background="light">
      <Container>
        {RecommendList.map((item) => {
          return (
            <ExtensionHref key={item.link} href={item.link} target="_blank">
              <Extension alt={item.title} src={item.image} />
            </ExtensionHref>
          );
        })}
      </Container>
    </Block>
  );
}
