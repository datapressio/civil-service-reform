module.exports = function(grunt) {
  var pkg = grunt.file.readJSON('package.json');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-coffee');

  grunt.initConfig({
    pkg: pkg,
    less: {
      options: { yuicompress: true },
      build: {
        src: 'src/index.less',
        dest: 'build/index.min.css'
      }
    },
    copy: {
      main: {
        files: [
          { expand:true,cwd:'src/static',src:['**'],dest:'build/static'},
        ]
      }
    },
    coffee: {
      main: {
        files: {
          'build/app.min.js' : 'src/app.coffee'
        }
      }
    },
    watch: {
      less: {
        files: 'src/**/*.less',
        tasks: 'less'
      },
      coffee: {
        files: 'src/**/*.coffee',
        tasks: 'coffee'
      }
    }
  });

  grunt.registerTask('default', ['less','coffee','copy']);
};
