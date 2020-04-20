const rollup = require("rollup");
const { walk } = require("estree-walker");
const fse = require("fs-extra");
const { attachScopes } = require("rollup-pluginutils");

const path = require("path");
const t = require("@babel/types");
const util = require("util");
function isStaticRequireStatement(node) {
  if (!isRequireStatement(node)) return;
  if (hasDynamicArguments(node)) return;
  // todo 暂时不处理no-require的逻辑
  // if (ignoreRequire(node.arguments[0].value)) return;
  return true;
}

fse.ensureDir("dist");
async function main() {
  const bundle = await rollup.rollup({
    input: ["./src/entry1.js", "./src/entry2.js", "./src/entry3.js"],
    plugins: [
      {
        name: "remap",
        transform(code, id) {
          const ast = this.parse(code, id);
          const scope = attachScopes(ast, "scope");
          function isStaticRequireStatement(node) {
            if (!isRequireStatement(node)) return;
            if (hasDynamicArguments(node)) return;
            // todo 暂时不处理no-require的逻辑
            // if (ignoreRequire(node.arguments[0].value)) return;
            return true;
          }
          function isRequireStatement(node) {
            if (!node) return;
            if (node.type !== "CallExpression") return;

            if (node.callee.name !== "require" || scope.contains("require"))
              return;
            if (node.arguments.length === 0) return; // Weird case of require() without arguments
            return true;
          }
          walk(ast, {
            enter(node) {
              if (isRequireStatement(node)) {
              }
            }
          });
          return { code };
        }
      }
    ]
  });
  const { output } = await bundle.generate({
    format: "amd",
    paths: x => {
      return `http://www.baidu.com/${x}`;
    },
    plugins: [
      {
        renderChunk(code, chunk, options) {
          // console.log("code:", code);
          // console.log("chunk:", chunk);
          // console.log("options:", options);
          for (const x of chunk.imports) {
            console.log("path:", path.join(chunk.facadeModuleId, x));
            code = code.replace(`./${x}`, path.join(chunk.facadeModuleId, x));
          }
          return { code };
          // const ast = this.parse(code);
          // const scope = attachScopes(ast, "scope");
          // function isStaticRequireStatement(node) {
          //   if (!isRequireStatement(node)) return;
          //   if (hasDynamicArguments(node)) return;
          //   // todo 暂时不处理no-require的逻辑
          //   // if (ignoreRequire(node.arguments[0].value)) return;
          //   return true;
          // }
          // function isRequireStatement(node) {
          //   if (!node) return;
          //   if (node.type !== "CallExpression") return;

          //   if (node.callee.name !== "require" || scope.contains("require"))
          //     return;
          //   if (node.arguments.length === 0) return; // Weird case of require() without arguments
          //   return true;
          // }
          // walk(ast, {
          //   enter(node) {
          //     if (isRequireStatement(node)) {
          //       const arg = node.arguments[0];
          //       // console.log("value:", arg);
          //       arg.value = "fuck" + Math.random();
          //       arg.raw = "fuck" + Math.random();
          //     }
          //   }
          // });

          // // console.log("ast:", ast);
          // return { code };
        }
      }
    ]
  });

  for (const entry of output) {
    // console.log("entry:", entry.name);
    // console.log(`${entry.fileName}`, entry.code);
    fse.writeFileSync(path.join("dist", entry.fileName), entry.code);
  }
}
main();
