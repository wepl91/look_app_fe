//const rewireMobX = require('react-app-rewire-mobx');
const { override, addDecoratorsLegacy, disableEsLint, addBundleVisualizer, addWebpackAlias } = require("customize-cra");
const path = require("path");


// module.exports = function override(config, env) {

//   config.resolve.alias['mobx'] = path.resolve(__dirname, 'node_modules/mobx');
//   config.resolve.alias['mobx-react'] = path.resolve(__dirname, 'node_modules/mobx-react');
//   config.resolve.alias['moment'] = path.resolve(__dirname, 'node_modules/moment');

//   // config = rewireMobX(config, env);



//   return config;
// }

// const configRewire = (config, env) => {
//   // config.resolve.alias['mobx'] = path.resolve(__dirname, 'node_modules/mobx');
//   // config.resolve.alias['mobx-react'] = path.resolve(__dirname, 'node_modules/mobx-react');
//   config.resolve.alias['moment'] = path.resolve(__dirname, 'node_modules/moment');

//   //config = rewireMobX(config, env);

//   return config;
// };


module.exports = override(
  addDecoratorsLegacy(),
  disableEsLint(),
  //configRewire(),
  // process.env.BUNDLE_VISUALIZE == 1 && addBundleVisualizer(),
  // addWebpackAlias({ ["ag-grid-react$"]: path.resolve(__dirname, "src/shared/agGridWrapper.js")) }
  addWebpackAlias({
    ["moment"]: path.resolve(__dirname, "node_modules/moment"),
    ["mobx"]: path.resolve(__dirname, "node_modules/mobx"),
    ["mobx-react"]: path.resolve(__dirname, "node_modules/mobx-react")
  })
);
