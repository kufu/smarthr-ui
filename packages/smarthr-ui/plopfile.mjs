// src/components 配下のコンポーネントを取得得する
import fs from 'fs'

const components = fs
  .readdirSync('src/components')
  .map((name) => ({ name, value: name }))
  .sort()

export default (
  /** @type {import('plop').NodePlopAPI} */
  plop,
) => {
  plop.setGenerator('story', {
    description: 'Story の雛形を作ります。',
    prompts: [
      {
        type: 'list',
        name: 'name',
        message: '作成対象コンポーネントを選択してください。',
        choices: components,
        loop: false,
      },
    ],
    actions: [
      {
        type: 'addMany',
        destination: 'src/components/{{name}}/stories',
        base: 'scaffold/templates/stories',
        templateFiles: 'scaffold/templates/stories/*.hbs',
      },
    ],
  })
}
