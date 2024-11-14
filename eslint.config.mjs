import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  rules: {
    'unused-imports/no-unused-imports': 'warn',
    'n/prefer-global/process': 'off',
    // 导航优先使用 next-intl 包裹的方法
    'no-restricted-imports': [
      'warn',
      {
        name: 'next/link',
        message: 'Please import from `@/lib/i18n/routing` instead.',
      },
      {
        name: 'next/navigation',
        importNames: ['redirect', 'permanentRedirect', 'useRouter', 'usePathname'],
        message: 'Please import from `@/lib/i18n/routing` instead.',
      },
    ],
  },
})