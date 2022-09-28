import React from 'react'
import { styled } from '../styled'

type FeatureProps = {
  icon: string
  title: string
  description: string
  isMiddle?: boolean
}

const Container = styled('div', {
  backgroundColor: 'var(--ifm-color-background-secondary)',
  padding: '72px 0',
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  '@mobile': {
    flexDirection: 'column',
    padding: '20px 0 36px 0',
  }
})

const FeatureContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  variants: {
    isMiddle: {
      true: {
        marginLeft: 120,
        marginRight: 120,
        '@mobile': {
          marginLeft: 24,
          marginRight: 24,
        }
      }
    }
  },
  '@mobile': {
    marginRight: 0
  },
})

const Icon = styled('i', {
  color: 'var(--ifm-color-icon)',
  fontSize: 64,
  '@mobile': {
    fontSize: 52,
  }
})

const Title = styled('span', {
  fontFamily: 'DINAlternate-Bold',
  fontSize: 28,
  color: 'var(--ifm-color-background-title)',
  marginTop: 36,
  marginBottom: 24,
  '@mobile': {
    marginTop: 18,
    marginBottom: 12,
    fontSize: 24
  }
})

const Description = styled('span', {
  fontFamily: 'PingFangSC-Regular',
  fontSize: 24,
  color: 'var(--ifm-color-text)',
  width: 315,
  '@mobile': {
    fontSize: 20
  }
})

function Feature(props: FeatureProps) {
  return (
    <FeatureContainer isMiddle={props.isMiddle}>
      <Icon className={`iconfont ${props.icon}`} />
      <Title>{props.title}</Title>
      <Description>{props.description}</Description>
    </FeatureContainer>
  )
}

const featurs = [
  {
    icon: 'icon-huojiancopy',
    title: 'Noslate Workers',
    description: `WinterCG 规范的 Web 标准轻量运行时`,
  },
  {
    icon: 'icon-nintendogamecube',
    title: 'Noslate Debugger',
    description: '面向崩溃和异常场景 Corefile 离线诊断',
    isMiddle: true
  },
  {
    icon: 'icon-MPIS-Upgrade',
    title: 'Node.js Distribution',
    description: '极致优化 Serverless 弹性，启动较社区快 ~120%',
  },
] as FeatureProps[]

export function CoreFeatures() {
  return (
    <Container>
      {featurs.map((feature) => <Feature  key={feature.title} {...feature} />)}
    </Container>
  )
}
