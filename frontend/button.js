import React from 'react'
import styled from '@emotion/styled'

const BaseButton = styled.button`
  appearance: none;
  text-align: inherit;
  font: inherit;
  color: inherit;
  border: none;
  border-radius: 0;
  margin: none;
  padding: none;
  background-color: transparent;
  cursor: pointer;
`

export const TransparentButton = styled(BaseButton)`
  display: block;
  width: 100%;
`

const NormalButton = styled(BaseButton)`
  border-radius: 0.5rem;
  border: ${(props) => props.filled ? `2px solid ${props.backgroundColor}` : `2px solid ${props.color}`};
  color: ${(props) => props.color};
  background-color: ${(props) => props.backgroundColor};
  padding: 0.25rem 1rem;
  text-align: center;
  font-weight: 600;
  &:hover {
    background-color: ${(props) => props.hoverColor};
    border-color: ${props => props.filled ? props.hoverColor : props.color};
  }
`

const buttonStyles = {
  primary: { color: 'white', backgroundColor: '#66c', hoverColor: '#669', filled: true },
  secondary: { color: '#66c', backgroundColor: 'white', hoverColor: '#eee' },
  '': { color: '#222', backgroundColor: 'white', hoverColor: '#eee' },
}

const Button = ({ type = '', submit, ...props }) => {
  return (
    <NormalButton type={submit ? 'submit' : 'button'} {...buttonStyles[type]} {...props} />
  )
}

export default Button
