import typescript from "@rollup/plugin-typescript";
import del from "del";
import glob from "glob";
import { dest, lastRun, parallel, series, src, task, watch } from "gulp";
import zip from "gulp-zip";
import { rollup, RollupCache } from "rollup";
import { terser } from "rollup-plugin-terser";
import { json } from "./json-minify";
import { version } from "./package.json";

let isProduction = process.env.NODE_ENV === "production";

task("clean", () => {
    return del("dist/*");
});

task("manifest", () => {
    return src("src/manifest.json")
        .pipe(json((json) => {
            json.version = version;
        }))
        .pipe(dest("dist"));
});

task("locales", () => {
    return src("src/_locales/**/*.json", { since: lastRun("locales") })
        .pipe(json())
        .pipe(dest("dist/_locales"));
});

task("assets", () => {
    return src("src/assets/**/*", { since: lastRun("assets") })
        .pipe(dest("dist/assets"));
});

let rollupCache: RollupCache;

task("typescript", async () => {
    const bundle = await rollup({
        input: glob.sync("src/*.ts"),
        cache: rollupCache,
        plugins: [
            typescript()
        ].concat(isProduction ? [terser()] : [])
    });

    if (bundle.cache) rollupCache = bundle.cache;

    await bundle.write({
        dir: "dist",
        format: "es",
        sourcemap: false
    });
});

task("zip", () => {
    return src("dist/**")
        .pipe(zip("YaMusic.zip"))
        .pipe(dest("."));
});

task("watch", async () => {
    watch("src/manifest.json", task("manifest"));
    watch("src/_locales/**/*.json", task("locales"));
    watch("src/assets/**/*", task("assets"));
    watch("src/**/*.ts", task("typescript"));

    console.log("Watching files ...");
});

task("build:pre", async () => {
    process.env.NODE_ENV = "production";
    isProduction = true;
});

task("dev:pre", async () => {
    process.env.NODE_ENV = "development";
    isProduction = false;
});

const common = parallel("manifest", "locales", "assets", "typescript");

export const build = series("build:pre", "clean", common, "zip");
export const dev = series("dev:pre", "clean", common, "watch");
