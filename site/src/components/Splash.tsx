import React from 'react';
import { useWindupString, CharWrapper } from 'windups';
import { styled } from '../styled';
import { keyframes } from '@stitches/react';
import { VAR } from '../var';

const Container = styled('div', {
  paddingTop: 100,
  paddingBottom: 155,
  paddingLeft: 125,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '55%',
  backgroundSize: '1440px',
  backgroundImage: 'url(https://img.alicdn.com/imgextra/i1/O1CN01aRqS4L1g2WJPfRcOL_!!6000000004084-2-tps-2880-1414.png)',
  '@mobile': {
    alignItems: 'center',
    paddingLeft: 0,
    paddingTop: 50,
    paddingBottom: 88,
    backgroundImage: 'none',
  },
  ':root[data-theme="dark"] &': {
    backgroundPosition: 'right',
    backgroundImage:
      'url(https://img.alicdn.com/imgextra/i3/O1CN01hVwXX328xauSWPbci_!!6000000007999-2-tps-2880-1414.png)',
  },
});

const Title = styled('span', {
  fontFamily: 'DINAlternate-Bold',
  fontSize: 50,
  color: VAR.title,
});

const SubTitle = styled('span', {
  fontFamily: 'DINAlternate-Bold',
  fontSize: 50,
  color: VAR.title,
  '@mobile': {
    fontSize: 20,
  },
});

const opacityKeyframe = keyframes({
  from: {
    opacity: 0.3,
  },
  to: {
    opacity: 1,
  },
});

const TryTryLink = styled('a', {
  color: 'rgb(58, 72, 85)',
  '&:hover': {
    textDecoration: 'none'
  },
});

const Description = styled('span', {
  paddingBottom: 2,
  borderBottom: `4px solid ${VAR.text}`,
  '@mobile': {
    borderBottomWidth: 2,
  },
  animation: `${opacityKeyframe} 0.3s ease`,
  animationIterationCount: 1,
  transition: '0.3s all',
});

const ButtonGroup = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  marginTop: 88,
  '@mobile': {
    flexDirection: 'column',
  },
});

const Button = styled('a', {
  width: 252,
  height: 58,
  borderRadius: 4,
  fontFamily: 'DINAlternate-Bold',
  fontSize: '2rem',
  color: '#ffffff',
  display: 'flex',
  flexDirect: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  variants: {
    type: {
      main: {
        backgroundColor: '#926dde',
        marginRight: 36,
        '@mobile': {
          marginRight: 0,
          marginBottom: 24,
        },
      },
      secondary: {
        backgroundColor: 'rgb(58, 72, 85)',
      },
    },
  },
  '@mobile': {
    fontSize: 20,
    height: 50,
  },
  '&:hover': {
    color: '#ffffff',
    textDecoration: 'none',
  },
});

const Icon = styled('i', {
  fontSize: '2rem',
  marginRight: 8,
  display: 'flex',
});

const StarContainer = styled('div', {
  marginTop: 36,
});

const Lead = styled('span', {
  fontSize: '1.25rem',
  marginTop: '2rem',
  width: '45%',
});

const targets = [
  'Serverless',
  'Cloud Native',
  'Delivery',
  'Web',
  'Reliable',
  'Density'
];

export function Splash() {
  const [index, setIndex] = React.useState(0);

  const [text] = useWindupString(targets[index], {
    onFinished() {
      const nextIndex = index === targets.length - 1 ? 0 : index + 1;
      setTimeout(() => {
        // 和翻译插件冲突了
        if(!document.getElementById(':2.container')) {
          setIndex(nextIndex);
        }
      }, 3000);
    },
    pace: () => 100,
  });


  return (
    <Container>
      {/* <Title>Noslate Project</Title> */}
      <SubTitle>
        Built For "
        {text.split('').map((char, index) => (
          <Description key={char + index}>{char}</Description>
        ))}
        "
      </SubTitle>
      <Lead><strong>Noslate</strong> 是一款优雅、现代且完全可自定义的 JavaScript 轻量运行时</Lead>
      {/* <Lead><strong>Noslate</strong>  is an elegant, modern and fully customizable serverless runtime.</Lead> */}
      <ButtonGroup>
        <Button type="main" href="/docs/project/intro">
          快速开始
        </Button>
        <Button type="secondary" href="https://github.com/noslate-project/noslate" target="_blank">
          <Icon className="iconfont icon-github-fill" />
          Github
        </Button>
      </ButtonGroup>
      <div style={{marginTop: 20}} >
          <TryTryLink href="http://noslate-labs.midwayjs.org/" target="_blank" ><i className="iconfont icon-huojiancopy" style={{fontSize: 20}} ></i> 在线体验 Noslate Workers</TryTryLink>
      </div>
    </Container>
  );
}
