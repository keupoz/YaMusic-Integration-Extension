import del from "del";
import { dest, lastRun, parallel, series, src, task, watch } from "gulp";
import gulpIf from "gulp-if";
import terser from "gulp-terser";
import { createProject } from "gulp-typescript";
import zip from "gulp-zip";
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

task("icons", () => {
    return src("src/icons/**/*", { since: lastRun("icons") })
        .pipe(dest("dist/icons"));
});

const tsProject = createProject("tsconfig.json");

task("typescript", () => {
    return src("src/*.ts", { since: lastRun("typescript") })
        .pipe(tsProject())
        .pipe(gulpIf(isProduction, terser()))
        .pipe(dest("dist"));
});

task("zip", () => {
    return src("dist/**")
        .pipe(zip("YaMusic.zip"))
        .pipe(dest("."));
});

task("watch", () => {
    watch("src/manifest.json", task("manifest"));
    watch("src/_locales/**/*.json", task("locales"));
    watch("src/icons/**/*", task("icons"));
    watch("src/**/*.ts", task("typescript"));
});

task("build:pre", (done) => {
    process.env.NODE_ENV = "production";
    isProduction = true;

    done();
});

task("dev:pre", (done) => {
    process.env.NODE_ENV = "development";
    isProduction = false;

    done();
});

const common = parallel("manifest", "locales", "icons", "typescript");

export const build = series("build:pre", "clean", common, "zip");
export const dev = series("dev:pre", "clean", common, "watch");
