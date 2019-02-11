module.exports = function(config) {
    config.set({
        mutator: 'javascript',
        packageManager: 'npm',
        reporters: ['clear-text', 'progress'],
        testRunner: 'jest',
        transpilers: [],
        coverageAnalysis: 'off',
        files: [
            'app/**/*.js',
            'app/**/*.json',
            '!app/**/*.spike.test.js',
            '!app/index.js',
        ],
        mutate: [
            'app/**/*.js',
            '!app/**/*.test.js',
        ],
    })
}