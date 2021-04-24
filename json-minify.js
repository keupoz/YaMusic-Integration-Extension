// tslint:disable: variable-name
const PluginError = require("plugin-error"),
    { obj } = require("through2"),
    { isVinyl } = require("vinyl");
// tslint:enable: variable-name

const PLUGIN_NAME = "gulp-json";

/**
 * @callback ModifyJson
 * @param {any} json
 * @returns {void}
 */

/**
 * @param {ModifyJson} [transform]
 */
function json(transform) {
    return obj(function (file, encoding, callback) {
        if (!isVinyl(file)) return callback(new PluginError(PLUGIN_NAME, "File is not vinyl"));

        if (file.isStream()) {
            return callback(new PluginError(PLUGIN_NAME, "Streaming is not supported"));
        }

        if (file.isBuffer()) {
            try {
                const json = JSON.parse(file.contents.toString(encoding));

                if (transform) transform(json);

                file.contents = Buffer.from(JSON.stringify(json), encoding);
            } catch (err) {
                return callback(new PluginError(PLUGIN_NAME, err));
            }
        }

        return callback(null, file);
    });
}

module.exports = { json };
