const path = require("path");
const istanbulReport = require("istanbul-lib-report");
const istanbulReports = require("istanbul-reports");
const istanbulCoverage = require("istanbul-lib-coverage");

const map = istanbulCoverage.createCoverageMap();

const cov_final_json_paths = process.argv.slice(2);
if (cov_final_json_paths.length === 0) {
  console.log("no coverage");
  process.exit(0);
}

for (const p of cov_final_json_paths) {
  const coverage = require(path.join(__dirname, "..", p));
  for (const filename of Object.keys(coverage)) {
    map.addFileCoverage(coverage[filename]);
  }
}

const context = istanbulReport.createContext();

const tree = istanbulReport.summarizers.pkg(map);
for (name of ["text", "lcov", "json"]) {
  tree.visit(istanbulReports.create(name, {}), context);
}
