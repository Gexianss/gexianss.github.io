/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard'],
  rules: {
    // CSS Modules：允許 :global / :local 與 composes
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global', 'local'] }],
    'property-no-unknown': [true, { ignoreProperties: ['composes'] }],
    'selector-class-pattern': null, // CSS Modules 的 .camelCase class 名

    // 保留現有 token 寫法，不強制改寫
    'color-function-notation': null, // 維持 rgba(...) 而非 rgb(... / ...)
    'color-function-alias-notation': null, // 維持 rgba 別名
    'alpha-value-notation': null, // 維持 0.62 而非 62%
    'color-hex-length': null, // 維持 #FFFFFF 而非 #FFF
    'media-feature-range-notation': null, // 維持 (max-width: 768px)

    // Prettier 已負責排版，這條交給它
    'declaration-block-single-line-max-declarations': null,
  },
};
