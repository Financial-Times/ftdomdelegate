module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    buster: {},

    browserify: {
      build: {
        src: 'lib/delegate.js',
        dest: 'build/<%= pkg.name %>.js'
      },
      options: {
        browserifyOptions: {
          standalone: 'Delegate'
        }
      }
    },

    uglify: {
       build: {
         src: 'build/<%= pkg.name %>.js',
         dest: 'build/<%= pkg.name %>.min.js'
       }
    },

    jshint: {
      all: [
        '*.js',
        'lib/**/*.js',
        'test/*.js',
        'test/tests/*.js',
        '*.json'
      ]
    }

  });

  grunt.loadNpmTasks('grunt-buster');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task.
  grunt.registerTask('default', ['browserify', 'uglify', 'jshint']);
};
