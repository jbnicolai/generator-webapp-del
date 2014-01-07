> **ALERT:** This generator is always changing.

# Customized Web app generator [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

Yeoman generator that scaffolds out a front-end web app with stuff I like to use.


## Features

* Most things copied from generator-webapp

## Prereqs

* [Sass Globbing](https://github.com/chriseppstein/sass-globbing) `gem install sass-globbing`

## Getting Started

- Install: `npm install -g generator-webapp-del`
- Run: `yo webapp-del`
- Run `grunt` for building and `grunt serve` for preview [*](#serve-note)


#### Third-Party Dependencies

*(HTML/CSS/JS/Images/etc)*

Third-party dependencies are managed with [bower-install](https://github.com/stephenplusplus/grunt-bower-install). Add new dependencies using **Bower** and then run the **Grunt** task to load them:

```bash
  bower install --save jquery
  grunt bower-install
```

This works if the package author has followed the [Bower spec](https://github.com/bower/bower.json-spec). If the files are not automatically added to your index.html, check with the package's repo for support and/or file an issue with them to have it updated.

To manually add dependencies, `bower install depName --save` to get the files, then add a `script` or `style` tag to your `index.html` or an other appropriate place.


#### Grunt Serve Note

Note: `grunt server` was previously used for previewing in earlier versions of the project and is being deprecated in favor of `grunt serve`.


## Options

* `--skip-install`

  Skips the automatic execution of `bower` and `npm` after scaffolding has finished.

* `--test-framework=<framework>`

  Defaults to `mocha`. Can be switched for another supported testing framework like `jasmine`.



## License

[BSD license](http://opensource.org/licenses/bsd-license.php)
