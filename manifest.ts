import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json";

export default defineManifest({
  manifest_version: 3,

  name: pkg.description,
  short_name: pkg.name.replaceAll("-", "_"),
  version: pkg.version,
  author: pkg.author,
  default_locale: "ru",
  description: "__MSG_extDesc__",
  minimum_chrome_version: "88",

  icons: {
    16: "assets/icons/16.png",
    32: "assets/icons/32.png",
    48: "assets/icons/48.png",
    128: "assets/icons/128.png",
  },

  action: {
    default_title: "__MSG_browserActionTitle__",
  },

  background: {
    service_worker: "src/background.ts",
    type: "module",
  },

  content_scripts: [
    {
      js: ["src/injector.ts"],
      matches: ["https://music.yandex.ru/*"],
    },
  ],

  permissions: ["tabs"],
});
