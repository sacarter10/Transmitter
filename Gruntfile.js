module.exports = function(grunt) {
  // Load plugins
  grunt.loadNpmTasks('grunt-prettify');
  grunt.loadNpmTasks('grunt-githooks');
  grunt.loadNpmTasks('grunt-contrib-jshint'); //not using this yet!

  grunt.loadNpmTasks('grunt-contrib-sass'); //not using this yet!

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    githooks: {
      all: {
        'pre-commit': 'default',
      }
    },
    prettify: {
      options: {
        "condense": true,
        "unformatted": [
          "a",
          "pre"
        ]
      },
      all: {
        expand: true,
        cwd: 'public/',
        ext: '.html',
        src: ['*.html'],
        dest: 'public/'
      }
    }
  });

  // register task(s).
  grunt.registerTask('default', ['prettify']);

};