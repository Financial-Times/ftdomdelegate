module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    buster: {},

    uglify: {
       build: {
         src: 'lib/delegate.js',
         dest: 'build/<%= pkg.name %>.min.js'
       }
    },

    copy: {
      main: {
        src: 'lib/delegate.js',
        dest: 'build/<%= pkg.name %>.js'
      }
    },

    jshint: {
      all: [
        '*.js',
        'lib/**/*.js',
        'test/*.js',
        'test/tests/*.js',
        '*.json'
      ],
      options: {
        'predef': ['define']
      }
    }

  });

  grunt.loadNpmTasks('grunt-buster');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task.
  grunt.registerTask('default', ['uglify', 'jshint', 'copy']);
};
