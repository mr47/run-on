#!/usr/bin/env node
var program = require('commander');
var platformIs = require('platform-is');

program
  .option('-e, --encoding [type]', 'Specify the encoding of dotenv file')
  .option('-p, --path [type]', 'Specify a custom path of dotenv file')
  .option('-r, --raw', 'Should run a raw command ?')
  .option('-o, --on <items>', 'Specify a platform to run on', function (val) {
    return val.split(',');
  })
  .option('-s, --silent', 'silent')
  .parse(process.argv);
var scriptName = program.args[0];

if (!program.silent) {
  console.log('running better-npm-run in', process.cwd());
}
if (program.on && program.on.length === 1){
  var platform = program.on[0];
  if (platform === 'mac' && !platformIs.isMac()) process.exit();
  if (platform === 'linux' && !platformIs.isLinux()) process.exit();
  if (platform === 'windows' && !platformIs.isWindows()) process.exit();
} else if (program.on && program.on.length > 1){
  var exit = false;
  for (var i = 0; i < program.on.length; i ++){
    var v = program.on[i];
    if (v === 'mac') exit = !platformIs.isMac();
    if (v === 'linux') exit = !platformIs.isLinux();
    if (v === 'windows') exit = !platformIs.isWindows();
    if (!exit) break;
  }
  if (exit) process.exit();
} else if (program.on && program.on.length === 0) {
  if (program.on) {
    process.stderr.write('ERROR: Please set run platform');
    process.exit(1);
  }
}

var join = require('path').join;
var fullPackagePath = join(process.cwd(), 'package.json');
var pkg = require(fullPackagePath);
var exec = require('./lib/exec.js');

if (!pkg.scripts) {
  process.stderr.write('ERROR: No scripts found!');
  process.exit(1);
}
if (!scriptName) {
  process.stderr.write('ERROR: No script name provided!');
  process.exit(1);
}
if ((pkg.betterScripts && !pkg.betterScripts[scriptName] || pkg.scripts && !pkg.scripts[scriptName]) && !program.raw) {
  process.stderr.write('ERROR: No script / betterScript with name "' + scriptName + '" was found!');
  process.exit(1);
}

if(!program.silent) {
  console.log('Executing script: ' + scriptName + '\n');
}

var run = '';
if (program.raw){
  run = program.args.join(' ');
} else {
  run = pkg.betterScripts[scriptName] || pkg.scripts[scriptName];
}
exec(run, program, function (error, stdout, stderr) {
  process.stderr.write(stderr);
  process.stdout.write(stdout);
  if(error !== null) {
    console.log('exec error: '+error);
  }
});
