import React from "react"

export type Step1Props = {
  next: () => void
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void}

export type Step2Props = {
  next: () => void
  prev: () => void
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void}

export type Step3Props = {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  submit: () => void}
  