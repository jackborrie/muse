// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
    {
        files: ["**/*.ts"],
        extends: [
            eslint.configs.recommended,
            ...tseslint.configs.recommended,
            ...tseslint.configs.stylistic,
            ...angular.configs.tsRecommended,
        ],
        processor: angular.processInlineTemplates,
        rules: {
            "@angular-eslint/directive-selector": [
                "off"
            ],
            "@angular-eslint/component-selector": [
                "off"
            ]
        },
    },
    {
        files: ["**/*.html"],
        extends: [
            ...angular.configs.templateRecommended,
            ...angular.configs.templateAccessibility,
        ],
        rules: {
            "@angular-eslint/template/elements-content": [
                "error",
                {
                    "allowList": [
                        "text",
                        "icon"
                    ]
                }
            ],
            "@angular-eslint/template/interactive-supports-focus": [
                "off"
            ],
            "@angular-eslint/template/click-events-have-key-events": [
                "off"
            ]
        },
    }
);
