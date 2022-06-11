import glsl from "vite-plugin-glsl";
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  plugins   : [glsl()],
  publicDir : "./assets",
  build     : {
    rollupOptions: {
      input: {
        game     : resolve(__dirname, "./game/game.js"),
        examples : resolve(__dirname, "./examples/main.js"),
      },
    },
  },
});
