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

WebappDelGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // welcome message
  if (!this.options['skip-welcome-message']) {
    console.log(this.yeoman);
    console.log(chalk.magenta('Out of the box I include HTML5 Boilerplate, jQuery, and a Gruntfile.js to build your app.'));
  }

  // var prompts = [{
  //   type: 'checkbox',
  //   name: 'features',
  //   message: 'What more would you like?',
  //   choices: [{
  //     name: 'Bootstrap for Sass',
  //     value: 'compassBootstrap',
  //     checked: true
  //   }, {
  //     name: 'Modernizr',
  //     value: 'includeModernizr',
  //     checked: true
  //   }]
  // }];

  // this.prompt(prompts, function (answers) {
  //   var features = answers.features;

  //   function hasFeature(feat) { return features.indexOf(feat) !== -1; }

  //   // manually deal with the response, get back and store the results.
  //   // we change a bit this way of doing to automatically do this in the self.prompt() method.
  //   this.compassBootstrap = hasFeature('compassBootstrap');
  //   this.includeModernizr = hasFeature('includeModernizr');

  //   cb();
  // }.bind(this));

  var prompts = [{
    type: 'confirm',
    name: 'someOption',
    message: 'Continue, yo!?',
    default: true
  }];

  this.prompt(prompts, function (props) {
    this.someOption = props.someOption;

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
  // var bs;

  this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));
  this.indexFile = this.engine(this.indexFile, this);

  // if (this.compassBootstrap) {
  //   // wire Twitter Bootstrap plugins
  //   bs = 'bower_components/sass-bootstrap/js/';
  //   this.indexFile = this.appendScripts(this.indexFile, 'scripts/plugins.js', [
  //     bs + 'affix.js',
  //     bs + 'alert.js',
  //     bs + 'dropdown.js',
  //     bs + 'tooltip.js',
  //     bs + 'modal.js',
  //     bs + 'transition.js',
  //     bs + 'button.js',
  //     bs + 'popover.js',
  //     bs + 'carousel.js',
  //     bs + 'scrollspy.js',
  //     bs + 'collapse.js',
  //     bs + 'tab.js'
  //   ]);
  // }

  this.indexFile = this.appendFiles({
    html: this.indexFile,
    fileType: 'js',
    optimizedPath: 'scripts/main.js',
    sourceFileList: ['scripts/main.js'],
    searchPath: '{app,.tmp}'
  });
};

WebappDelGenerator.prototype.app = function app() {
  this.mkdir('app');
  this.mkdir('app/scripts/vendor');
  this.mkdir('app/styles/sass');
  this.mkdir('app/images');
  this.write('app/index.html', this.indexFile);

  // if (this.coffee) {
  //   this.write(
  //     'app/scripts/main.coffee',
  //     'console.log "\'Allo from CoffeeScript!"'
  //   );
  // }
  // else {
    this.write('app/scripts/main.js', 'console.log(\'\\\'Allo \\\'Allo!\');');
  // }
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
