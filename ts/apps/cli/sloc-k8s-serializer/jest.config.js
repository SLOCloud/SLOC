module.exports = {
    preset: '../../../jest.preset.js',
    globals: {
        'ts-jest': {
            tsConfig: '<rootDir>/tsconfig.spec.json',
        },
    },
    transform: {
        '^.+\\.[tj]s$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'js', 'html'],
    coverageDirectory: '../../../coverage/apps/cli/sloc-k8s-serializer',
    displayName: 'cli-sloc-k8s-serializer',
};