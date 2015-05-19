module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-qunit-istanbul');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');


  grunt.initConfig({
    watch: {
      scripts: {
        files: ['src/*.js', 'src/**/*.js'],
        tasks: ['concat'],
      }
    },

    concat: {
      dist: {
        src: [
          'src/*.js'
        ],
        dest: 'dist/circle-arrow.js',
        nonull: true,
      },
    },

    qunit: {
      options: {
        coverage: {
          disposeCollector: true,
          src: [
            'src/*.js'
          ],
          instrumentedFiles: 'temp/',
          lcovReport: 'report',
          linesThresholdPct: 90
        }
      },
      files: ['tests/index.html']
    },

    jshint: {
      sources: {
        src: [
          'src/*.js'
        ],
      },

      tests: {
        options: {
          'debug': true,
        },
        src: ['tests/*.js'],
      }
    }
  });

  grunt.registerTask('default', ['concat', 'jshint']);
  grunt.registerTask('travis', ['jshint:sources', 'qunit']);
};