<!--
- Copyright 2020 License Stamper Contributors (https://github.com/anshumandas/license-stamper)
- Copyright 2020
-
- Licensed under the MIT, Version 1 (the "License");
- A copy of the license is present in the root directory of the project in file LICENSE
- You may not use this file except in compliance with the License.
- You may obtain a copy of the License at
-
-     https://opensource.org/licenses/MIT
-
- Unless required by applicable law or agreed to in writing, software
- distributed under the License is distributed on an "AS IS" BASIS,
- WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
- See the License for the specific language governing permissions and
- limitations under the License.
-->
# license-stamper
stamps a license text from a file (see sample/template.mustache) at the top of each file in the input directory using appropriate comments section (as defined in comment_block.yaml) and writes the file to the specified output directory (or input directory if output directory not specified)

It also ensures that it does not add the same license text again if already existing.

## Usage
```
npm start
```
Or
```
npm i license-stamper --save-dev
require('license-stamper').run(inputDir, outputDir, templatePath, configYamlPath)
```

## Contributions
Any type of contribution towards enhancing this is welcomed
