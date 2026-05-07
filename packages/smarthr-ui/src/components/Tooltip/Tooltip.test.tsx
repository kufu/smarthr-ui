import { render, screen } from '@testing-library/react'

import { Button } from '../Button'
import { FaPencilIcon } from '../Icon'

import { Tooltip } from './Tooltip'

describe('Tooltip', () => {
  describe('type="description"（デフォルト）', () => {
    it('wrapper span に aria-describedby が付与される', () => {
      render(
        <Tooltip message="説明テキスト">
          <Button>ボタン</Button>
        </Tooltip>,
      )
      const wrapper = screen.getByRole('button', { name: 'ボタン' }).closest('.smarthr-ui-Tooltip')!
      expect(wrapper).toHaveAttribute('aria-describedby')
      const describedbyId = wrapper.getAttribute('aria-describedby')!
      expect(document.getElementById(describedbyId)).toHaveTextContent('説明テキスト')
    })

    it('ariaDescribedbyTarget="inner" で message が children のaccessible descriptionになる', () => {
      render(
        <Tooltip message="説明テキスト" ariaDescribedbyTarget="inner">
          <Button>ボタン</Button>
        </Tooltip>,
      )
      expect(
        screen.getByRole('button', { name: 'ボタン', description: '説明テキスト' }),
      ).toBeInTheDocument()
    })

    it('children のアクセシブルネームが message にならない', () => {
      render(
        <Tooltip message="説明テキスト">
          <Button>ボタン</Button>
        </Tooltip>,
      )
      expect(screen.getByRole('button', { name: 'ボタン' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: '説明テキスト' })).not.toBeInTheDocument()
    })
  })

  describe('type="label"', () => {
    it('message が children のアクセシブルネームになる', () => {
      render(
        <Tooltip type="label" message="保存">
          <Button>
            <FaPencilIcon />
          </Button>
        </Tooltip>,
      )
      expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument()
    })

    it('children のaccessible descriptionにならない', () => {
      render(
        <Tooltip type="label" message="保存">
          <Button>
            <FaPencilIcon />
          </Button>
        </Tooltip>,
      )
      expect(screen.getByRole('button', { name: '保存' })).not.toHaveAttribute('aria-describedby')
    })

    it('ariaDescribedbyTarget を指定しても message が children のアクセシブルネームになる', () => {
      render(
        <Tooltip type="label" message="保存" ariaDescribedbyTarget="wrapper">
          <Button>
            <FaPencilIcon />
          </Button>
        </Tooltip>,
      )
      expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument()

      const wrapper = screen.getByRole('button', { name: '保存' }).closest('.smarthr-ui-Tooltip')!
      expect(wrapper).not.toHaveAttribute('aria-describedby')
      expect(wrapper).not.toHaveAttribute('aria-labelledby')
    })
  })
})
