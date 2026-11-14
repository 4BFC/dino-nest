export default {
  extends: ['stylelint-config-standard'],
  rules: {
    'selector-class-pattern': '^[a-z][a-z0-9]*(?:[-_]+[a-z0-9]+)*$',
    'selector-pseudo-class-no-unknown': [true, {ignorePseudoClasses: ['global', 'local']}],
    'color-no-hex': true,
    'function-disallowed-list': ['rgb', 'rgba', 'hsl', 'hsla'],
    'declaration-no-important': true,
  },
  overrides: [
    {
      files: ['**/*.scss'],
      extends: ['stylelint-config-standard-scss'],
      rules: {'max-nesting-depth': 3},
    },
    {
      // Site color tokens are defined here; other styles use the CSS variables.
      files: ['src/globals.scss'],
      rules: {'color-no-hex': null, 'function-disallowed-list': null},
    },
  ],
};
