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
        standalone: 'Delegate'
      }
    },

    uglify: {
       build: {
         src: 'build/<%= pkg.name %>.js',
         dest: 'build/<%= pkg.name %>.min.js'
       }
     }

  });

  grunt.loadNpmTasks('grunt-buster');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task.
  grunt.registerTask('default', ['browserify', 'uglify']);
};
