const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

// ✅ Java (dynamic class name support)
exports.runJava = (req, res) => {
  const { code } = req.body;

  const classNameMatch = code.match(/public\s+class\s+(\w+)/);
  const className = classNameMatch ? classNameMatch[1] : "Main";

  const filePath = path.join(process.cwd(), `${className}.java`);
  fs.writeFileSync(filePath, code);

  exec(`javac ${filePath} && java -cp ${process.cwd()} ${className}`, (error, stdout, stderr) => {
    if (error || stderr) return res.json({ success: false, output: error?.message || stderr });
    res.json({ success: true, output: stdout });
  });
};

// ✅ C++
exports.runCpp = (req, res) => {
  const { code } = req.body;
  const filePath = path.join(process.cwd(), "main.cpp");
  const outPath = path.join(process.cwd(), "a.out");
  fs.writeFileSync(filePath, code);

  exec(`g++ ${filePath} -o ${outPath} && ${outPath}`, (error, stdout, stderr) => {
    if (error || stderr) return res.json({ success: false, output: error?.message || stderr });
    res.json({ success: true, output: stdout });
  });
};

// ✅ JavaScript (Node.js)
exports.runJs = (req, res) => {
  const { code } = req.body;
  const filePath = path.join(process.cwd(), "script.js");
  fs.writeFileSync(filePath, code);

  exec(`node ${filePath}`, (error, stdout, stderr) => {
    if (error || stderr) return res.json({ success: false, output: error?.message || stderr });
    res.json({ success: true, output: stdout });
  });
};

// ✅ Python
exports.runPython = (req, res) => {
  const { code } = req.body;
  const filePath = path.join(process.cwd(), "script.py");
  fs.writeFileSync(filePath, code);

  exec(`python3 ${filePath}`, (error, stdout, stderr) => {
    if (error || stderr) return res.json({ success: false, output: error?.message || stderr });
    res.json({ success: true, output: stdout });
  });
};