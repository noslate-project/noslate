import { Block } from './Block'
import React from 'react'
import { VAR } from '../var'
import { styled } from '../styled'

const ComponentContainer = styled('div', {
  display: 'flex',
  flexDirection: 'row',
})

const IconContainer = styled('div', {
  width: 64,
  height: 64,
  borderRadius: 8,
  backgroundColor: VAR.componentBackground,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
})

const Icon = styled('i', {
  fontSize: 32,
  color: VAR.title,
})

const TextContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  marginLeft: 16,
  justifyContent: 'space-between',
})

const Title = styled('a', {
  fontFamily: 'JetBrainsMono-Regular',
  fontSize: 22,
  textDecoration: 'underline',
  color: VAR.title,
  '&:hover': {
    color: VAR.title,
  },
  lineHeight: 1,
  cursor: 'pointer',
})

const Description = styled('span', {
  fontFamily: 'Inter-Medium',
  fontSize: 18,
  color: VAR.text,
})

type ComponentProps = {
  icon: string
  title: string
  link: string
  description: string
}

function Component(props: ComponentProps) {
  return (
    <ComponentContainer>
      <IconContainer>
        <Icon className={`${props.icon} iconfont`} />
      </IconContainer>
      <TextContainer>
        <Title href={props.link}>{props.title}</Title>
        <Description>{props.description}</Description>
      </TextContainer>
    </ComponentContainer>
  )
}

const components = [
  {
    title: 'Aworker',
    link: '/docs/extensions/orm',
    description: 'A features you need',
    icon: 'icon-database_plus_fill',
  },
  {
    title: 'Alice',
    link: '/docs/extensions/redis',
    description: 'A features you need',
    icon: 'icon-redis',
  },
  {
    title: 'Turf',
    link: '/docs/extensions/swagger',
    description: 'A features you need',
    icon: 'icon-swagger',
  },
  {
    title: 'Anode',
    link: '/docs/extensions/mongodb',
    description: 'A features you need',
    icon: 'icon-MongoDB',
  },
  {
    title: 'Arthur',
    link: '/docs/extensions/cache',
    description: 'A features you need',
    icon: 'icon-memcacheyunshujukuMemcac',
  },
  {
    title: 'Debugger',
    link: '/docs/extensions/oss',
    description: 'A features you need',
    icon: 'icon-ossduixiangcunchuOSS',
  },
] as ComponentProps[]

const Grid = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  columnGap: 200,
  rowGap: 64,
  '@mobile': {
    gridTemplateColumns: '1fr',
    rowGap: 32,
    paddingLeft: 16
  },
})

export function EssentialsComponents() {
  return (
    <Block title="Essentials Components" subtitle="All the features you need for development" background="light">
      <Grid>
        {components.map((component, index) => (
          <Component key={index} {...component} />
        ))}
      </Grid>
    </Block>
  )
}
