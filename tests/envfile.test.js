const path = require('path');
const envFile = require('../lib/util');

test('should return null', () => {
    expect(envFile('FOO')).toBe(null);
});

test('should return set default value', () => {
    expect(envFile('FOO', 'BAR')).toBe('BAR')
});

test('should return WORLD', () => {
    process.env.HELLO = 'WORLD';
    expect(envFile('HELLO')).toBe('WORLD');
    delete process.env.HELLO;
});

test('should return WORLD from file', () => {
    process.env.HELLO_FILE = path.resolve(__dirname, 'env/hello');
    expect(envFile('HELLO')).toBe('WORLD');
    delete process.env.HELLO_FILE;
});

test('should override with file if provided', () => {
    process.env.HELLO = 'FOOBAR';
    process.env.HELLO_FILE = path.resolve(__dirname, 'env/hello');
    expect(envFile('HELLO')).toBe('WORLD');
    delete process.env.HELLO;
    delete process.env.HELLO_FILE;
});

test('should not override with file if provided', () => {
    envFile.setPreferType(envFile.PreferTypes.ENV);
    process.env.HELLO = 'FOOBAR';
    process.env.HELLO_FILE = path.resolve(__dirname, 'env/hello');
    expect(envFile('HELLO')).toBe('FOOBAR');
    delete process.env.HELLO;
    delete process.env.HELLO_FILE;
});

test('should still load file if no env as is', () => {
    envFile.setPreferType(envFile.PreferTypes.ENV);
    process.env.HELLO_FILE = path.resolve(__dirname, 'env/hello');
    expect(envFile('HELLO')).toBe('WORLD');
    delete process.env.HELLO_FILE;
});

test('should fall back to default', () => {
    envFile.setPreferType(envFile.PreferTypes.ENV);
    expect(envFile('HELLO', 'default')).toBe('default');
});