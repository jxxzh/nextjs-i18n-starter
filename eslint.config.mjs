import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  rules: {
    'unused-imports/no-unused-imports': 'warn',
  },
})
