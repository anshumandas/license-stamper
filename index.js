/*
* Copyright 2020 License Stamper Contributors (https://github.com/anshumandas/license-stamper)
* Copyright 2020
*
* Licensed under the MIT, Version 1 (the "License");
* A copy of the license is present in the root directory of the project in file LICENSE
* You may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     https://opensource.org/licenses/MIT
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
const Mustache = require('mustache');
const Fs = require('fs-extra');
const Yaml = require('js-yaml');
const Chalk = require('chalk');
const Path = require('path');
const _ = require('lodash');

const mkdirp = require('mkdirp').sync;

const Comment = readFile(__dirname + '/comment_block.yaml');

function addCommentSymbol(path, inputs) {
  let ext = Path.extname(path).substring(1);
  let block = Comment[ext];
  if(block) {
    let s = block['start']
    inputs['start'] = s;
    inputs['end'] = block['end'];
    inputs['line_start'] = block['end'] ? s.substring(s.length - 1) : s;
  } else {
    console.error("no info for extension " + ext + " @ " + path);
    return false;
  }
  return true;
}

let ignore = ['node_modules', 'generated'];

function processFolder(inputDir, outputDir, config, template) {
  Fs.readdirSync(inputDir)
   .forEach((file) => {
     let path = Path.join(inputDir, file);
     if(!file.startsWith('.') && !ignore.includes(file)) {
       if(Fs.statSync(path).isDirectory()) {
         processFolder(path, Path.join(outputDir, file), config, template);
       } else {
         let inputs = _.cloneDeep(config);
         if(addCommentSymbol(path, inputs)) {
           let ren = Mustache.render(template, inputs);
           appendFile(inputDir, outputDir, file, ren);
         }
       }
     }
   });
}

exports.run = function run(inputDir, outputDir, config, template) {
  if(!inputDir && process.argv.length < 2) throw Error("Need folder path");
  inputDir = inputDir || process.argv[1];
  outputDir = outputDir || process.argv[2] || inputDir;
  config = readFile(config || process.argv[3] || __dirname + '/sample/config.yaml');
  template = readFile(template || process.argv[4] || __dirname + '/sample/template.mustache');
  processFolder(inputDir, outputDir, config, template);
}

function readFile(file, silent) {
  try {
    if(file.endsWith('.yaml')) {
        return Yaml.safeLoad(Fs.readFileSync(file, 'utf-8'), { filename: file });
    } else {
      return Fs.readFileSync(file, {encoding:'utf8', flag:'r'});
    }
  } catch (e) {
    if (!silent) {
      console.log(Chalk.red(e.message));
    }
  }
}

function appendFile(inputDir, outputDir, file, license) {
  let source = Path.join(inputDir, file)
  let dest = Path.join(outputDir, file)
  if(inputDir != outputDir) {
    mkdirp(Path.dirname(dest));
  }
  let data = Fs.readFileSync(source, 'utf8'); //read existing contents into data

  if(data.replace( /[\r\n ]+/gm, "" ).indexOf(license.replace( /[\r\n ]+/gm, "" )) < 0) {
    Fs.writeFileSync(dest, license);
    Fs.appendFile(dest, data);
  } else if(inputDir != outputDir) {
    console.log(file);
    Fs.writeFileSync(dest, data);
  }
}
