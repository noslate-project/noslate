import React from 'react'
import { VAR } from '../var'
import { styled } from '../styled'

const Container = styled('div', {
  backgroundColor: 'var(--ifm-color-background-secondary)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: 40,
  paddingBottom: 64,
})

const Title = styled('div', {
  fontFamily: "Poly-Italic",
	fontSize: 36,
	color: VAR.title
})

const Tip = styled('span', {
  fontFamily: "Inter-Medium",
	fontSize: 14,
	color: VAR.text,
  display: 'inline-block',
  marginTop: 24
})

export function Footer () {
  return (
    <Container>
      <Tip>
        Noslate Project 2022 - NOW &nbsp;&nbsp;&nbsp;&nbsp;  MIT License
      </Tip>
    </Container>
  )
}
