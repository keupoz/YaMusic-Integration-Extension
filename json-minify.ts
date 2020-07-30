import PluginError from "plugin-error";
import { obj } from "through2";
import { isVinyl } from "vinyl";

const PLUGIN_NAME = "gulp-json";

export function json(transform?: (json: any) => void) {
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
