const createReporter = require("istanbul-api").createReporter;
const istanbulCoverage = require("istanbul-lib-coverage");

const map = istanbulCoverage.createCoverageMap();
const reporter = createReporter();

const cov_final_json_paths = process.argv.slice(2);
if (cov_final_json_paths.length === 0) {
  console.log("no coverage");
  process.exit(0);
}

for (const p of cov_final_json_paths) {
  const coverage = require(p);
  for (const filename of Object.keys(coverage)) {
    map.addFileCoverage(coverage[filename]);
  }
}

reporter.addAll(["text", "lcov", "json"]);
reporter.write(map);
