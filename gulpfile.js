const typescript = require("@rollup/plugin-typescript"),
    del = require("del"),
    { sync } = require("glob"),
    { dest, lastRun, parallel, series, src, task, watch } = require("gulp"),
    zip = require("gulp-zip"),
    { rollup } = require("rollup"),
    { terser } = require("rollup-plugin-terser");

const { json } = require("./json-minify"),
    { version } = require("./package.json");

let isProduction = process.env.NODE_ENV === "production";

task("clean", async () => {
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

/** @type {import("rollup").RollupCache} */
let rollupCache;

task("typescript", async () => {
    const bundle = await rollup({
        cache: rollupCache,
        input: sync("src/*.ts"),
        plugins: [
            // @ts-ignore
            typescript()
        ].concat(isProduction ? [terser()] : [])
    });

    if (bundle.cache !== undefined) rollupCache = bundle.cache;

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

task("common", parallel("manifest", "locales", "assets", "typescript"));
task("build", series("build:pre", "clean", "common", "zip"));
task("dev", series("dev:pre", "clean", "common", "watch"));
