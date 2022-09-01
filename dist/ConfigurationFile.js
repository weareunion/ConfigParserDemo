"use strict";
/**
 * Written by Karl Schmidt
 */
/**
 * Throws when there is a duplicate index in the map
 * @extends Error
 */
class ConfigError extends Error {
    constructor(props) {
        super("Could not read configuration file. " + props);
    }
}
/**
 * Throws when there is a parsing error (general)
 * @extends ConfigError
 */
class ParseError extends ConfigError {
    constructor(lineIndex, line, error) {
        super(`Error on line ${lineIndex} : "${line}"${(error !== null && error !== void 0 ? error : "")}`);
        // Set prototype
        Object.setPrototypeOf(this, ParseError.prototype);
    }
}
/**
 * Throws when there is a duplicate index in the map
 * @extends ConfigError
 */
class DuplicateIndex extends ConfigError {
    constructor(line, indexName) {
        super(`Duplicate index (${indexName}) on line ${line}.`);
        // Set prototype
        Object.setPrototypeOf(this, DuplicateIndex.prototype);
    }
}
/**
 * ConfigurationFile Obj takes in a config file string,
 * and parses it, preserving datatype where needed.
 */
class ConfigurationFile {
    /**
     * Takes config file and optionally starts
     * the processing
     * @param configurationText The config info as string
     * @param autoProcess If the config file should be automatically
     * processed or not
     */
    constructor(configurationText, autoProcess = true) {
        /**
         * Mapping for boolean equivalents.
         * @precondition strings to compare are always lowercase and trimmed
         * @private
         */
        this._booleanEquivalents = {
            true: ["yes", "on", "true", "enabled", "enable"],
            false: ["no", "off", "false", "disabled", "disable"]
        };
        // Set the config text to the field
        this._configurationTextRaw = configurationText;
        // Instantiate Map
        this._map = new Map;
        // If requested, process the data in
        if (autoProcess)
            this.process();
    }
    /**
     * Retrieve data point from key after config process
     * @wraps Map.get(key)
     * @param key
     * @returns Boolean|String|Number|undefined Returns data point if exists,
     * undefined if not
     */
    get(key) {
        return this._map.get(key);
    }
    /**
     * Retrieve data point from key after config process
     * @wraps Map.entries()
     * @returns IterableIterator<string, Boolean|String|Number> Returns all active entries
     */
    getAllEntries() {
        return this._map.entries();
    }
    /**
     * Processes the file
     */
    process() {
        // Split lines by new line '\n'
        let line_split = ConfigurationFile.splitByLines(this._configurationTextRaw);
        // Iterate through every line and process each
        line_split.forEach((line, index) => {
            // Trim whitespace on the incoming line
            line = line.trim();
            // Return (continue) if the line is blank
            if (line === "")
                return;
            // Split the line at the '=' sign
            let splitLine = line.split('=');
            // Trim whitespace on the split lines
            splitLine[0] = splitLine[0].trim();
            if (splitLine.length === 2)
                splitLine[1] = splitLine[1].trim();
            // If there is no '=' sign, detect and validate a comment,
            // if there are more than 1 '=' sign, throw a ParseError (extends ConfigError)
            if (splitLine.length === 1) {
                // ...then check if the line is formatted as a comment, if so, return (continue), if not,
                // throw a ParseError (extends ConfigError).
                if (splitLine[0][0] !== "#") {
                    throw new ParseError(index, line);
                }
                else {
                    return;
                }
            }
            else if (splitLine.length !== 2) {
                // Throw error if there are multiple assignments
                throw new ParseError(index, line, " Cannot parse chained assignments.");
            }
            // Check to ensure that the index has not already been set. If it has,
            // throw a DuplicateIndex (extends ConfigError).
            if (this._map.has(splitLine[0])) {
                throw new DuplicateIndex(index, splitLine[0]);
            }
            // If all is successful, process the datatype and add an entry into the map
            this._map.set(splitLine[0], this.processDataType(splitLine[1]));
        });
    }
    /**
     * Map the map to a JS Object
     */
    toOBJ() {
        let Obj = {};
        // Iterate through map and add to object
        this._map.forEach((value, key) => {
            Obj[key] = value;
        });
        return Obj;
    }
    /**
     * Tries to detect the datatype and set it
     * @param data The data string to be processed
     * @private
     */
    processDataType(data) {
        // Trim data
        data = data.trim();
        // Check if lowercase data exists in the _booleanEquivalents
        // lists for true and false. Return true of false if one is in
        // one of the lists
        if (this._booleanEquivalents.true.includes(data.toLowerCase()))
            return true;
        if (this._booleanEquivalents.false.includes(data.toLowerCase()))
            return false;
        // Determine if the data is a number
        let asNumber = Number(data);
        // If so, return as a number, if not, return as a string
        return (isNaN(+asNumber) ? data : asNumber);
    }
    /**
     * Split the line by new line (\n)
     * @param input the input string
     * @private
     */
    static splitByLines(input) {
        return input.split(/\r?\n/);
    }
}
