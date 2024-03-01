import fs from 'fs';
import { PreferTypes } from './PreferTypes';

/**
 * Attempts to fetch an environment variable by looking at the _FILE param
 * 
 * @param string name
 * @param string encoding
 */
const envFromFile = (name: string, encoding: string = 'utf8') => {
    const e = process.env;
    const envFile = e[`${name}_FILE`];
    if (
        envFile
        && envFile.trim() !== ''
        && fs.existsSync(envFile)
        && fs.statSync(envFile).isFile()
    ) {
        return fs.readFileSync(envFile, { encoding });
    }
    return null;
}

/**
 * Attempts to read an environment variable as is
 * 
 * @param string name
 */
const envFromEnv = (name: string) => {
    const e = process.env;
    const val = e[name];
    if (val && val.trim() !== '') return val;
    return null;
}

/**
 * Attempts to read an env file from either _FILE or as is
 * 
 * @param string env_name
 * @param mixed def
 * @param string encoding
 */
const envFile = (name: string, def: string | null = null, encoding: string = 'utf8') => {
    let fromFile: ReturnType<typeof envFromFile> = null;
    let fromEnv: ReturnType<typeof envFromEnv> = null;
    const doFromFile = () => (fromFile = envFromFile(name, encoding));
    const doFromEnv = () => (fromEnv = envFromEnv(name));
    if (envFile.PreferType === PreferTypes.FILE) {
        if (doFromFile() !== null) return fromFile;
        if (doFromEnv() !== null) return fromEnv;
        return def;
    }
    if (doFromEnv() !== null) return fromEnv;
    if (doFromFile() !== null) return fromFile;
    return def;
}

envFile.PreferTypes = PreferTypes;
envFile.PreferType = PreferTypes.FILE;
envFile.setPreferType = (pt: PreferTypes) => envFile.PreferType = pt;

export = envFile;