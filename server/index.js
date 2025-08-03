const express = require('express');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const cors = require('cors');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/run', async (req, res) => {
  const { code, input, language } = req.body;
  const id = Date.now();
  const inputFile = `input-${id}.txt`;
  const folder = './temp';
  const isWindows = os.platform() === 'win32';

  if (!fs.existsSync(folder)) fs.mkdirSync(folder);

  fs.writeFileSync(path.join(folder, inputFile), input || '');

  let filename, command;

  try {
    switch (language) {
      case 'cpp':{
        filename = `code-${id}.cpp`;
        const outputExe = path.join(folder, `a.exe`); 
        fs.writeFileSync(path.join(folder, filename), code);
        command = `g++ "${path.join(folder, filename)}" -o "${outputExe}" && "${outputExe}" < "${path.join(folder, inputFile)}"`;
        break;
      }



      case 'python': {
        filename = `code-${id}.py`;
        fs.writeFileSync(path.join(folder, filename), code);
        command = `python ${folder}/${filename} < ${folder}/${inputFile}`;
        break;
      }

      case 'java':{
        filename = `Main${id}.java`;
        fs.writeFileSync(path.join(folder, filename), code);
        command = `javac "${path.join(folder, filename)}" && java -cp "${folder}" Main${id} < "${path.join(folder, inputFile)}"`;
        break;
      }


      case 'javascript':
      default: {
        filename = `code-${id}.js`;
        fs.writeFileSync(path.join(folder, filename), code);
        command = `node ${folder}/${filename} < ${folder}/${inputFile}`;
        break;
      }
    }

    exec(command, { timeout: 10000 }, (err, stdout, stderr) => {
      fs.rmSync(folder, { recursive: true, force: true });

      if (err) {
        return res.json({ output: stderr || err.message });
      }

      res.json({ output: stdout });
    });

  } catch (error) {
    fs.rmSync(folder, { recursive: true, force: true });
    return res.status(500).json({ output: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

