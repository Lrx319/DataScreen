export default {
  extends: ['stylelint-config-standard', 'stylelint-config-standard-vue'],
  rules: {
    'selector-class-pattern': null,
    'no-descending-specificity': null,
    'custom-property-pattern': null,
    'keyframes-name-pattern': null,
    'declaration-no-important': null,
    'color-function-notation': null,
    'alpha-value-notation': null,
    'property-no-vendor-prefix': null,
    'value-no-vendor-prefix': null,
    'rule-empty-line-before': null,
    'declaration-block-no-redundant-longhand-properties': null,
    'shorthand-property-no-redundant-values': null,
  },
  ignoreFiles: ['dist/**', 'node_modules/**', 'public/**'],
}
