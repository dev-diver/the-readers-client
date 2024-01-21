const fs = require("fs-extra");
const path = require("path");
const execSync = require("child_process").execSync;

const publicDir = path.join(__dirname, "../../server/public");
const buildDir = path.join(__dirname, "../build");

// public 폴더 내용 삭제
fs.emptyDirSync(publicDir);

// React 앱 빌드
execSync("react-scripts build", { stdio: "inherit" });

// 빌드된 파일 이동
fs.moveSync(buildDir, publicDir, { overwrite: true });
