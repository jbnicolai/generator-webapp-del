'use strict';
var util = require('util');
var path = require('path');
var spawn = require('child_process').spawn;
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var WebappDelGenerator = module.exports = function WebappDelGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  // setup the test-framework property, Gruntfile template will need this
  this.testFramework = options['test-framework'] || 'mocha';
  this.coffee = options.coffee;

  // for hooks to resolve on mocha by default
  options['test-framework'] = this.testFramework;

  // resolved to mocha by default (could be switched to jasmine for instance)
  this.hookFor('test-framework', {
    as: 'app',
    options: {
      options: {
        'skip-install': options['skip-install-message'],
        'skip-message': options['skip-install']
      }
    }
  });

  this.options = options;

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(WebappDelGenerator, yeoman.generators.Base);

WebappDelGenerator.prototype.welcome = function welcome() {

  // welcome message
  if (!this.options['skip-welcome-message']) {
    console.log(this.yeoman);
    console.log(chalk.yellow('This is webapp-del. Thanks for giving it a try.'))
    console.log(chalk.magenta('To start with: HTML5 Boilerplate, jQuery, and a Gruntfile.js to build your app.'));
  }

};

WebappDelGenerator.prototype.askForRespond = function askForRespond() {
  var cb = this.async();

  var prompts = [{
    type: 'confirm',
    name: 'includeRespond',
    message: 'Include Respond.js for <=IE8 ?',
    default: false
  }];

  this.prompt(prompts, function (props) {
    this.includeRespond = props.includeRespond;

    cb();
  }.bind(this));
};

WebappDelGenerator.prototype.gruntfile = function gruntfile() {
    this.template('Gruntfile.js');
};

WebappDelGenerator.prototype.packageJSON = function packageJSON() {
    this.template('_package.json', 'package.json');
};

WebappDelGenerator.prototype.git = function git() {
    this.copy('gitignore', '.gitignore');
    this.copy('gitattributes', '.gitattributes');
};

WebappDelGenerator.prototype.bower = function bower() {
    this.copy('bowerrc', '.bowerrc');
    this.copy('_bower.json', 'bower.json');
};

WebappDelGenerator.prototype.jshint = function jshint() {
    this.copy('jshintrc', '.jshintrc');
};

WebappDelGenerator.prototype.editorConfig = function editorConfig() {
    this.copy('editorconfig', '.editorconfig');
};

WebappDelGenerator.prototype.h5bp = function h5bp() {
    this.copy('favicon.ico', 'app/favicon.ico');
    this.copy('404.html', 'app/404.html');
    this.copy('robots.txt', 'app/robots.txt');
    this.copy('htaccess', 'app/.htaccess');
};

WebappDelGenerator.prototype.mainStylesheet = function mainStylesheet() {
    // var css = 'main.' + (this.compassBootstrap ? 's' : '') + 'css';
    // this.copy('master.scss', 'app/styles/sass/master.scss');
    this.bulkDirectory('sass', 'app/styles/sass');
};

WebappDelGenerator.prototype.writeIndex = function writeIndex() {
    var sourceFileList = ['bower_components/jquery/jquery.js'],
        dflt = ['scripts/plugins.js', 'scripts/main.js'],
        rspnd = [];

    this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));
    this.indexFile = this.engine(this.indexFile, this);

    // Include Respond.js?
    if (this.includeRespond) {
        rspnd = ['bower_components/respond/dest/respond.matchmedia.addListener.min.js',
        'bower_components/respond/dest/respond.min.js'];
    }

    // concat scripts
    sourceFileList = sourceFileList.concat(rspnd, dflt);

    this.indexFile = this.appendFiles({
        html: this.indexFile,
        fileType: 'js',
        optimizedPath: 'scripts/main.js',
        sourceFileList: sourceFileList,
        searchPath: '{app,.tmp}'
    });

};

WebappDelGenerator.prototype.app = function app() {
    this.mkdir('app');
    this.mkdir('app/scripts/vendor');
    this.mkdir('app/styles/sass');
    this.mkdir('app/images');
    this.write('app/index.html', this.indexFile);

    this.write('app/scripts/main.js', 'console.log(\'\\\'Allo \\\'Allo!\');');

    this.copy('plugins.js', 'app/scripts/plugins.js');
};

WebappDelGenerator.prototype.install = function () {
  if (this.options['skip-install']) {
    return;
  }

  var done = this.async();
  this.installDependencies({
    skipMessage: this.options['skip-install-message'],
    skipInstall: this.options['skip-install'],
    callback: done
  });
};
